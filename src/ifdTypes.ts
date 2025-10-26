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
 enum IFDTypes {
  /** uint8 */
  BYTE,

  /** ASCII string (null-terminated) */
  ASCII,

  /** uint16 */
  UINT16,

  /** uint32 */
  UINT32,

  /** uint32[2] — numerator/denominator */
  URATIONAL64,

  /** int8 */
  SBYTE,

  /** uint8 (undefined data) */
  UNDEFINED,

  /** int16 */
  INT16,

  /** int32 */
  INT32,

  /** int32[2] — numerator/denominator */
  RATIONAL64,

  /** float32 */
  FLOAT,

  /** float64 */
  DOUBLE
}


export default IFDTypes;