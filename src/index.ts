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

  private tiffReader: TIFFReader;

  private IFD0Reader: IFDReader;

  constructor(buffer: Buffer<ArrayBufferLike>, overrideModel?: {maker: string, model: string}) {
    this.buffer = buffer;
    this.tiffReader = new TIFFReader(this.buffer);

    if (overrideModel) {
      this.setModel(overrideModel.maker, overrideModel.model);
    }

    this.IFD0Reader = new IFDReader(this.buffer, this.tiffReader.getFirstIFDOffset(), this.tiffReader.getLittleEndian());
    

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
}