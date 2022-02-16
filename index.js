const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const THRESHOLD = 2500000000;

const COLS = 800; //100mm
const ROWS = 1198; //150mm
// 203dots (8dots/mm)

const labelPath = path.resolve(process.cwd(), process.argv[2]);

jimp.read(labelPath, async (err, image) => {
    image.resize(COLS, ROWS).grayscale();
    const img = new Buffer.alloc((COLS / 8) * ROWS);
    for (let row = 0; row < ROWS; row++) {
      for (let byte = 0; byte < COLS / 8; byte++) {
        let byteData = 0;
        for (let bit = 0; bit < 8; bit++) {
          const pixelX = byte * 8 + bit;
          const pixelY = row;
          const val = image.getPixelColor(pixelX, pixelY);
          if (val > THRESHOLD) {
            byteData = byteData | (1 << (7 - bit));
          }
        }
        img[row * (COLS / 8) + byte] = byteData;
        // console.log({ byteData, img, row, byte });
      }
    }