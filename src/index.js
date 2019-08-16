import fsTester from '../wasm/fsTester';
fsTester();

// require('normalize.css/normalize.css');

const mozjpeg_enc = require('../wasm/mozjpeg_enc.js');
console.log({mozjpeg_enc}); // returns function
import wasm from '../wasm/mozjpeg_enc.wasm';
console.log({wasm}); // returns filename with hashcode: mozjpeg_enc.93395.wasm

function initWasmModule(moduleFactory, wasmUrl) {
  console.log('moduleFactory:', moduleFactory, '\nwasmUrl:',  wasmUrl);
  return new Promise((resolve) => {
    const module = moduleFactory({
      // Just to be safe, don't automatically invoke any wasm functions
      noInitialRun: true,
      locateFile(url) {
        // Redirect the request for the wasm binary to whatever webpack gave us.
        if (url.endsWith('.wasm')) return wasmUrl;
        return url;
      },
      onRuntimeInitialized() {
        // An Emscripten is a then-able that resolves with itself, causing an infite loop when you
        // wrap it in a real promise. Delete the `then` prop solves this for now.
        // https://github.com/kripken/emscripten/issues/5820
        delete (module).then;
        resolve(module);
      },
    });
  });
}

function encodeImage(mozjpeg_enc, wasm) {
  initWasmModule(mozjpeg_enc, wasm).then(module => {
    console.log('module encode function:', module.encode);
    
    for (let i = 0; i < 2; i++) {
      const result = module.encode(new Uint8ClampedArray([21, 31]), 100, 200,
      {"quality":75,"baseline":false,"arithmetic":false,"progressive":true,"optimize_coding":true,
      "smoothing":0,"color_space":3,"quant_table":3,"trellis_multipass":false,"trellis_opt_zero":false,
      "trellis_opt_table":false,"trellis_loops":1,"auto_subsample":true,"chroma_subsample":2,
      "separate_chroma_quality":false,"chroma_quality":75});
    
      console.log('result', result);
    }
  });
}

encodeImage(mozjpeg_enc, wasm);


// Another way
import('../wasm/mozjpeg_enc.js').then(mozjpeg_enc => {
  console.log('mozjpeg_enc:', mozjpeg_enc.default);
  
  import ('../wasm/mozjpeg_enc.wasm').then(wasm => {
    console.log('wasm:', wasm.default);
    
    encodeImage(mozjpeg_enc.default, wasm.default);
  });
});
