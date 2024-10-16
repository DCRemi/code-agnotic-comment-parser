import {
	createDefHtmlBlock,
	createExampleHtmlBlock,
	createHtmlFileDesc,
	createHtmlFile,
	createParamHtmlBlock,
	createStepDefHtmlBlock,
	createToDoHtmlBlock,
	createHtmlInteractionType,
	createTitleHtmlBlock
} from "./ressources/htmlCommands";
import { copyFilesStructToHtml } from "./ressources/htmlCommands";
import { getAllFilePathFromDir, HtmlToFile } from "./ressources/helpers";
import { CommentBlock } from "./ressources/interfaces";

const fs = require("fs");
const path = require("path");
const folderPath = "./json_output/";
const filesPaths: string[] = [];
const sourcePathName = "json_output";
const destinationPath = "html_output";

// #region RUN
/** STEP 1 : Create HTML folder & file structure */
getAllFilePathFromDir(folderPath, filesPaths, ".json");
copyFilesStructToHtml(filesPaths, sourcePathName, destinationPath);

//#endregion

// const filePath = "./json_output/storageOutput.json";
filesPaths.forEach((filePath) => {
	const fileJsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	const commentJsonBlocks = fileJsonData.commentBlocks;
	const interactionTypeJsonBlocks = fileJsonData.interactionTypes;

	var htmlBody: string = "";

	const fileHtmlDesc = createHtmlFileDesc(fileJsonData);
	htmlBody = fileHtmlDesc;

	const fileHtmlInteractionTypes = createHtmlInteractionType(interactionTypeJsonBlocks);

	var htmlCommentBlocks = "";
	commentJsonBlocks.forEach((commentBlock: CommentBlock) => {
		const TitleHtmlBlock = createTitleHtmlBlock(commentBlock);
		const defHtmlBlock = createDefHtmlBlock(commentBlock);
		const paramHtmlBlock = createParamHtmlBlock(commentBlock);
		const exampleHtmlBlock = createExampleHtmlBlock(commentBlock);
		const todoHtmlBlock = createToDoHtmlBlock(commentBlock);
		const bloc = createStepDefHtmlBlock(
			TitleHtmlBlock,
			defHtmlBlock,
			paramHtmlBlock,
			exampleHtmlBlock,
			todoHtmlBlock,
			commentBlock.blocNumber
		);
		const htmlCommentBlock = `
			<div class="accordion-item stepDefinition" id="commentBlock${commentBlock.blocNumber - 1}">
				${bloc}
			</div>`;
		htmlCommentBlocks += htmlCommentBlock + "<br/><br/>";
	});

	htmlBody = `
		${fileHtmlDesc ? fileHtmlDesc : ""}
		${fileHtmlInteractionTypes ? fileHtmlInteractionTypes : ""}
		<div class="pagetitle">
			<h2>Steps</h2>
		</div>
		<div class="accordion">
		${htmlCommentBlocks ? htmlCommentBlocks : ""}
		</div>
	`;

	const htmlFile = createHtmlFile(htmlBody);

	HtmlToFile(htmlFile, `html_output/${path.basename(filePath).replace(path.extname(filePath), "")}`);
});
