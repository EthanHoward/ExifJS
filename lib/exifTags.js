"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExifTagsByName = exports.ExifTags = void 0;
//! TODO: Add more tag IDs from https://exiv2.org/tags.html
var ifdTypes_1 = require("./ifdTypes");
/**
 * Stores mappings for all default EXIF types.
 */
exports.ExifTags = {
    0x0100: { name: "ImageWidth", type: ifdTypes_1.IFDTypes.LONG },
    0x0101: { name: "ImageLength", type: ifdTypes_1.IFDTypes.LONG },
    0x0112: { name: "Orientation", type: ifdTypes_1.IFDTypes.SHORT },
    0x011a: { name: "XResolution", type: ifdTypes_1.IFDTypes.RATIONAL },
    0x011b: { name: "YResolution", type: ifdTypes_1.IFDTypes.RATIONAL },
    0x0128: { name: "ResolutionUnit", type: ifdTypes_1.IFDTypes.SHORT },
    0x0131: { name: "Software", type: ifdTypes_1.IFDTypes.ASCII },
    0x0132: { name: "ModifyDate", type: ifdTypes_1.IFDTypes.ASCII },
    0x013e: { name: "WhitePoint", type: ifdTypes_1.IFDTypes.RATIONAL }, //! Note, this is [n] so needs some more code
    0x013f: { name: "PrimaryChromatics", type: ifdTypes_1.IFDTypes.RATIONAL }, //! Note, this is [n] so needs some more code
    0x0211: { name: "YCbCrCoefficients", type: ifdTypes_1.IFDTypes.RATIONAL }, //! Note, this is [n] so needs some more code
    0x0213: { name: "YCbCrPositioning", type: ifdTypes_1.IFDTypes.SHORT }, //! Note, this is [n] so needs some more code
    0x8769: { name: "ExifOffset", type: ifdTypes_1.IFDTypes.UNDEFINED },
    0x8825: { name: "GPSInfo", type: ifdTypes_1.IFDTypes.UNDEFINED },
    0x829a: { name: "ExposureTime", type: ifdTypes_1.IFDTypes.RATIONAL },
    0x829d: { name: "FNumber", type: ifdTypes_1.IFDTypes.RATIONAL },
    0x8822: { name: "ExposureProgram", type: ifdTypes_1.IFDTypes.SHORT },
    0x8827: { name: "ISO", type: ifdTypes_1.IFDTypes.SHORT }, //! Note, this is [n] so needs some more code
    0x8830: { name: "SensitivityType", type: ifdTypes_1.IFDTypes.SHORT },
    0x8832: { name: "RecommendedExposureIndex", type: ifdTypes_1.IFDTypes.LONG },
    0x010f: { name: "Make", type: ifdTypes_1.IFDTypes.ASCII },
    0x0110: { name: "Model", type: ifdTypes_1.IFDTypes.ASCII },
};
exports.ExifTagsByName = {};
try {
    for (var _b = __values(Object.entries(exports.ExifTags)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2), idStr = _d[0], tag = _d[1];
        var id = Number(idStr);
        exports.ExifTagsByName[tag.name] = { id: id, type: tag.type };
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
