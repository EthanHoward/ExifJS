class IFDReader {

  private buf: Buffer<ArrayBufferLike>;


  private TIFFStart: number;


  private le: boolean;

  private IFDOffset: number;

  private IFD0Tags: Map<string, IFDTag>;


  private EXIFIFDOffset: number = undefined!;


  private EXIFNumEntries: number = undefined!;

  private readUInt16: (offset: number) => number;
  private readUInt32: (offset: number) => number;


  constructor(buffer: Buffer) {
    this.buf = buffer;
    this.TIFFStart = this.findTIFFStart();
    this.le = this.detectEndian();

    this.readUInt16 = this.buf[this.le ? "readUInt16LE" : "readUInt16BE"].bind(
      this.buf
    );
    this.readUInt32 = this.buf[this.le ? "readUInt32LE" : "readUInt32BE"].bind(
      this.buf
    );

    this.IFDOffset = this.readIFDOffset();

    // console.log(`TIFFStart: ${"0x" + this.TIFFStart.toString(16).toUpperCase().padStart(4, "0")}`);
    // console.log(`IFDOffset: ${"0x" + this.IFDOffset.toString(16).toUpperCase().padStart(4, "0")}`);

    this.verifyTIFFHeader();

    this.IFD0Tags = this.getAllIFD0Tags();

    const ExifOffset: IFDTag | undefined = this.IFD0Tags.get("ExifOffset");

    if (!ExifOffset) throw new Error("Could not find ExifOffset (0x8769)");

    this.EXIFIFDOffset = Number(ExifOffset.tagValue);
  }



  toHexString(num: number): string {
    return "0x" + num.toString(16).toUpperCase().padStart(4, "0")
  }


  private findTIFFStart(): number {
    if (this.buf[0] === 0xff && this.buf[1] === 0xd8) {
      let offset = 2;
      while (offset < this.buf.length) {
        if (this.buf[offset] !== 0xff) {
          offset++;
          continue;
        }
        while (this.buf[offset] === 0xff) offset++;
        const marker = this.buf[offset++];
        if (marker === 0xd9) break; // EOI
        if (offset + 2 > this.buf.length) break;
        const length = this.buf.readUInt16BE(offset);
        offset += 2;

        if (marker === 0xe1) {
          // APP1
          if (this.buf.toString("ascii", offset, offset + 6) === "Exif\0\0") {
            return offset + 6; // TIFF starts here
          }
        }
        offset += length - 2;
      }
      throw new Error("No EXIF APP1 segment found");
    }

    return 0;
  }


  private detectEndian(): boolean {
    const endian = this.buf.toString(
      "ascii",
      this.TIFFStart,
      this.TIFFStart + 2
    );
    if (endian === "II") return true;
    if (endian === "MM") return false;
    throw new Error("Invalid TIFF Endian Header");
  }



  private verifyTIFFHeader() {
    const magic = this.readUInt16(this.TIFFStart + 2);
    if (magic != 0x2a) throw new Error("Invalid TIFF header magic number");
  }


  private readIFDOffset(): number {
    return this.readUInt32(this.TIFFStart + 4);
  }



  private getValueBuffer(
    count: number,
    valueOffset: number,
    typeSize: number
  ): Buffer {
    const totalSize = count * typeSize;

    //console.log(`VO: ${this.toHexString(valueOffset)}`);

    if (totalSize <= 4) {
      const buf = Buffer.alloc(totalSize);
      switch (typeSize) {
        case 1:
          buf.writeUInt8(valueOffset, 0);
          break;
        case 2:
          this.le
            ? buf.writeUInt16LE(valueOffset, 0)
            : buf.writeUInt16BE(valueOffset, 0);
          break;
        case 4:
          this.le
            ? buf.writeUInt32LE(valueOffset, 0)
            : buf.writeUInt32BE(valueOffset, 0);
          break;
      }
      return buf;
    } else {
      const start = this.TIFFStart + valueOffset;
      return this.buf.slice(start, start + totalSize);
    }
  }
  


  private readByte(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 1);
    return buf.readUInt8(0);
  }


  private readSByte(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 1);
    return buf.readInt8(0);
  }


  private readASCII(offset: number, count: number): string {
    const buf = this.getValueBuffer(count, offset, 1);
    const str = buf.toString("ascii");
    const zeroIndex = str.indexOf("\0");
    return zeroIndex >= 0 ? str.slice(0, zeroIndex) : str;
  }


  private readUndefined(offset: number, count: number): number | Buffer {
    if (count == 1) return this.readLong(offset);
    return this.getValueBuffer(count, offset, 1);
  }

  private readShort(offset: number, count = 1): number | number[] {
    const buf = this.getValueBuffer(count, offset, 2);
    if (count === 1) return this.le ? buf.readUInt16LE(0) : buf.readUInt16BE(0);
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(this.le ? buf.readUInt16LE(i * 2) : buf.readUInt16BE(i * 2));
    }
    return arr;
  }

  private readSShort(offset: number, count = 1): number | number[] {
    const buf = this.getValueBuffer(count, offset, 2);
    if (count === 1) return this.le ? buf.readInt16LE(0) : buf.readInt16BE(0);
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(this.le ? buf.readInt16LE(i * 2) : buf.readInt16BE(i * 2));
    }
    return arr;
  }


  private readLong(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 4);
    return this.le ? buf.readUInt32LE(0) : buf.readUInt32BE(0);
  }

  private readSLong(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 4);
    return this.le ? buf.readInt32LE(0) : buf.readInt32BE(0);
  }


  private readRational(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 8);
    const numerator = this.le ? buf.readUInt32LE(0) : buf.readUInt32BE(0);
    const denominator = this.le ? buf.readUInt32LE(4) : buf.readUInt32BE(4);
    return denominator !== 0 ? numerator / denominator : 0;
  }

  private readSRational(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 8);
    const numerator = this.le ? buf.readInt32LE(0) : buf.readInt32BE(0);
    const denominator = this.le ? buf.readInt32LE(4) : buf.readInt32BE(4);
    return denominator !== 0 ? numerator / denominator : 0;
  }

  private readFloatValue(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 4);
    return this.le ? buf.readFloatLE(0) : buf.readFloatBE(0);
  }

  private readDoubleValue(offset: number): number {
    const buf = this.getValueBuffer(1, offset, 8);
    return this.le ? buf.readDoubleLE(0) : buf.readDoubleBE(0);
  }



  readNumEntries(sectionOffset: number): number {
    return this.readUInt16(this.TIFFStart + sectionOffset);
  }


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

    const readAlias = [
      this.readByte,
      this.readASCII,
      this.readShort,
      this.readLong,
      this.readRational,
      this.readSByte,
      this.readUndefined,
      this.readSShort,
      this.readSLong,
      this.readSRational,
      this.readFloatValue,
      this.readDoubleValue,
    ][tagType - 1];

    if (!readAlias) throw new Error(`Unknown IFD Tag Type: ${tagType}`);
 
    //! Something awry with finding ExifVersion (0x9000...) very awry, VO should never be over 0xFFFF
   //console.log(`SO-TS: ${sectionOffset - this.TIFFStart}, SO: ${sectionOffset} EO: ${entryOffset}, TI: ${this.toHexString(tagID)}, TT: ${tagType}, TC: ${tagCount}, VO: ${this.toHexString(valueOffset)}, RA: ${0}`);

    const tagValue: any =
      tagType !== IFDTypes.ASCII && tagType !== IFDTypes.UNDEFINED
        ? (readAlias as (offset: number, count: number) => any).call(
            this,
            valueOffset,
            tagCount
          )
        : (readAlias as (offset: number) => any).call(this, valueOffset);

    const tagName =
      ExifTags[tagID]?.name ??
      this.toHexString(tagID);

    return {
      tagID,
      tagType,
      tagCount,
      tagValue,
      tagName,
    };
  }

  getAllIFD0Tags(): Map<string, IFDTag> {
    const IFDEntryCount = this.readNumEntries(this.IFDOffset);
    const tags: Map<string, IFDTag> = new Map();
    for (let i = 0; i < IFDEntryCount; i++) {
      const tag = this.readIFDTag(this.IFDOffset, i);
      tags.set(tag.tagName, tag);
    }
    return tags;
  }
}