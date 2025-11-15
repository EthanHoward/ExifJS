import IFDTypes from "../src/meta/ifdTypes";

/**
 * Stores the offsets for each tag in EXIF and MakerNote
 */
export interface CameraMapping {
  makerNoteOffsets: Record<string, { offset: number; }>;
}

/**
 * The type for camera models.
 */
export type tCameraModels = {
  [maker: string]: {
    [model: string]: CameraMapping;
  };
};

/**
 * Rational type (Fraction essentially)
 */
export type Rational = { 
  num: number; 
  den: number; 
  value: number 
};

/**
 * Mapping used in exifTags.ts
 */
export type EXIFTagMapping = { 
  name: string;
}

/**
 * Type for IFD Tag
 * 
 * 
 */
export type IFDTag = {
  tagID: number;
  tagType: number;
  tagCount: number;
  tagValue: number | string | Buffer<ArrayBufferLike> | Rational | Array<number | string | Buffer<ArrayBufferLike> | Rational>;
  tagName: string;
};
