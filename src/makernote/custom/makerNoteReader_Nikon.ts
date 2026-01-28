
import { IFDTag } from "../../../typings";
import IFDReader from "../../ifd/ifdReader";
import TIFFReader from "../../ifd/tiffReader";
import { NIKON_V3_TAGS } from "../../meta/makernote/nikon";

class MakerNoteReader_Nikon {
    static parse(buffer: Buffer): Record<string, IFDTag> {
        const endianMarker = buffer.toString('ascii', 10, 12);
        const littleEndian = endianMarker === "II";

        const ifdOffset = littleEndian 
            ? buffer.readUInt32LE(14)
            : buffer.readUInt32BE(14);

        const reader = new IFDReader(
            buffer,
            ifdOffset,
            10,
            littleEndian,
            NIKON_V3_TAGS
        );

        return reader.getAllTags();
    }
}

export default MakerNoteReader_Nikon;