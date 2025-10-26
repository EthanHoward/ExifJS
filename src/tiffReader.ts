import log from "./debug/debugger";

/**
 * Reads information about the TIFF section of the given file
 */
class TIFFReader {
  private buf: Buffer;
  private tiffStart: any;
  private littleEndian: boolean;

  constructor(buffer: Buffer) {
    this.buf = buffer;
    this.tiffStart = this.findTiffStart();
    this.littleEndian = this.detectEndian();

    this.verifyTIFFHeader();

    log(`TIFFReader buffLen: ${this.buf.length} tiffStartOffset: ${this.tiffStart} littleEndian: ${this.littleEndian}`); 
  }

  private findTiffStart(): number {
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
    const endian = this.buf.toString("ascii", this.tiffStart, this.tiffStart + 2);
    if (endian === "II") return true;
    if (endian === "MM") return false;
    throw new Error("Invalid TIFF Endian Header");
  }

  /**
   * Verifies the TIFF Magic number
   */
  private verifyTIFFHeader() {
    const magic = this.littleEndian ? this.buf.readUInt16LE(this.tiffStart + 2) : this.buf.readUInt16BE(this.tiffStart + 2);
    if (magic != 0x2a) throw new Error("Invalid TIFF header magic number");
  }

  /**
   * Returns littleEndian
   * @returns {boolean} endianness, true = LE, false = BE;
   */
  getLittleEndian(): boolean {
    return this.littleEndian;
  }

  /**
   * Returns the offset of the tiffStart from the file start
   * @returns {number} tiffStartOffset
   */
  getTIFFStartOffset(): number {
    return this.tiffStart;
  }

  getFirstIFDOffset(): number {
    const relOffset = this.littleEndian ? this.buf.readUint32LE(this.getTIFFStartOffset() + 4) :this.buf.readUint32BE(this.getTIFFStartOffset() + 4);
    return relOffset + this.getTIFFStartOffset();
  }
}

export default TIFFReader;