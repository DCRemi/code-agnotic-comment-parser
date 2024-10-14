import {
	createDefHtmlBlock,
	createExampleHtmlBlock,
	createHtmlFileDesc,
	createHtmlFile,
	createParamHtmlBlock,
	createStepDefHtmlBlock,
	createToDoHtmlBlock,
	createHtmlInteractionType
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

// const filePath = "./json_output/storageOutput.json";
filesPaths.forEach((filePath) => {
	const fileJsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	const commentJsonBlocks = fileJsonData.commentBlocks;
	const interactionTypeJsonBlocks = fileJsonData.interactionTypes;

	var fileHtmlBlocks: string = "";

	const fileHtmlDesc = createHtmlFileDesc(fileJsonData);
	fileHtmlBlocks = fileHtmlDesc;

	const fileHtmlInteractionTypes = createHtmlInteractionType(interactionTypeJsonBlocks);
	fileHtmlBlocks += "<br/>" + fileHtmlInteractionTypes;
	fileHtmlBlocks += "<br/><h2>Steps</h2>";

	commentJsonBlocks.forEach((commentBlock: CommentBlock) => {
		const defHtmlBlock = createDefHtmlBlock(commentBlock);
		const paramHtmlBlock = createParamHtmlBlock(commentBlock);
		const exampleHtmlBlock = createExampleHtmlBlock(commentBlock);
		const todoHtmlBlock = createToDoHtmlBlock(commentBlock);
		const bloc = createStepDefHtmlBlock(defHtmlBlock, paramHtmlBlock, exampleHtmlBlock, todoHtmlBlock);
		fileHtmlBlocks += bloc + "<br/><br/>";
	});

	const htmlFile = createHtmlFile(fileHtmlBlocks);

	HtmlToFile(htmlFile, `html_output/html_pages/${path.basename(filePath).replace(path.extname(filePath), "")}`);
});
