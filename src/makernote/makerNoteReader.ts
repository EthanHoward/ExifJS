import log from "../debug/debugger";
import MakerNoteReader_Nikon from "./custom/makerNoteReader_Nikon";

class MakerNoteReader {
    private buf: Buffer<ArrayBufferLike>;
    private littleEndian: boolean;

    /**
     * Constructs a new MakerNoteReader class, reads in the MakerNote buffer and the make and model of device used, these are required.
     * @param buffer The buffer to be read
     * @param make The maker field from the 0th IFD
     * @param model The model field from the 0th IFD
     */
    constructor(buffer: Buffer, make: String, model: String, littleEndian: boolean) {
        this.buf = buffer;
        this.littleEndian = littleEndian;

        var parsedData = this.parse(buffer, make, model);

        
    }


    private parse(buffer: Buffer, make: String, model: String) {
        switch (make.toLowerCase()) {
            case "nikon corporation":
                switch (model.toLowerCase()) {
                    case "nikon z 6_2":
                        return MakerNoteReader_Nikon.parse(this.littleEndian, buffer);
                    default:
                        throw new Error(`This Model is not currently supported, Make: '${make}', Model: '${model}'`); 
                }
            default:
                throw new Error(`This Make is not currently supported, Make: '${make}', Model: '${model}'`);
        }
    }
}

export default MakerNoteReader;