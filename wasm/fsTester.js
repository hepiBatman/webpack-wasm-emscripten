// Without webpack.IgnorePlugin, error thrown on starting the app and on browser, file fsTester.js is blank when retrieved from browser
// ERROR in ./wasm/mozjpeg_enc.js
// Module not found: Error: Can't resolve 'fs' in '/User/my-proj/wasm'
// With webpack.IgnorePlugin, this file is not blank and the import to fs is surrounded with try-catch fss = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'");
 
const fsTester = () => {
  if (!fss) return;
  
  console.log('readFileSync', fss["readdir"]);
  fss["readdir"]('.', (err, files) => {
    files.map(file => {
      console.log('file', file);
    });
  });
};

let fss;
try {
  // should throw exception (expected) if not Server-side rendering
  fss = require("fs");
  
  console.log('file system', fss);
  fsTester();
}
catch (e) {
  console.log(e);
}

export default fsTester;