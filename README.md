# ExifJS
JavaScript based minimum-dependency exif reader library with (hopefully) MakerNote support for various manufacturers

(Because all the other ones in NodeJS suck and can't read MakerNote!!!)

# Sources And Acks

This project uses data and/or insiration from the below sources:

- **ExifTool Sample Images**
  Provided By Phil Harvey
  Website: [https://exiftool.org/sample_images.html](https://exiftool.org/sample_images.html)

- **exiv2.org for exif tag mappings**
  Provided by exiv2.org
  Website [exiv2.org](exiv2.org)

# TODO

| Task | Notes |
|------|-------|
| Finish standardised EXIF tags in src/exifTags| N/A |
| Code for handling IFDType[n] such as uint16[n] cases | All types in exifTags denoted as '[n]' will need such code|

# Enabling Debug Logs in ExifJS

ExifJS includes optional **debug logging** for development and troubleshooting.  
By default, debug logs are disabled. You can enable them by setting an environment variable `DEVENV=1`.

---

## Node.js (Linux / macOS)

Temporarily for one command:

```bash
DEVENV=1 node dist/index.js
```

## VSCode Launch Config
The launch config, which runs the tests for this library automatically provides DEVENV=1, if you wish to disable dev logging, change it in the launch config from "1" to "0"