import {
	createDefBlock,
	createExampleBlock,
	createHtmlFile,
	createParamBlock,
	createStepDefBlock,
	createToDoBlock
} from "./ressources/jsonToHtmlBlocks";
import { copyFilesStructToHtml, getAllFilePathFromDir, HtmlToFile } from "./ressources/command";
import { CommentBlock } from "./ressources/interfaces";

const fs = require("fs");
const path = require("path");
const folderPath = "./json_output/";
const filesPaths: string[] = [];
const sourcePathName = "json_output";
const destinationPath = "html_output/html_pages";

// #region RUN
/** STEP 1 : Create HTML folder & file structure */
getAllFilePathFromDir(folderPath, filesPaths);
copyFilesStructToHtml(filesPaths, sourcePathName, destinationPath);

//#endregion

const filePath = "./json_output/contextSetupOutput.json";
// filesPaths.forEach((filePath) => {

const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
var commentBlocks: string;
// console.log(jsonData);
jsonData.commentBlocks.forEach((commentBlock: CommentBlock) => {
	// console.log(commentBlock);

	const defBlock = createDefBlock(commentBlock);
	const paramBlock = createParamBlock(commentBlock);
	const exampleBlock = createExampleBlock(commentBlock);
	const todoBlock = createToDoBlock(commentBlock);

	const bloc = createStepDefBlock(defBlock, paramBlock, exampleBlock, todoBlock);
	commentBlocks += "<br/><br/>" + bloc;
	// });
	const htmlFile = createHtmlFile(commentBlocks);
	// const htmlFile = createHtmlFile(commentBlocks);
	HtmlToFile(htmlFile, "html_output/index");
});
// });
