import * as fs from "fs";
import * as path from "path";
import Reader from "../src/index";
import { IFDTag } from "../typings/index";

function test(): void {
  const reader = new Reader();
  reader.setModel("Nikon", "Z6_2");

  const fileData = fs.readFileSync(path.join(__dirname, "data", "images", "Nikon", "NikonZ6_2.jpg"));

  console.log(`FileData length: ${fileData.buffer.byteLength}`);

  reader.setBuffer(fileData);

  const ifdReader = reader.getIFDReader();

  const tags = ifdReader.getAllIFD0Tags();

  tags.forEach((tag) => {
    console.log(`${tag.tagName} = ${tag.tagValue}`);
  });

  const exifOffset = (tags.get("ExifOffset")?.tagValue as number) ?? 1;

  console.log(`ExifOffset: ${exifOffset}. EOHS: ${ifdReader.toHexString(exifOffset)}`);

  const numEntries = ifdReader.readNumEntries(exifOffset);

  //const exifIFDTagTest = ifdReader.readIFDTag(exifOffset, 6);

  for (var i = 0; i < numEntries; i++) {
    try {
      var tag = ifdReader.readIFDTag(exifOffset, i);
      console.log(`${tag.tagName == "" ? tag.tagID : tag.tagName} -`); // = ${tag.tagValue}
    } catch {}
  }
}

test();
