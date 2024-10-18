import {
	extractTagSpecificData,
	extractJsComContent,
	extractGenericTagBlock,
	getTagIndex,
	removeJsComBoundary,
	extractBlockTagData
} from "./ressources/commentExtractCommands";
import { unCamelized, getAllFilePathFromDir, JSONToFile } from "./ressources/helpers";
import { CommentBlocks, GenericCommentBlock, GenericGlobalComments } from "./ressources/interfaces";

// import fs from "fs";
const fs = require("fs");

/* ---------------------------- Variables --------------------------- */
const folderPath = "input";

/* -------------------------------------------------------------------------- */
/*                         STEP 0 - Get files tree data                       */
/* -------------------------------------------------------------------------- */
const filesPaths: string[] = [];
getAllFilePathFromDir(folderPath, filesPaths, ".ts");

const commentBlocks = [];

if (!fs.existsSync("./json_output")) {
	fs.mkdirSync("./json_output");
}
const outputFilePath = `./json_output/Output`;

filesPaths.forEach((filePath) => {
	// const fileName = filePath.split(/input\/(.*)\.ts/)[1];
	// const intermediateOutputFilePath = `./json_output/intermediate/${fileName}Intermediate`;
	// const finalOutputFilePath = `./json_output/${fileName}Output`;
	// const fileNameUnCamelized = unCamelized(fileName);

	/* -------------------------------------------------------------------------- */
	/*                        STEP 1 - Read type script file                      */
	/* -------------------------------------------------------------------------- */
	const file = fs.readFileSync(filePath, { encoding: "utf-8" });

	/* -------------------------------------------------------------------------- */
	/*    STEP 2 - Retrieve jsdoc style comment between "slash**"" and "*slash"   */
	/* -------------------------------------------------------------------------- */
	const jsCommentsBlocks = extractJsComContent(file);

	/* -------------------------------------------------------------------------- */
	/*          STEP 3 - Remove blocks indicator "slash **" and "*slash"          */
	/* -------------------------------------------------------------------------- */
	const jsCommentsBlocksCleaned: string[] = [];
	jsCommentsBlocks?.forEach((element: string, index: number) => {
		jsCommentsBlocksCleaned[index] = removeJsComBoundary(element);
	});

	/* -------------------------------------------------------------------------- */
	/*           STEP 4 - For each block extract tag's value and content          */
	/* -------------------------------------------------------------------------- */
	const genericCommentBlocks: GenericCommentBlock[] = [];
	const genericGlobalComments: GenericGlobalComments = {
		genericCommentBlocks
	};
	jsCommentsBlocksCleaned.forEach((element, index) => {
		if (getTagIndex(element).length !== 0) {
			genericGlobalComments.genericCommentBlocks[index] = {
				blocNumber: index + 1,
				genericTagSentences: extractGenericTagBlock(element, getTagIndex(element))
			};
		}
	});

	// #region intermediate extract
	// if(intermediateOutputFilePath.match(/\.\/json_output\/intermediate\/\w*\//)) // not a root file
	// {
	// 	if (!fs.existsSync(intermediateOutputFilePath.match(/\.\/json_output\/intermediate\/\w*\//)[0])){
	// 		fs.mkdirSync(intermediateOutputFilePath.match(/\.\/json_output\/intermediate\/\w*\//)[0]);
	// 	}
	// }
	// JSONToFile(genericGlobalComments, intermediateOutputFilePath);
	//#endregion

	/* -------------------------------------------------------------------------- */
	/*               STEP - 5 Extract tag data depending on the tag               */
	/* -------------------------------------------------------------------------- */

	genericGlobalComments.genericCommentBlocks.forEach((genericCommentBlock) => {
		commentBlocks.push(extractBlockTagData(genericCommentBlock));
	});

	// const finalJson = extractTagSpecificData(fileNameUnCamelized, genericGlobalComments);

	/* -------------------------------------------------------------------------- */
	/*                        STEP 6 - Create output folder                       */
	/* -------------------------------------------------------------------------- */
	// if (!fs.existsSync("./json_output")) {
	// 	fs.mkdirSync("./json_output");
	// }

	// if (finalOutputFilePath.match(/\.\/json_output\/\w*\//)) {
	// 	// not a root file
	// 	if (!fs.existsSync(finalOutputFilePath.match(/\.\/json_output\/\w*\//)[0])) {
	// 		fs.mkdirSync(finalOutputFilePath.match(/\.\/json_output\/\w*\//)[0]);
	// 	}
	// }

	/* -------------------------------------------------------------------------- */
	/*                 STEP 7 - Write extracted data in json files                */
	/* -------------------------------------------------------------------------- */
	// JSONToFile(finalJson, finalOutputFilePath);
});

/* -------------------------------------------------------------------------- */
/*                 STEP 7 - Write extracted data in json files                */
/* -------------------------------------------------------------------------- */
JSONToFile(commentBlocks, outputFilePath);
