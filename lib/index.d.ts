import { IFDTag } from "../typings";
/**
 * The entry point to use ExifJS
 */
export default class Reader {
    private cameraMapping;
    private buffer;
    constructor();
    /**
     * Set the file buffer to read EXIF from
     * @param buffer The file's ArrayBuffer
     */
    setBuffer(buffer: Buffer<ArrayBufferLike>): void;
    /**
     * Manually set the maker and model of the camera to determine its mapping
     * @param maker The camera's maker (e.g., Nikon)
     * @param model  The camera's model (e.g., Z6_2)
     */
    setModel(maker: string, model: string): void;
    /**
     * Determine the camera model (and thus the mapping) from the file buffer.
     * May not work or may be inaccurate, so use setModel if possible.
     */
    determineModel(): void;
    /**
     * Gets all standard EXIF tags from the file buffer
     */
    getStandardTags(): void;
    /**
     * Gets all MakerNote specific tags from the file buffer
     */
    getMakerNoteTags(): void;
    getIFDReader(): IFDReader;
}
/**
 * This manages reading standard TIFF / EXIF (2.3) IFD tags.
 */
declare class IFDReader {
    /**
     * Image Buffer
     */
    private buf;
    /**
     * The start of the TIFF segment in the file
     */
    private TIFFStart;
    /**
     * Little Endian-ness
     */
    private le;
    /**
     * The Offset to the APP1 segment
     */
    private IFDOffset;
    private IFD0Tags;
    /**
     * EXIF IFD Offset
     */
    private EXIFIFDOffset;
    /**
     * Number of IFD entries in the EXIFIFD region
     */
    private EXIFNumEntries;
    private readUInt16;
    private readUInt32;
    /**
     * Constructs a new IFDReader class instance
     * @param buffer The image buffer
     */
    constructor(buffer: Buffer);
    /**
     * Finds TIFF APP1 Segment Start
     * @returns {number} Tiff start offset
     */
    private findTIFFStart;
    /**
     * Detects if the file is littleEndian or not.
     * @returns {boolean} littleEndian, true given such.
     */
    private detectEndian;
    /**
     * Verifies the TIFF Magic number
     */
    private verifyTIFFHeader;
    /**
     * Reads the IFD offset
     */
    private readIFDOffset;
    /**
     * Get a buffer where a tag value may be PTR or INLINE
     * @param tagType EXIF/IFD type
     * @param count number of components
     * @param valueOffset the 4-byte valueOffset field
     * @param typeSize size in bytes of a single component
     */
    private getValueBuffer;
    /**
     * Read an unsigned 8-bit byte from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The unsigned byte value.
     */
    private readByte;
    /**
     * Read a signed 8-bit byte from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The signed byte value.
     */
    private readSByte;
    /**
     * Read an ASCII string from the buffer.
     * @param {number} offset - The starting offset of the string.
     * @param {number} count - The number of bytes to read.
     * @returns {string} The decoded ASCII string (trimmed at null terminator if present).
     */
    private readASCII;
    /**
     * Read a raw undefined/byte sequence from the buffer.
     * @param {number} offset - The starting offset of the data.
     * @param {number} count - The number of bytes to read.
     * @returns {Buffer} The raw byte slice.
     */
    private readUndefined;
    /**
     * Read an unsigned 16-bit short from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The unsigned 16-bit value.
     */
    private readShort;
    /**
     * Read a signed 16-bit short from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The signed 16-bit value.
     */
    private readSShort;
    /**
     * Read an unsigned 32-bit long from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The unsigned 32-bit value.
     */
    private readLong;
    /**
     * Read a signed 32-bit long from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The signed 32-bit value.
     */
    private readSLong;
    /**
     * Read an unsigned 32-bit rational (numerator/denominator) from the buffer.
     * @param {number} offset - The starting offset of the rational value.
     * @returns {number} The computed rational value as a floating-point number.
     */
    private readRational;
    /**
     * Read a signed 32-bit rational (numerator/denominator) from the buffer.
     * @param {number} offset - The starting offset of the rational value.
     * @returns {number} The computed signed rational value as a floating-point number.
     */
    private readSRational;
    /**
     * Read a 32-bit IEEE 754 floating-point number from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The floating-point value.
     */
    private readFloatValue;
    /**
     * Read a 64-bit IEEE 754 double-precision number from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The double-precision floating-point value.
     */
    private readDoubleValue;
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
    readNumEntries(sectionOffset: number): number;
    /**
     * Reads an IFD Tag given the sectionOffset, this is the offset FROM the tiff header, not including the tiff start, and an index
     * @param {number} sectionOffset - The offset of the given IFD section which is to be read
     * @param {number} index - The index of the tag which is targeted
     */
    readIFDTag(sectionOffset: number, index: number): IFDTag;
    getAllIFD0Tags(): Map<string, IFDTag>;
}
export {};
