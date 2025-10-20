//! TODO: Add more tag IDs from https://exiv2.org/tags.html
import { IFDTypes } from "./ifdTypes";

/**
 * Stores mappings for all default EXIF types.
 */
export const ExifTags: Record<number, { name: string; type: IFDTypes }> = {
  0x0100: { name: "ImageWidth", type: IFDTypes.LONG },
  0x0101: { name: "ImageLength", type: IFDTypes.LONG },

  0x0112: { name: "Orientation", type: IFDTypes.SHORT },
  0x011a: { name: "XResolution", type: IFDTypes.RATIONAL },
  0x011b: { name: "YResolution", type: IFDTypes.RATIONAL },
  0x0128: { name: "ResolutionUnit", type: IFDTypes.SHORT },
  0x0131: { name: "Software", type: IFDTypes.ASCII },
  0x0132: { name: "ModifyDate", type: IFDTypes.ASCII },
  0x013e: { name: "WhitePoint", type: IFDTypes.RATIONAL }, //! Note, this is [n] so needs some more code
  0x013f: { name: "PrimaryChromatics", type: IFDTypes.RATIONAL }, //! Note, this is [n] so needs some more code

  0x0211: { name: "YCbCrCoefficients", type: IFDTypes.RATIONAL }, //! Note, this is [n] so needs some more code
  0x0213: { name: "YCbCrPositioning", type: IFDTypes.SHORT }, //! Note, this is [n] so needs some more code
  0x8769: { name: "ExifOffset", type: IFDTypes.UNDEFINED },
  0x8825: { name: "GPSInfo", type: IFDTypes.UNDEFINED },

  0x829a: { name: "ExposureTime", type: IFDTypes.RATIONAL },
  0x829d: { name: "FNumber", type: IFDTypes.RATIONAL },
  0x8822: { name: "ExposureProgram", type: IFDTypes.SHORT },
  0x8827: { name: "ISO", type: IFDTypes.SHORT }, //! Note, this is [n] so needs some more code

  0x8830: { name: "SensitivityType", type: IFDTypes.SHORT },
  0x8832: { name: "RecommendedExposureIndex", type: IFDTypes.LONG },

  0x010f: { name: "Make", type: IFDTypes.ASCII },
  0x0110: { name: "Model", type: IFDTypes.ASCII },
};

export const ExifTagsByName: Record<string, { id: number; type: IFDTypes }> =
  {};

for (const [idStr, tag] of Object.entries(ExifTags)) {
  const id = Number(idStr);
  ExifTagsByName[tag.name] = { id, type: tag.type };
}
