// src/lib/pdf-parser.ts

// 1. Polyfill Promise.withResolvers
if (typeof Promise.withResolvers === 'undefined') {
  // @ts-expect-error - Polyfill
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// 2. Polyfill DOMMatrix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(global as any).DOMMatrix) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).DOMMatrix = class DOMMatrix {
    constructor() {}
    toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    multiply() { return this; }
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    transformPoint(p: any) { return p; }
    inverse() { return this; }
  };
}

// 3. Polyfill ImageData
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(global as any).ImageData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).ImageData = class ImageData {
        data: Uint8ClampedArray;
        width: number;
        height: number;
        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.data = new Uint8ClampedArray(width * height * 4);
        }
    };
}

// 4. Robust Import for pdf-parse
// eslint-disable-next-line @typescript-eslint/no-require-imports
let pdfLib = require('pdf-parse');

export async function parsePDF(buffer: Buffer) {
  try {
    // UNWRAPPER: Keep peeling off '.default' until we find the function
    // Next.js server components sometimes double-wrap CJS modules
    let parser = pdfLib;
    while (parser && typeof parser !== 'function' && (parser.default || parser.PDFParse)) {
        parser = parser.default || parser.PDFParse;
    }

    if (typeof parser !== 'function') {
        console.error("PDF-PARSE Import Debug:", {
            type: typeof pdfLib,
            keys: typeof pdfLib === 'object' ? Object.keys(pdfLib) : 'N/A'
        });
        throw new Error("Could not find pdf-parse function in the imported module.");
    }
    
    const data = await parser(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    return ""; 
  }
}