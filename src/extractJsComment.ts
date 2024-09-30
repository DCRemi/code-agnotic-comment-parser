import {GenericCommentBlock, GenericGlobalComments } from "../interfaces";
const fs = require("fs");
// const { GenericCommentBlock, GenericGlobalComments } = require("../interfaces");
const {
	extractJsComContent,
	getTagDataFromBlock,
	getTagIndex,
	JSONToFile,
	removeJsComBoundary
} = require("./command/command");

// const inputFilePath = "./sampleData/test.js"
const inputFilePath = "./input/contextSetup.ts";
const outputFilePath = "./output/jsCommentExtractedOutput";

// #region run
/** STEP 1 : Get file content */
const file = fs.readFileSync(inputFilePath, { encoding: "utf-8" });

/** STEP 2 : Retrieve only js doc style comment between in blocks */
const jsCommentsBlocks = extractJsComContent(file);

/** STEP 3 : Remove start and end indicator of blocks */
const jsCommentsBlocksCleaned: string[] = [];
jsCommentsBlocks?.forEach((element:string, index:number) => {
	jsCommentsBlocksCleaned[index] = removeJsComBoundary(element);
});

/** STEP 4 : For each comments block extract tag value and content */
const genericCommentBlocks:GenericCommentBlock[]=[];
const genericGlobalComments: GenericGlobalComments={
	genericCommentBlocks
};
jsCommentsBlocksCleaned.forEach((element, index) => {
	genericGlobalComments.genericCommentBlocks[index] = {
		blocNumber: index + 1,
		genericTagSentences: getTagDataFromBlock(element, getTagIndex(element))
	};
});

/** STEP 5 : Write result in a json file */
JSONToFile(genericGlobalComments, outputFilePath);
// #endregion
