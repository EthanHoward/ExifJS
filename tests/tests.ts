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

    console.log(`ExifOffset.tagValue as number ---> ${tags.get("ExifOffset")?.tagValue as number}`)

    const exifOffset = tags.get("ExifOffset")?.tagValue as number ?? 1;

    const numEntries = ifdReader.readNumEntries(exifOffset);
    
    for (var i = 0; i < numEntries; i++) {
        console.log(ifdReader.readIFDTag(exifOffset, i));
    }
}

test();