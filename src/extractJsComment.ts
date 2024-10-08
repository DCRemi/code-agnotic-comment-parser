import {
	extractTagSpecificData,
	extractJsComContent,
	getTagDataFromBlock,
	getTagIndex,
	JSONToFile,
	removeJsComBoundary,
	getAllFilePathFromDir
} from "./ressources/command";
import { GenericCommentBlock, GenericGlobalComments } from "./ressources/interfaces";

// import fs from "fs";
const fs = require("fs");
const folderPath = "input";
const filesPaths: string[] = [];

getAllFilePathFromDir(folderPath, filesPaths);

filesPaths.forEach((filePath) => {
	const fileName = filePath.split(/input\/(.*)\.ts/)[1];
	const intermediateOutputFilePath = `./json_output/intermediate/${fileName}Intermediate`;
	const finalOutputFilePath = `./json_output/${fileName}Output`;

	// #region run
	/** STEP 1 : Get file content */
	const file = fs.readFileSync(filePath, { encoding: "utf-8" });

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

	// #region intermediate extract
	// if(intermediateOutputFilePath.match(/\.\/json_output\/intermediate\/\w*\//)) // not a root file
	// {
	// 	if (!fs.existsSync(intermediateOutputFilePath.match(/\.\/json_output\/intermediate\/\w*\//)[0])){
	// 		fs.mkdirSync(intermediateOutputFilePath.match(/\.\/json_output\/intermediate\/\w*\//)[0]);
	// 	}
	// }
	// JSONToFile(genericGlobalComments, intermediateOutputFilePath);
	//#endregion

	/** STEP 5 :  extract tag specific data */
	const finalJson = extractTagSpecificData(fileName, genericGlobalComments);

	/** STEP 6 : Write final json to file */
	if (finalOutputFilePath.match(/\.\/json_output\/\w*\//)) {
		// not a root file
		if (!fs.existsSync(finalOutputFilePath.match(/\.\/json_output\/\w*\//)[0])) {
			fs.mkdirSync(finalOutputFilePath.match(/\.\/json_output\/\w*\//)[0]);
		}
	}
	JSONToFile(finalJson, finalOutputFilePath);
	// #endregion
});
