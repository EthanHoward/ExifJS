import fs from "fs";
import path from "path";
import Reader from "../src/index.ts"
import { IFDTag } from "../typings/index";

function test(): void{
    const reader = new Reader();
    reader.setModel("Nikon", "Z6_2");

    const fileData = fs.readFileSync(path.join(__dirname, "data", "images", "Nikon", "NikonZ6_2.jpg"))

    console.log(`FileData length: ${fileData.buffer.byteLength}`)

    reader.setBuffer(fileData);

    const ifdReader = reader.getIFDReader();


    const tags = ifdReader.getAllIFD0Tags();

    tags.forEach((tag) => {
        console.log(`${tag.tagName} = ${tag.tagValue}`)
    })

    const exifOffset = tags.get("ExifOffset")?.tagValue as number ?? 1;

    console.log(`ExifOffset: ${exifOffset}. EOHS: ${ifdReader.toHexString(exifOffset)}`)

    const numEntries = ifdReader.readNumEntries(exifOffset);
    
    ifdReader.readIFDTag(exifOffset, 6);

    return;


    for (var i = 0; i < numEntries; i++) {
        var tag = ifdReader.readIFDTag(exifOffset, i)
        console.log(`${tag.tagName} = ${tag.tagValue}`);
    }
}

test();