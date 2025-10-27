import IFDTypes from "./meta/ifdTypes";
import { EXIFTagMapping, IFDTag } from "../typings";
import { ExifTags } from "./meta/exifTags";
import log from "./debug/debugger";

/**
 * Reads a given IFD section based on image buffer, IFD Offset and endianness
 */
class IFDReader {
  private readUInt16: (offset: number) => number;
  private readUInt32: (offset: number) => number;

  /**
   * Image Buffer
   */
  private buf: Buffer<ArrayBufferLike>;

  /**
   * Offset of the IFD section from the file's start
   */
  private IFDOffset: number;

  /**
   * Self explanatory really, true = LE, false = BE
   */
  private littleEndian: boolean;

  /**
   * Stores found IFD Tags from readAllIFDTags()
   */
  private tags: Map<string, IFDTag> = new Map();

  /**
   * The tiff start offset.
   */
  private TIFFStart: number;

  /**
   * Constructs a new IFDReader class instance
   * @param {Buffer} buffer The image buffer
   * @param {number} relIFDOffset The offset of the given IFD from the start of the file, (TiffOffset + IFDOffset)
   * @param {boolean} littleEndian The endianness of this,
   */
  constructor(buffer: Buffer, relIFDOffset: number, tiffStartOffset: number, littleEndian: boolean) {
    this.buf = buffer;

    this.IFDOffset = relIFDOffset;
    this.TIFFStart = tiffStartOffset;

    this.littleEndian = littleEndian;

    log(`IFDReader buffLen: ${this.buf.length} IFDOffset: ${this.IFDOffset} littleEndian: ${this.littleEndian}`);

    this.readUInt16 = this.buf[this.littleEndian ? "readUInt16LE" : "readUInt16BE"].bind(this.buf);
    this.readUInt32 = this.buf[this.littleEndian ? "readUInt32LE" : "readUInt32BE"].bind(this.buf);

    this.readAllIFDtags();

    
  }

  /**
   * Converts number into hex rep
   * @param {number} num - The number to be converted into
   * @returns {string} the 0x<> string.
   */
  toHexString(num: number): string {
    return "0x" + num.toString(16).toUpperCase().padStart(4, "0");
  }

  /**
   * Get a buffer where a tag value may be PTR or INLINE
   * @param count number of components
   * @param valueOffset the 4-byte valueOffset field
   * @param typeSize size in bytes of a single component
   */
  private getValueBuffer(count: number, valueOffset: number, typeSize: number): Buffer {
    const totalSize = count * typeSize;

    //console.log(`VO: ${this.toHexString(valueOffset)}`);

    if (totalSize <= 4) {
      const buf = Buffer.alloc(totalSize);
      switch (typeSize) {
        case 1:
          buf.writeUInt8(valueOffset, 0);
          break;
        case 2:
          this.littleEndian ? buf.writeUInt16LE(valueOffset, 0) : buf.writeUInt16BE(valueOffset, 0);
          break;
        case 4:
          this.littleEndian ? buf.writeUInt32LE(valueOffset, 0) : buf.writeUInt32BE(valueOffset, 0);
          break;
      }
      return buf;
    } else {
      const start = this.TIFFStart + valueOffset;
      return this.buf.slice(start, start + totalSize);
    }
  }

  /**
   *  IFD Tag Format
   *  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
   *  | Bytes  | 0      | 1      | 2      | 3      | 4      | 5      | 6      | 7      | 8      | 9      | 10     | 11     |
   *  +--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
   *  | Field  | Tag ID (2 bytes)| Type (2 bytes)  | Count (4 bytes)                   | Value Offset / Value (4 bytes)    |
   *  +--------+-----------------+-----------------+-----------------------------------+-----------------------------------+
   *  | Means  | Identifies the  | Indicates data  | Number of components              | Either the value (if <=4 bytes)   |
   *  |        | tag             | type            | of the data type                  | or offset to actual value         |
   *  +--------+-----------------+-----------------+-----------------------------------+-----------------------------------+
   */

  readNumEntries(sectionOffset: number): number {
    return this.readUInt16(this.TIFFStart + sectionOffset);
  }

  /**
   * Read an ASCII string from the buffer.
   * @param {number} offset - The starting offset of the string.
   * @param {number} count - The number of bytes to read.
   * @returns {string} The decoded ASCII string (trimmed at null terminator if present).
   */
  private readASCII(offset: number, count: number): string {
    const buf = this.getValueBuffer(count, offset, 1);
    const str = buf.toString("ascii");
    const zeroIndex = str.indexOf("\0");
    return zeroIndex >= 0 ? str.slice(0, zeroIndex) : str;
  }

  /**
   * Generic-isised code to allow reading of count > 1 tags, casts to T[] | T
   */
  private readArray<T>(offset: number, count: number, size: number, reader: (buf: Buffer, off: number) => T): T[] {
    const buffer = this.getValueBuffer(count, offset, size);
    const arr: T[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(reader(buffer, i * size));
    }
    return arr;
  }

  /**
   * Reads a tag as rawdata for casting
   * @param offset
   * @param type
   * @param count
   */
  private readData(offset: number, type: IFDTypes, count: number): any {
    switch (type) {
      case IFDTypes.BYTE:
        return this.readArray(offset, count, 1, (b, o) => b.readUInt8(o));
      case IFDTypes.ASCII:
        return this.readASCII(offset, count);
      case IFDTypes.UINT16:
        return this.readArray(offset, count, 2, (b, o) => (this.littleEndian ? b.readUInt16LE(o) : b.readUInt16BE(o)));
      case IFDTypes.UINT32:
        return this.readArray(offset, count, 4, (b, o) => (this.littleEndian ? b.readUInt32LE(o) : b.readUInt32BE(o)));
      case IFDTypes.URATIONAL64:
        return this.readArray(offset, count, 8, (b, o) => {
          const num = this.littleEndian ? b.readUInt32LE(o) : b.readUInt32BE(o);
          const den = this.littleEndian ? b.readUInt32LE(o + 4) : b.readUInt32BE(o + 4);
          return { numerator: num, denominator: den, resolved: den !== 0 ? num / den : 0 };
        });
      case IFDTypes.SBYTE:
        return this.readArray(offset, count, 1, (b, o) => b.readInt8(o));
      case IFDTypes.UNDEFINED:
        return this.getValueBuffer(count, offset, 1);
      case IFDTypes.INT16:
        return this.readArray(offset, count, 2, (b, o) => (this.littleEndian ? b.readInt16LE(o) : b.readInt16BE(o)));
      case IFDTypes.INT32:
        return this.readArray(offset, count, 4, (b, o) => (this.littleEndian ? b.readInt32LE(o) : b.readInt32BE(o)));
      case IFDTypes.RATIONAL64:
        return this.readArray(offset, count, 8, (b, o) => {
          const num = this.littleEndian ? b.readInt32LE(o) : b.readInt32BE(o);
          const den = this.littleEndian ? b.readInt32LE(o + 4) : b.readInt32BE(o + 4);
          return { numerator: num, denominator: den, resolved: den !== 0 ? num / den : 0 };
        });
      case IFDTypes.FLOAT:
        return this.readArray(offset, count, 4, (b, o) => (this.littleEndian ? b.readFloatLE(o) : b.readFloatBE(o)));
      case IFDTypes.DOUBLE:
        return this.readArray(offset, count, 8, (b, o) => (this.littleEndian ? b.readDoubleLE(o) : b.readDoubleBE(o)));
      default:
        throw new Error(`Unknown IFD Type: ${type}`);
    }
  }

  /**
   * Reads an IFD Tag given the sectionOffset, this is the offset FROM the tiff header, not including the tiff start, and an index
   * @param {number} ifdSectionOffset - The offset of the given IFD section which is to be read
   * @param {number} index - The index of the tag which is targeted
   * @returns {IFDTag} ifdTag read from the EXIF IFD section and index.
   */
  readIFDTag(sectionOffset: number, index: number): IFDTag {
    const numEntries = this.readNumEntries(sectionOffset);
    if (index >= numEntries) {
      throw new Error(`IFD Index out of bounds, numEntries: ${numEntries}`);
    }

    const entryOffset = this.TIFFStart + sectionOffset + 2 + index * 12;
    const tagID = this.readUInt16(entryOffset);
    const tagType = this.readUInt16(entryOffset + 2);
    const tagCount = this.readUInt32(entryOffset + 4);
    const valueOffset = this.readUInt32(entryOffset + 8);

    const tagValue = this.readData(valueOffset, tagType - 1, tagCount);

    const tagName = ExifTags[tagID]?.name ?? this.toHexString(tagID);

    //! Not happy that this just 'works' and the type presumably is EITHER inferred or coerced but it works for what I'm doing...
    return { tagID, tagType, tagCount, tagValue, tagName };
  }

  private readAllIFDtags(): void {
    const IFDEntryCount = this.readNumEntries(this.IFDOffset);
    log(`IFDReader Reading ${IFDEntryCount} IFD entries at offset ${this.IFDOffset}`);

    for (let i = 0; i < IFDEntryCount; i++) {
      try {
        const tag = this.readIFDTag(this.IFDOffset, i);
        this.tags.set(tag.tagName, tag);
        log(`IFDReader Read IFD tag [${i}] - ID: ${tag.tagID} (${tag.tagName}), Type: ${tag.tagType}, Count: ${tag.tagCount}, Value: ${JSON.stringify(tag.tagValue)} VT: ${typeof tag.tagValue}`);
      } catch (e) {
        log(`IFDReader Error reading tag at index ${i} -> ${e.name}: ${e.message}`);
      }
    }
  }

  getAllTags(): typeof this.tags {
    return this.tags;
  }

  get tagsMap() {
    return this.tags;
  }
}

export default IFDReader;
