"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ifdTypes_1 = require("./ifdTypes");
var cameraModels_1 = require("./cameraModels");
var exifTags_1 = require("./exifTags");
//TODO! Not only finish the IFDReader class but add support for MakerNotes, i will PROBABLY make another class purely to handle that.
/**
 * The entry point to use ExifJS
 */
var Reader = /** @class */ (function () {
    function Reader() {
        this.cameraMapping = undefined;
        this.buffer = undefined;
    }
    /**
     * Set the file buffer to read EXIF from
     * @param buffer The file's ArrayBuffer
     */
    Reader.prototype.setBuffer = function (buffer) {
        this.buffer = buffer;
    };
    /**
     * Manually set the maker and model of the camera to determine its mapping
     * @param maker The camera's maker (e.g., Nikon)
     * @param model  The camera's model (e.g., Z6_2)
     */
    Reader.prototype.setModel = function (maker, model) {
        var _a;
        this.cameraMapping = (_a = cameraModels_1.CameraModels[maker]) === null || _a === void 0 ? void 0 : _a[model];
    };
    /**
     * Determine the camera model (and thus the mapping) from the file buffer.
     * May not work or may be inaccurate, so use setModel if possible.
     */
    Reader.prototype.determineModel = function () { };
    /**
     * Gets all standard EXIF tags from the file buffer
     */
    Reader.prototype.getStandardTags = function () {
        if (!this.cameraMapping) {
            throw new Error("Camera model not set. Use setModel() to set the camera model before reading tags.");
        }
    };
    /**
     * Gets all MakerNote specific tags from the file buffer
     */
    Reader.prototype.getMakerNoteTags = function () {
        if (!this.cameraMapping) {
            throw new Error("Camera model not set. Use setModel() to set the camera model before reading tags.");
        }
    };
    Reader.prototype.getIFDReader = function () {
        if (!this.buffer) {
            throw new Error("Bufffer is not set.");
        }
        return new IFDReader(this.buffer);
    };
    return Reader;
}());
exports.default = Reader;
/**
 * This manages reading standard TIFF / EXIF (2.3) IFD tags.
 */
var IFDReader = /** @class */ (function () {
    /**
     * Constructs a new IFDReader class instance
     * @param buffer The image buffer
     */
    function IFDReader(buffer) {
        /**
         * EXIF IFD Offset
         */
        this.EXIFIFDOffset = undefined;
        /**
         * Number of IFD entries in the EXIFIFD region
         */
        this.EXIFNumEntries = undefined;
        this.buf = buffer;
        this.TIFFStart = this.findTIFFStart();
        this.le = this.detectEndian();
        this.readUInt16 = this.buf[this.le ? "readUInt16LE" : "readUInt16BE"].bind(this.buf);
        this.readUInt32 = this.buf[this.le ? "readUInt32LE" : "readUInt32BE"].bind(this.buf);
        this.IFDOffset = this.readIFDOffset();
        // console.log(`TIFFStart: ${"0x" + this.TIFFStart.toString(16).toUpperCase().padStart(4, "0")}`);
        // console.log(`IFDOffset: ${"0x" + this.IFDOffset.toString(16).toUpperCase().padStart(4, "0")}`);
        this.verifyTIFFHeader();
        this.IFD0Tags = this.getAllIFD0Tags();
        var ExifOffset = this.IFD0Tags.get("ExifOffset");
        if (!ExifOffset)
            throw new Error("Could not find ExifOffset (0x8769)");
        this.EXIFIFDOffset = Number(ExifOffset.tagValue);
    }
    /**
     * Converts number into hex rep
     * @param {number} num - The number to be converted into
     * @returns {string} the 0x<> string.
     */
    IFDReader.prototype.toHexString = function (num) {
        return "0x" + num.toString(16).toUpperCase().padStart(4, "0");
    };
    /**
     * Finds TIFF APP1 Segment Start
     * @returns {number} Tiff start offset
     */
    IFDReader.prototype.findTIFFStart = function () {
        if (this.buf[0] === 0xff && this.buf[1] === 0xd8) {
            var offset = 2;
            while (offset < this.buf.length) {
                if (this.buf[offset] !== 0xff) {
                    offset++;
                    continue;
                }
                while (this.buf[offset] === 0xff)
                    offset++;
                var marker = this.buf[offset++];
                if (marker === 0xd9)
                    break; // EOI
                if (offset + 2 > this.buf.length)
                    break;
                var length = this.buf.readUInt16BE(offset);
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
    };
    /**
     * Detects if the file is littleEndian or not.
     * @returns {boolean} littleEndian, true given such.
     */
    IFDReader.prototype.detectEndian = function () {
        var endian = this.buf.toString("ascii", this.TIFFStart, this.TIFFStart + 2);
        if (endian === "II")
            return true;
        if (endian === "MM")
            return false;
        throw new Error("Invalid TIFF Endian Header");
    };
    /**
     * Verifies the TIFF Magic number
     */
    IFDReader.prototype.verifyTIFFHeader = function () {
        var magic = this.readUInt16(this.TIFFStart + 2);
        if (magic != 0x2a)
            throw new Error("Invalid TIFF header magic number");
    };
    /**
     * Reads the IFD offset
     */
    IFDReader.prototype.readIFDOffset = function () {
        return this.readUInt32(this.TIFFStart + 4);
    };
    /**
     * Get a buffer where a tag value may be PTR or INLINE
     * @param count number of components
     * @param valueOffset the 4-byte valueOffset field
     * @param typeSize size in bytes of a single component
     */
    IFDReader.prototype.getValueBuffer = function (count, valueOffset, typeSize) {
        var totalSize = count * typeSize;
        //console.log(`VO: ${this.toHexString(valueOffset)}`);
        if (totalSize <= 4) {
            var buf = Buffer.alloc(totalSize);
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
        }
        else {
            var start = this.TIFFStart + valueOffset;
            return this.buf.slice(start, start + totalSize);
        }
    };
    /**
     * Read an unsigned 8-bit byte from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The unsigned byte value.
     */
    IFDReader.prototype.readByte = function (offset) {
        var buf = this.getValueBuffer(1, offset, 1);
        return buf.readUInt8(0);
    };
    /**
     * Read a signed 8-bit byte from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The signed byte value.
     */
    IFDReader.prototype.readSByte = function (offset) {
        var buf = this.getValueBuffer(1, offset, 1);
        return buf.readInt8(0);
    };
    /**
     * Read an ASCII string from the buffer.
     * @param {number} offset - The starting offset of the string.
     * @param {number} count - The number of bytes to read.
     * @returns {string} The decoded ASCII string (trimmed at null terminator if present).
     */
    IFDReader.prototype.readASCII = function (offset, count) {
        var buf = this.getValueBuffer(count, offset, 1);
        var str = buf.toString("ascii");
        var zeroIndex = str.indexOf("\0");
        return zeroIndex >= 0 ? str.slice(0, zeroIndex) : str;
    };
    /**
     * Read a raw undefined/byte sequence from the buffer.
     * @param {number} offset - The starting offset of the data.
     * @param {number} count - The number of bytes to read.
     * @returns {Buffer} The raw byte slice.
     */
    IFDReader.prototype.readUndefined = function (offset, count) {
        if (count == 1)
            return this.readLong(offset);
        return this.getValueBuffer(count, offset, 1);
    };
    /**
     * Read an unsigned 16-bit short from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The unsigned 16-bit value.
     */
    IFDReader.prototype.readShort = function (offset, count) {
        if (count === void 0) { count = 1; }
        var buf = this.getValueBuffer(count, offset, 2);
        if (count === 1)
            return this.le ? buf.readUInt16LE(0) : buf.readUInt16BE(0);
        var arr = [];
        for (var i = 0; i < count; i++) {
            arr.push(this.le ? buf.readUInt16LE(i * 2) : buf.readUInt16BE(i * 2));
        }
        return arr;
    };
    /**
     * Read a signed 16-bit short from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The signed 16-bit value.
     */
    IFDReader.prototype.readSShort = function (offset, count) {
        if (count === void 0) { count = 1; }
        var buf = this.getValueBuffer(count, offset, 2);
        if (count === 1)
            return this.le ? buf.readInt16LE(0) : buf.readInt16BE(0);
        var arr = [];
        for (var i = 0; i < count; i++) {
            arr.push(this.le ? buf.readInt16LE(i * 2) : buf.readInt16BE(i * 2));
        }
        return arr;
    };
    /**
     * Read an unsigned 32-bit long from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The unsigned 32-bit value.
     */
    IFDReader.prototype.readLong = function (offset) {
        var buf = this.getValueBuffer(1, offset, 4);
        return this.le ? buf.readUInt32LE(0) : buf.readUInt32BE(0);
    };
    /**
     * Read a signed 32-bit long from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The signed 32-bit value.
     */
    IFDReader.prototype.readSLong = function (offset) {
        var buf = this.getValueBuffer(1, offset, 4);
        return this.le ? buf.readInt32LE(0) : buf.readInt32BE(0);
    };
    /**
     * Read an unsigned 32-bit rational (numerator/denominator) from the buffer.
     * @param {number} offset - The starting offset of the rational value.
     * @returns {number} The computed rational value as a floating-point number.
     */
    IFDReader.prototype.readRational = function (offset) {
        var buf = this.getValueBuffer(1, offset, 8);
        var numerator = this.le ? buf.readUInt32LE(0) : buf.readUInt32BE(0);
        var denominator = this.le ? buf.readUInt32LE(4) : buf.readUInt32BE(4);
        return denominator !== 0 ? numerator / denominator : 0;
    };
    /**
     * Read a signed 32-bit rational (numerator/denominator) from the buffer.
     * @param {number} offset - The starting offset of the rational value.
     * @returns {number} The computed signed rational value as a floating-point number.
     */
    IFDReader.prototype.readSRational = function (offset) {
        var buf = this.getValueBuffer(1, offset, 8);
        var numerator = this.le ? buf.readInt32LE(0) : buf.readInt32BE(0);
        var denominator = this.le ? buf.readInt32LE(4) : buf.readInt32BE(4);
        return denominator !== 0 ? numerator / denominator : 0;
    };
    /**
     * Read a 32-bit IEEE 754 floating-point number from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The floating-point value.
     */
    IFDReader.prototype.readFloatValue = function (offset) {
        var buf = this.getValueBuffer(1, offset, 4);
        return this.le ? buf.readFloatLE(0) : buf.readFloatBE(0);
    };
    /**
     * Read a 64-bit IEEE 754 double-precision number from the buffer.
     * @param {number} offset - The byte offset in the buffer.
     * @returns {number} The double-precision floating-point value.
     */
    IFDReader.prototype.readDoubleValue = function (offset) {
        var buf = this.getValueBuffer(1, offset, 8);
        return this.le ? buf.readDoubleLE(0) : buf.readDoubleBE(0);
    };
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
    IFDReader.prototype.readNumEntries = function (sectionOffset) {
        return this.readUInt16(this.TIFFStart + sectionOffset);
    };
    /**
     * Reads an IFD Tag given the sectionOffset, this is the offset FROM the tiff header, not including the tiff start, and an index
     * @param {number} sectionOffset - The offset of the given IFD section which is to be read
     * @param {number} index - The index of the tag which is targeted
     */
    IFDReader.prototype.readIFDTag = function (sectionOffset, index) {
        var _a, _b;
        var numEntries = this.readNumEntries(sectionOffset);
        if (index >= numEntries) {
            throw new Error("IFD Index out of bounds, numEntries: ".concat(numEntries));
        }
        var entryOffset = this.TIFFStart + sectionOffset + 2 + index * 12;
        var tagID = this.readUInt16(entryOffset);
        var tagType = this.readUInt16(entryOffset + 2);
        var tagCount = this.readUInt32(entryOffset + 4);
        var valueOffset = this.readUInt32(entryOffset + 8);
        var readAlias = [
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
        if (!readAlias)
            throw new Error("Unknown IFD Tag Type: ".concat(tagType));
        //! Something awry with finding ExifVersion (0x9000...) very awry, VO should never be over 0xFFFF
        //console.log(`SO-TS: ${sectionOffset - this.TIFFStart}, SO: ${sectionOffset} EO: ${entryOffset}, TI: ${this.toHexString(tagID)}, TT: ${tagType}, TC: ${tagCount}, VO: ${this.toHexString(valueOffset)}, RA: ${0}`);
        var tagValue = tagType !== ifdTypes_1.IFDTypes.ASCII && tagType !== ifdTypes_1.IFDTypes.UNDEFINED
            ? readAlias.call(this, valueOffset, tagCount)
            : readAlias.call(this, valueOffset);
        var tagName = (_b = (_a = exifTags_1.ExifTags[tagID]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : this.toHexString(tagID);
        return {
            tagID: tagID,
            tagType: tagType,
            tagCount: tagCount,
            tagValue: tagValue,
            tagName: tagName,
        };
    };
    IFDReader.prototype.getAllIFD0Tags = function () {
        var IFDEntryCount = this.readNumEntries(this.IFDOffset);
        var tags = new Map();
        for (var i = 0; i < IFDEntryCount; i++) {
            var tag = this.readIFDTag(this.IFDOffset, i);
            tags.set(tag.tagName, tag);
        }
        return tags;
    };
    return IFDReader;
}());
/**
 * Handles reading MakerNotes of some EXIF data based on the platform.
 */
// @ts-ignore
// 'MakerNoteReader' is declared but never used
var MakerNoteReader = /** @class */ (function () {
    function MakerNoteReader() {
    }
    return MakerNoteReader;
}());
//!TODO: Convert @getAllIFD0Tags and readIFD0Tag to be IFD-Agnostic and offset-based, theoretically getAllIFD0Tags is fine but underlying func should work everywhere. DRY!
//# sourceMappingURL=index.js.map