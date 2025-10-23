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
export declare enum IFDTypes {
    /** uint8 */
    BYTE = 0,
    /** ASCII string (null-terminated) */
    ASCII = 1,
    /** uint16 */
    SHORT = 2,
    /** uint32 */
    LONG = 3,
    /** uint32[2] — numerator/denominator */
    RATIONAL = 4,
    /** int8 */
    SBYTE = 5,
    /** uint8 (undefined data) */
    UNDEFINED = 6,
    /** int16 */
    SSHORT = 7,
    /** int32 */
    SLONG = 8,
    /** int32[2] — numerator/denominator */
    SRATIONAL = 9,
    /** float32 */
    FLOAT = 10,
    /** float64 */
    DOUBLE = 11
}
