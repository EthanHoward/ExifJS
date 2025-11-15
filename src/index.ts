import { CameraMapping, IFDTag } from "../typings";
import IFDTypes from "./meta/ifdTypes";
import IFDReader from "./ifdReader";
import { CameraModels } from "./meta/cameraModels";
import { ExifTags, ExifTagsByName } from "./meta/exifTags";
import TIFFReader from "./tiffReader";
import log from "./debug/debugger";

//TODO! Not only finish the IFDReader class but add support for MakerNotes, i will PROBABLY make another class purely to handle that.

/**
 * The entry point to use ExifJS
 */
export default class Reader {
  private cameraMapping: CameraMapping = undefined!;
  private buffer: Buffer<ArrayBufferLike> = undefined!;

  /**
   * Gets TIFF info so the IFDReaders can correctly function;
   */
  private tiffReader: TIFFReader;

  /**
   * Reads APP1/IFD0 to get basic metas.
   */
  private IFD0Reader: IFDReader;

  /**
   * Reader for reading the EXIF Sub IFD
   */
  private EXIFSubIFDReader: IFDReader;
  //private MakerNoteSubIFDReader: IFDReader;

  constructor(buffer: Buffer<ArrayBufferLike>, overrideModel?: { maker: string; model: string }) {
    this.buffer = buffer;
    this.tiffReader = new TIFFReader(this.buffer);

    if (overrideModel) {
      this.setModel(overrideModel.maker, overrideModel.model);
    }

    this.IFD0Reader = new IFDReader(this.buffer, this.tiffReader.getFirstIFDOffset(), this.tiffReader.getTIFFStartOffset(), this.tiffReader.getLittleEndian());

    const exifOffsetTag: IFDTag | undefined = this.IFD0Reader.tagsMap.get("ExifOffset");

    if (!exifOffsetTag) {
      throw new Error(`Exif Offset Tag, ${ExifTagsByName.ExifOffset.id} could not be read`);
    }

    this.EXIFSubIFDReader = new IFDReader(buffer, Number(exifOffsetTag.tagValue), this.tiffReader.getTIFFStartOffset(), this.tiffReader.getLittleEndian());

    //! TODO: Need to find a way to read MakerNotes, not sure how, likely needs its own reader class.
    //this.MakerNoteSubIFDReader = new IFDReader();
  }

  /**
   * Manually set the maker and model of the camera to determine its mapping
   * @param maker The camera's maker (e.g., Nikon)
   * @param model  The camera's model (e.g., Z6_2)
   */
  private setModel(maker: string, model: string): void {
    this.cameraMapping = CameraModels[maker]?.[model];
    log(`Model set to "${maker}" "${model}"`);
  }

  /**
   * Returns all tags, combined from IFD0, ExifSubIFD and MakerNote (If Successful)
   * @returns {Record<string, IFDTag>} record containing all acquired tags by this reader instance, will include MakerNote if successful.
   */
  getAllTags(): Record<string, IFDTag> {
    const IFD0Tags: Map<string, IFDTag> = this.IFD0Reader.getAllTags();
    const EXIFTags: Map<string, IFDTag> = this.EXIFSubIFDReader.getAllTags();
    const allTags: Map<string, IFDTag> = new Map([...IFD0Tags, ...EXIFTags]);

    return Object.fromEntries(allTags);
  }
}
