import * as fs from "fs";
import * as path from "path";
import Reader from "../src/index";
import { IFDTag } from "../typings/index";
import { buffer } from "stream/consumers";

function test(): void {
  const fileData = fs.readFileSync(path.join(__dirname, "data", "images", "Nikon", "NikonZ6_2.jpg"));

  console.log(`FileData length: ${fileData.buffer.byteLength}`);
  
  const reader = new Reader(fileData, {maker: "Nikon", model: "Z6_2"});
  
}

test();
