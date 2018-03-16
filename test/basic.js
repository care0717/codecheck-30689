"use strict";

const expect = require("chai").expect;
const codecheck = require("codecheck");
const app = codecheck.consoleApp(process.env.APP_COMMAND);
const fs =require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const testcases = require("./basic_testcases.json");

const removeGeneratedFile = require("./lib.js").removeGeneratedFile;

describe("CLI", () => {

  before(() => { removeGeneratedFile() });

  testcases.forEach((testcase) => {
    it(testcase.description, () => {
      return app.codecheck(testcase.args).then( result => {
        expect(result.code).to.equal(0,
          "CLIアプリケーションはステータスコード0で終了しなければならない");

        try {
          fs.statSync(testcase.args[1]);
        } catch (e) {
          throw new Error(`画像ファイル: ${testcase.args[0]} が生成されていません。`);
        }

        let testBuf = fs.readFileSync(testcase.args[1]);
        let testImage = PNG.sync.read(testBuf);

        let answerBuf = fs.readFileSync(testcase.preparedImage);
        let answerImage = PNG.sync.read(answerBuf);

        let diffPng = new PNG({
          width: answerImage.width,
          height: answerImage.height
        });

        // expect(answerImage.width).to.be.equal(testImage.width);
        // expect(answerImage.height).to.be.equal(testImage.height);

        let diff = pixelmatch(answerImage.data, testImage.data,
          null, answerImage.width, answerImage.height);

        let diffPercentage = Math.round(
          100*100*diff/(diffPng.width*diffPng.height))/100;

        console.log("比較画像との差分: " + diffPercentage + "%");
        // threshold: 5%
        expect(diffPercentage).to.be.lessThan(5.0,
          "生成された画像が" + diffPercentage+ "%程度異なります。");
        if (diffPercentage > 5.0) {
          throw new Error("生成された画像が" + diffPercentage + "%程度異なります");
        }
      });
    });
  });
});
