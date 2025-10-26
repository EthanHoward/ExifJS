import { tCameraModels } from "../../typings";
import IFDTypes from "./ifdTypes";


///! Idea: Design this in a hierarchial manner in which if one mapping by same maker does not have a given offset / tag, it looks at another or we make it so there's like a 'Common' and that's imported, or some override method... idk

/**
 * Stores the camera model IFD MakerNote mappings by ["Maker"]["Model"]
 */
export const CameraModels: tCameraModels = {
  Nikon: {
    Z6_2: {
      makerNoteOffsets: {
        ShutterCount: { offset: 0x001d, type: IFDTypes.UINT32 },
      },
    },
  },
};
