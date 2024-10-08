import { createCommentBlock, createHtmlFile } from "../html_output/html_templates/jsonToHtmlBlocks";
import { copyFilesStructToHtml, getAllFilePathFromDir, HtmlToFile } from "./ressources/command";

const fs = require("fs");
const path = require("path");

const folderPath = "./json_output/";
const filesPaths: string[] = [];
const sourcePathName = "json_output";
const destinationPath = "html_output/html_pages";

//#region Create HTML folder & file structure
getAllFilePathFromDir(folderPath, filesPaths);
copyFilesStructToHtml(filesPaths, sourcePathName, destinationPath);
//#endregion

// filesPaths.forEach((filePath) => {
const filePath = "./json_output/contextSetupOutput.json";
const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
var commentBlocks: string;
// console.log(jsonData);
jsonData.commentBlocks.forEach((commentBlock) => {
	console.log(commentBlock);

	var stepDefName = commentBlock.stepDef;
	var stepDefDesc = commentBlock.descriptionTags[0].description;
	var stepDefParam =
		commentBlock.paramTags[0].param_type +
		"  " +
		commentBlock.paramTags[0].param_name +
		"  " +
		commentBlock.paramTags[0].param_desc;
	// var stepDefExample = commentBlock.exampleTags;
	var stepDefExample = "";
	var stepDefToDo =
		commentBlock.todoTags[0].todo_type.toUpperCase() + "   text   : " + commentBlock.todoTags[0].todo_text;
	const bloc = createCommentBlock(stepDefName, stepDefDesc, stepDefParam, stepDefExample, stepDefToDo);
	commentBlocks += "\n" + bloc;
});
const htmlFile = createHtmlFile(commentBlocks);
HtmlToFile(htmlFile, "html_output/index");
// });
