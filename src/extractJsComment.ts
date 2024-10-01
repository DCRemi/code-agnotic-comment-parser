import {
	extractTagSpecificData,
	extractJsComContent,
	getTagDataFromBlock,
	getTagIndex,
	JSONToFile,
	removeJsComBoundary
} from "./ressources/command";
import { GenericCommentBlock, GenericGlobalComments } from "./ressources/interfaces";
const fs = require("fs");

// const inputFilePath = "./sampleData/test.js"
const inputFileName = "contextSetup.ts";
const inputFilePath = `./input/${inputFileName}`;
const intermediateOutputFilePath = "./output/jsCommentExtractedOutput";
const finalOutputFilePath = `./output/${inputFileName}Output`;

// #region run
/** STEP 1 : Get file content */
const file = fs.readFileSync(inputFilePath, { encoding: "utf-8" });

/** STEP 2 : Retrieve only js doc style comment between in blocks */
const jsCommentsBlocks = extractJsComContent(file);

/** STEP 3 : Remove start and end indicator of blocks */
const jsCommentsBlocksCleaned: string[] = [];
jsCommentsBlocks?.forEach((element: string, index: number) => {
	jsCommentsBlocksCleaned[index] = removeJsComBoundary(element);
});

/** STEP 4 : For each comments block extract tag value and content */
const genericCommentBlocks: GenericCommentBlock[] = [];
const genericGlobalComments: GenericGlobalComments = {
	genericCommentBlocks
};
jsCommentsBlocksCleaned.forEach((element, index) => {
	genericGlobalComments.genericCommentBlocks[index] = {
		blocNumber: index + 1,
		genericTagSentences: getTagDataFromBlock(element, getTagIndex(element))
	};
});

/** STEP 5 : Write intermediary json to file */
JSONToFile(genericGlobalComments, intermediateOutputFilePath);

/** STEP 6 :  extract tag specific data */
const finalJson = extractTagSpecificData(inputFileName, genericGlobalComments);

/** STEP 7 : Write final json to file */
JSONToFile(finalJson, finalOutputFilePath);

// #endregion
