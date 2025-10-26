"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var index_1 = __importDefault(require("../src/index"));
function test() {
    var _a, _b;
    var reader = new index_1.default();
    reader.setModel("Nikon", "Z6_2");
    var fileData = fs.readFileSync(path.join(__dirname, "data", "images", "Nikon", "NikonZ6_2.jpg"));
    console.log("FileData length: ".concat(fileData.buffer.byteLength));
    reader.setBuffer(fileData);
    var ifdReader = reader.getIFDReader();
    var tags = ifdReader.getAllIFD0Tags();
    tags.forEach(function (tag) {
        console.log("".concat(tag.tagName, " = ").concat(tag.tagValue));
    });
    var exifOffset = (_b = (_a = tags.get("ExifOffset")) === null || _a === void 0 ? void 0 : _a.tagValue) !== null && _b !== void 0 ? _b : 1;
    console.log("ExifOffset: ".concat(exifOffset, ". EOHS: ").concat(ifdReader.toHexString(exifOffset)));
    var numEntries = ifdReader.readNumEntries(exifOffset);
    //const exifIFDTagTest = ifdReader.readIFDTag(exifOffset, 6);
    for (var i = 0; i < numEntries; i++) {
        try {
            var tag = ifdReader.readIFDTag(exifOffset, i);
            console.log("".concat(tag.tagName == "" ? tag.tagID : tag.tagName, " -")); // = ${tag.tagValue}
        }
        catch (_c) { }
    }
}
test();
//# sourceMappingURL=tests.js.map