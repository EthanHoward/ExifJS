import { IFDTypes } from "./ifdTypes";
/**
 * Stores mappings for all default EXIF types.
 */
export declare const ExifTags: Record<number, {
    name: string;
    type: IFDTypes;
}>;
export declare const ExifTagsByName: Record<string, {
    id: number;
    type: IFDTypes;
}>;
