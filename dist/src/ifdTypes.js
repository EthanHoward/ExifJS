"use strict";
/**
 * +-----------+----------+---------------------+
 * | TYPE CODE | NAME     | BYTES PER COMPONENT |
 * +-----------+----------+---------------------+
 * | 01        | BYTE     | 1                   |
 * | 02        | ASCII    | 1                   |
 * | 03 X      | SHORT    | 2                   |
 * | 04 X      | LONG     | 4                   |
 * | 05        | RATIONAL | 8 (2 * LONG)        |
 * | 06        | SBYTE    | 1                   |
 * | 07        | UNDEF    | 1                   |
 * | 08 X      | SSHORT   | 2                   |
 * | 09 X      | SLONG    | 4                   |
 * | 10        | SRATIONAL| 8 (2 * SLONG)       |
 * | 11        | FLOAT    | 4                   |
 * | 12        | DOUBLE   | 8                   |
 * +-----------+----------+---------------------+
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFDTypes = void 0;
var IFDTypes;
(function (IFDTypes) {
    /** uint8 */
    IFDTypes[IFDTypes["BYTE"] = 0] = "BYTE";
    /** ASCII string (null-terminated) */
    IFDTypes[IFDTypes["ASCII"] = 1] = "ASCII";
    /** uint16 */
    IFDTypes[IFDTypes["UINT16"] = 2] = "UINT16";
    /** uint32 */
    IFDTypes[IFDTypes["UINT32"] = 3] = "UINT32";
    /** uint32[2] — numerator/denominator */
    IFDTypes[IFDTypes["URATIONAL64"] = 4] = "URATIONAL64";
    /** int8 */
    IFDTypes[IFDTypes["SBYTE"] = 5] = "SBYTE";
    /** uint8 (undefined data) */
    IFDTypes[IFDTypes["UNDEFINED"] = 6] = "UNDEFINED";
    /** int16 */
    IFDTypes[IFDTypes["INT16"] = 7] = "INT16";
    /** int32 */
    IFDTypes[IFDTypes["INT32"] = 8] = "INT32";
    /** int32[2] — numerator/denominator */
    IFDTypes[IFDTypes["RATIONAL64"] = 9] = "RATIONAL64";
    /** float32 */
    IFDTypes[IFDTypes["FLOAT"] = 10] = "FLOAT";
    /** float64 */
    IFDTypes[IFDTypes["DOUBLE"] = 11] = "DOUBLE";
})(IFDTypes || (exports.IFDTypes = IFDTypes = {}));
//# sourceMappingURL=ifdTypes.js.map