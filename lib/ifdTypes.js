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
    IFDTypes[IFDTypes["SHORT"] = 2] = "SHORT";
    /** uint32 */
    IFDTypes[IFDTypes["LONG"] = 3] = "LONG";
    /** uint32[2] — numerator/denominator */
    IFDTypes[IFDTypes["RATIONAL"] = 4] = "RATIONAL";
    /** int8 */
    IFDTypes[IFDTypes["SBYTE"] = 5] = "SBYTE";
    /** uint8 (undefined data) */
    IFDTypes[IFDTypes["UNDEFINED"] = 6] = "UNDEFINED";
    /** int16 */
    IFDTypes[IFDTypes["SSHORT"] = 7] = "SSHORT";
    /** int32 */
    IFDTypes[IFDTypes["SLONG"] = 8] = "SLONG";
    /** int32[2] — numerator/denominator */
    IFDTypes[IFDTypes["SRATIONAL"] = 9] = "SRATIONAL";
    /** float32 */
    IFDTypes[IFDTypes["FLOAT"] = 10] = "FLOAT";
    /** float64 */
    IFDTypes[IFDTypes["DOUBLE"] = 11] = "DOUBLE";
})(IFDTypes || (exports.IFDTypes = IFDTypes = {}));
