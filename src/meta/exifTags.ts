//! TODO: Add more tag IDs from https://exiv2.org/tags.html
import { EXIFTagMapping } from "../../typings";
import IFDTypes from "./ifdTypes";

/**
 * Stores mappings for all default EXIF types.
 */
export const ExifTags: Record<number, EXIFTagMapping> = {
  0x0001: { name: "InteropIndex" },
  0x0002: { name: "InteropVersion" },
  0x000b: { name: "ProcessingSoftware" },
  0x00fe: { name: "SubfileType" },
  0x0100: { name: "ImageWidth" },
  0x0101: { name: "ImageLength" },
  0x0102: { name: "BitsPerSample" },
  0x0103: { name: "Compression" },
  0x0106: { name: "PhotometricInterpretation" },
  0x0107: { name: "Thresholding" },
  0x0108: { name: "CellWidth" },
  0x0109: { name: "CellLength" },
  0x010a: { name: "FillOrder" },
  0x010d: { name: "DocumentName" },
  0x010e: { name: "ImageDescription" },
  0x010f: { name: "Make" },
  0x0110: { name: "Model" },
  //! See https://exiftool.org/TagNames/EXIF.html
  //! Ts like 7 diff tags
  0x0111: { name: "StripOffsets" },
  0x0112: { name: "Orientation" },
  0x011a: { name: "XResolution" },
  0x011b: { name: "YResolution" },
  0x0128: { name: "ResolutionUnit" },
  0x0131: { name: "Software" },
  0x0132: { name: "ModifyDate" },
  0x013e: { name: "WhitePoint" },
  0x013f: { name: "PrimaryChromatics" },
  0x0211: { name: "YCbCrCoefficients" },
  0x0213: { name: "YCbCrPositioning" },
  0x8769: { name: "ExifOffset" },
  0x8825: { name: "GPSInfo" },
  0x829a: { name: "ExposureTime" },
  0x829d: { name: "FNumber" },
  0x8822: { name: "ExposureProgram" },
  0x8827: { name: "ISO" },
  0x8828: { name: "Opto-ElectricConvFactor" },
  0x8829: { name: "Interlace" },
  0x882a: { name: "TimeZoneOffset" },
  0x882b: { name: "SelfTimerMode" },
  0x8830: { name: "SensitivityType" },
  0x8832: { name: "RecommendedExposureIndex" },
  0x8833: { name: "ISOSpeed" },
  0x8834: { name: "ISOSpeedLatitudeyyy" },
  0x8835: { name: "ISOSpeedLatitudezzz" },
  0x885c: { name: "FaxRecvParams" },
  0x885d: { name: "FaxSubAddress" },
  0x885e: { name: "FaxRecvTime" },
  0x8871: { name: "FedexEDR" },
  0x888a: { name: "LeafSubIFD" },
  0x9000: { name: "ExifVersion" },
  0x9003: { name: "DateTimeOriginal" },
  0x9004: { name: "CreateDate" },
  0x9009: { name: "GooglePlusUploadCode" },
  0x9010: { name: "OffsetTime" },
  0x9011: { name: "OffsetTimeOriginal" },
  0x9012: { name: "OffsetTimeDigitizied" },
  0x9101: { name: "ComponentsConfiguration" },
  0x9102: { name: "CompressedBitsPerPixel" },
  0x9201: { name: "ShutterSpeedValue" },
  0x9202: { name: "ApertureValue" },
  0x9203: { name: "BrightnessValue" },
  0x9204: { name: "ExposureCompensation" },
  0x9205: { name: "MaxApertureValue" },
  0x9206: { name: "SubjectDistance" },
  0x9207: { name: "MeteringMode" },
  0x9208: { name: "LightSource" },
  0x9209: { name: "Flash" },
  0x920a: { name: "FocalLength" },
  0x920b: { name: "FlashEnergy" },
  0x920c: { name: "SpatialFrequencyResponse" },
  0x920d: { name: "Noise" },
  0x920e: { name: "FocalPlaneXResolution" },
  0x920f: { name: "FocalPlaneYResolution" },
  0x9210: { name: "FocalPlaneResolutionUnit" },
  0x9211: { name: "ImageNumber" },
  0x9212: { name: "SecurityClassification" },
  0x9213: { name: "ImageHistory" },
  0x9214: { name: "SubjectArea" },
  0x9215: { name: "ExposureIndex" },
  0x9216: { name: "TIFF-EPStandardID" },
  0x9217: { name: "SensingMethod" },
  0x923a: { name: "CIP3DataFile" },
  0x923b: { name: "CIP3Sheet" },
  0x923c: { name: "CIP3Side" },
  0x923f: { name: "StoNits" },
  0x927c: { name: "MakerNote" },
  0x9286: { name: "UserComment" },
  0x9290: { name: "SubSecTime" },
  0x9291: { name: "SubSecTimeOriginal" },
  0x9292: { name: "SubSecTimeDigitized" },
  0x932f: { name: "MSDocumentText" },
  0x9330: { name: "MSPropertySetStorage" },
  0x9331: { name: "MSDocumentTextPosition" },
  0x935c: { name: "ImageSourceData" },
  0x9400: { name: "AmbientTemperature" },
  0x9401: { name: "Humidity" },
  0x9402: { name: "Pressure" },
  0x9403: { name: "WaterDepth" },
  0x9404: { name: "Acceleration" },
  0x9405: { name: "CameraElevationAngle" },
  0x9999: { name: "XiaomiSettings" },
  0x9a00: { name: "XiaomiModel" },
  0x9c9b: { name: "XPTitle" },
  0x9c9c: { name: "XPComment" },
  0x9c9d: { name: "XPAuthor" },
  0x9c9e: { name: "XPKeywords" },
  0x9c9f: { name: "XPSubject" },
  0xa000: { name: "FlashpixVersion" },
  0xa001: { name: "ColorSpace" },
  0xa002: { name: "ExifImageWidth" },
  0xa003: { name: "ExifImageHeight" },
  0xa005: { name: "InteropOffset" },
  0xa217: { name: "SensingMethod" },
  0xa300: { name: "FileSource" },
  0xa301: { name: "SceneType" },
  0xa302: { name: "CFAPattern" },
  0xa401: { name: "CustomRendered" },
  0xa402: { name: "ExposureMode" },
  0xa403: { name: "WhiteBalance" },
  0xa405: { name: "FocalLengthIn35mmFormat" },
  0xa406: { name: "SceneCaptureType" },
  0xa407: { name: "GainControl" },
  0xa408: { name: "Contrast" },
  0xa409: { name: "Saturation" },
  0xa40a: { name: "Sharpness" },
  0xa40c: { name: "SubjectDistanceRange" },
  0xa420: { name: "ImageUniqueID" },
  0xa430: { name: "OwnerName" },
  0xa431: { name: "SerialNumber" },
  0xa432: { name: "LensInfo" },
  0xa433: { name: "LensMake" },
  0xa434: { name: "LensModel" },
  0xa435: { name: "LensSerialNumber" },
  0xa436: { name: "ImageTitle" },
  0xa437: { name: "Photographer" },
  0xa438: { name: "ImageEditor" },
  0xa439: { name: "CameraFirmware" },
  0xa43a: { name: "RAWDevelopingSoftware" },
  0xa43b: { name: "ImageEditingSoftware" },
  0xa43c: { name: "MetadataEditingSoftware" },
  0xa460: { name: "CompositeImage" },
  0xa461: { name: "CompositeImageCount" },
  0xa462: { name: "CompositeImageExposureTimes" },
  0xa480: { name: "GDALMetadata" },
  0xa481: { name: "GDALNoData" },
  0xa500: { name: "Gamma" },
  0xafc0: { name: "" }, //! !
  0xafc1: { name: "" }, //! !
  0xafc2: { name: "" }, //! !
  0xafc3: { name: "" }, //! !
  0xafc4: { name: "" }, //! !
  0xafc5: { name: "" }, //! !
  0xb4c3: { name: "" }, //! !
  0xbc01: { name: "" }, //! !
  0xbc02: { name: "" }, //! !
  0xbc03: { name: "" }, //! !
  0xbc04: { name: "" }, //! !
  0xbc80: { name: "" }, //! !
  0xbc81: { name: "" }, //! !
  0xbc82: { name: "" }, //! !
  0xbc83: { name: "" }, //! !
  0xbcc0: { name: "" }, //! !
  0xbcc1: { name: "" }, //! !
  0xbcc2: { name: "" }, //! !
  0xbcc3: { name: "" }, //! !
  0xbcc4: { name: "" }, //! !
  0xbcc5: { name: "" }, //! !
  0xc427: { name: "" }, //! !
  0xc428: { name: "" }, //! !
  0xc429: { name: "" }, //! !
  0xc42a: { name: "" }, //! !
  0xc44f: { name: "" }, //! !
  0xc4a5: { name: "" }, //! !
  0xc519: { name: "" }, //! !
  0xc51b: { name: "" }, //! !
  0xc573: { name: "" }, //! !
  0xc580: { name: "" }, //! !
  0xc5e0: { name: "" }, //! !
  0xc612: { name: "" }, //! !
  0xc613: { name: "" }, //! !
  0xc614: { name: "" }, //! !
  0xc615: { name: "" }, //! !
  0xc616: { name: "" }, //! !
  0xc617: { name: "" }, //! !
  0xc618: { name: "" }, //! !
  0xc619: { name: "" }, //! !
  0xc61a: { name: "" }, //! !
  0xc61b: { name: "" }, //! !
  0xc61c: { name: "" }, //! !
  0xc61d: { name: "" }, //! !
  0xc61e: { name: "" }, //! !
  0xc61f: { name: "" }, //! !
  0xc620: { name: "" }, //! !
  0xc621: { name: "" }, //! !
  0xc622: { name: "" }, //! !
  0xc623: { name: "" }, //! !
  0xc624: { name: "" }, //! !
  0xc625: { name: "" }, //! !
  0xc626: { name: "" }, //! !
  0xc627: { name: "" }, //! !
  0xc628: { name: "" }, //! !
  0xc629: { name: "" }, //! !
  0xc62a: { name: "" }, //! !
  0xc62b: { name: "" }, //! !
  0xc62c: { name: "" }, //! !
  0xc62d: { name: "" }, //! !
  0xc62e: { name: "" }, //! !
  0xc62f: { name: "" }, //! !
  0xc630: { name: "" }, //! !
  0xc631: { name: "" }, //! !
  0xc632: { name: "" }, //! !
  0xc633: { name: "" }, //! !
  0xc634: { name: "" }, //! !
  0xc635: { name: "" }, //! !
  0xc640: { name: "" }, //! !
  0xc65a: { name: "" }, //! !
  0xc65b: { name: "" }, //! !
  0xc65c: { name: "" }, //! !
  0xc65d: { name: "" }, //! !
  0xc660: { name: "" }, //! !
  0xc68b: { name: "" }, //! !
  0xc68c: { name: "" }, //! !
  0xc68d: { name: "" }, //! !
  0xc68e: { name: "" }, //! !
  0xc68f: { name: "" }, //! !
  0xc690: { name: "" }, //! !
  0xc691: { name: "" }, //! !
  0xc692: { name: "" }, //! !
  0xc6bf: { name: "" }, //! !
  0xc6c5: { name: "" }, //! !
  0xc6d2: { name: "" }, //! !
  0xc6d3: { name: "" }, //! !
  0xc6f3: { name: "" }, //! !
  0xc6f4: { name: "" }, //! !
  0xc6f5: { name: "" }, //! !
  0xc6f6: { name: "" }, //! !
  0xc6f7: { name: "" }, //! !
  0xc6f8: { name: "" }, //! !
  0xc6f9: { name: "" }, //! !
  0xc6fa: { name: "" }, //! !
  0xc6fb: { name: "" }, //! !
  0xc6fc: { name: "" }, //! !
  0xc6fd: { name: "" }, //! !
  0xc6fe: { name: "" }, //! !
  0xc714: { name: "" }, //! !
  0xc715: { name: "" }, //! !
  0xc716: { name: "" }, //! !
  0xc717: { name: "" }, //! !
  0xc718: { name: "" }, //! !
  0xc719: { name: "" }, //! !
  0xc71a: { name: "" }, //! !
  0xc71b: { name: "" }, //! !
  0xc71c: { name: "" }, //! !
  0xc71d: { name: "" }, //! !
  0xc71e: { name: "" }, //! !
  0xc71f: { name: "" }, //! !
  0xc725: { name: "" }, //! !
  0xc726: { name: "" }, //! !
  0xc740: { name: "" }, //! !
  0xc741: { name: "" }, //! !
  0xc74e: { name: "" }, //! !
  0xc761: { name: "" }, //! !
  0xc763: { name: "" }, //! !
  0xc764: { name: "" }, //! !
  0xc772: { name: "" }, //! !
  0xc789: { name: "" }, //! !
  0xc791: { name: "" }, //! !
  0xc792: { name: "" }, //! !
  0xc793: { name: "" }, //! !
  0xc7a1: { name: "" }, //! !
  0xc7a3: { name: "" }, //! !
  0xc7a4: { name: "" }, //! !
  0xc7a5: { name: "" }, //! !
  0xc7a6: { name: "" }, //! !
  0xc7a7: { name: "" }, //! !
  0xc7a8: { name: "" }, //! !
  0xc7aa: { name: "" }, //! !
  0xc7b5: { name: "" }, //! !
  0xc7d5: { name: "" }, //! !
  0xc7d7: { name: "" }, //! !
  0xc7d8: { name: "" }, //! !
  0xc7e9: { name: "" }, //! !
  0xc7ea: { name: "" }, //! !
  0xc7eb: { name: "" }, //! !
  0xc7ec: { name: "" }, //! !
  0xc7ed: { name: "" }, //! !
  0xc7ee: { name: "" }, //! !
  0xcd2d: { name: "" }, //! !
  0xcd2e: { name: "" }, //! !
  0xcd30: { name: "" }, //! !
  0xcd31: { name: "" }, //! !
  0xcd32: { name: "" }, //! !
  0xcd33: { name: "" }, //! !
  0xcd34: { name: "" }, //! !
  0xcd35: { name: "" }, //! !
  0xcd36: { name: "" }, //! !
  0xcd37: { name: "" }, //! !
  0xcd38: { name: "" }, //! !
  0xcd39: { name: "" }, //! !
  0xcd3a: { name: "" }, //! !
  0xcd3f: { name: "" }, //! !
  0xcd40: { name: "" }, //! !
  0xcd43: { name: "" }, //! !
  0xcd44: { name: "" }, //! !
  0xcd46: { name: "" }, //! !
  0xcd47: { name: "" }, //! !
  0xcd48: { name: "" }, //! !
  0xcd49: { name: "" }, //! !
  0xcd4a: { name: "" }, //! !
  0xcd4b: { name: "" }, //! !
  0xcea1: { name: "" }, //! !
  0xea1c: { name: "" }, //! !
  0xea1d: { name: "" }, //! !
  0xfde8: { name: "" }, //! !
  0xfde9: { name: "" }, //! !
  0xfdea: { name: "" }, //! !
  0xfe00: { name: "" }, //! !
  0xfe4c: { name: "" }, //! !
  0xfe4d: { name: "" }, //! !
  0xfe4e: { name: "" }, //! !
  0xfe51: { name: "" }, //! !
  0xfe52: { name: "" }, //! !
  0xfe53: { name: "" }, //! !
  0xfe54: { name: "" }, //! !
  0xfe55: { name: "" }, //! !
  0xfe56: { name: "" }, //! !
  0xfe57: { name: "" }, //! !
  0xfe58: { name: "" }, //! !
  // END!
};

export const ExifTagsByName: Record<string, { id: number }> = {};

for (const [idStr, tag] of Object.entries(ExifTags)) {
  const id = Number(idStr);
  ExifTagsByName[tag.name] = { id };
}
