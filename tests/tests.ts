import * as fs from "fs";
import * as path from "path";
import Reader from "../src/index";
import { IFDTag } from "../typings/index";
import { buffer } from "stream/consumers";

function test(): void {
  const testsDirectory = path.join(process.cwd(), "tests");

  const fileData = fs.readFileSync(path.join(testsDirectory, "data", "images", "Nikon", "NikonZ6_2.jpg"));

  console.log(`FileData length: ${fileData.buffer.byteLength}`);
  
  const reader = new Reader(fileData, {maker: "Nikon", model: "Z6_2"});
  
  const q: Record<string, IFDTag> = reader.getAllTags()

  console.log(q["Make"]["tagValue"]);
  console.log(q["Model"]["tagValue"]);

  const makerNote = q["MakerNote"]["tagValue"];

}

test();
