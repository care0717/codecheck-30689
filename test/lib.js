const codecheck = require("codecheck");
const fs = require("fs");
const app = codecheck.consoleApp(process.env.APP_COMMAND);

module.exports.removeGeneratedFile = function() {
  // remove already generated files
  fs.readdir("./out/", (err, files) => {
    if (err) {return;}
    files.forEach( filename => {
      fs.unlink(`./out/${filename}`, (err) => {
        if (err) {console.log(err); return; }
      });
    });
  });
};
