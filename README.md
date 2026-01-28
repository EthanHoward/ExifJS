# ExifJS
JavaScript based minimum-dependency exif reader library with (hopefully) MakerNote support for various manufacturers

(Because all the other ones in NodeJS are not to my preference.)

# Sources And Acks
This project uses data and/or insiration from the below sources:

- **ExifTool Sample Images**
  Provided By Phil Harvey
  Website: [https://exiftool.org/sample_images.html](https://exiftool.org/sample_images.html)

- **exiv2.org for exif tag mappings**
  Provided by exiv2.org
  Website [exiv2.org](exiv2.org)

# TODO

- Camera / Maker Specific IFD Readers for the MakerNote sections, not 100% sure how that is going to work as-yet but we will get there eventually.
- Automate Testing & Verification of returned data, likely with the ExifTools CLI and a test class, should make automating it a lot easier.

# Enabling Debug Logs in ExifJS

ExifJS includes optional **debug logging** for development and troubleshooting.  
By default, debug logs are disabled. You can enable them by setting an environment variable `EXIFJS_DEVELOPMENT_LOGGING=1`.

---

## Node.js (Linux / macOS)

Temporarily for one command:

```bash
EXIFJS_DEVELOPMENT_LOGGING=1 node dist/index.js
```

## VSCode Launch Config
The launch config, which runs the tests for this library automatically provides EXIFJS_DEVELOPMENT_LOGGING=1, if you wish to disable dev logging, change it in the launch config from "1" to "0"

## .ts.old?
Just old files of original code I may need to refer to, can be ignored and they are not compiled into dist.