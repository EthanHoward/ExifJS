/**
 * Stores the offsets for each tag in EXIF and MakerNote
 */
export interface CameraMapping {
  makerNoteOffsets: Record<string, { offset: number; type: string }>;
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
 * Type for IFD Tag
 */
export type IFDTag = {
    tagID: number,
    tagType: number,
    tagCount: number,
    tagValue: number | Buffer<ArrayBufferLike> | string;
    tagName: string;
}