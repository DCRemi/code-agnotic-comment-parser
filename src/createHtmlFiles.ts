import {
	createDefHtmlBlock,
	createExampleHtmlBlock,
	createHtmlFile,
	createParamHtmlBlock,
	createStepDefHtmlBlock,
	createToDoHtmlBlock,
	createTitleHtmlBlock
} from "./ressources/htmlCommands";
// import { copyFilesStructToHtml } from "./ressources/htmlCommands";
import { getAllFilePathFromDir, HtmlToFile } from "./ressources/helpers";
import { CommentBlock, Level_2, Levels } from "./ressources/interfaces";
const fs = require("fs");
const path = require("path");

/* ---------------------------- Variables --------------------------- */
const jsonOutputFolder = "./json_output/";
const filesPaths: string[] = [];
const destinationPath = "html_output/pages_tree";

/* -------------------------------------------------------------------------- */
/*                STEP 1 - Create HTML folder & file structure                */
/* -------------------------------------------------------------------------- */
getAllFilePathFromDir(jsonOutputFolder, filesPaths, ".json");

filesPaths.forEach((filePath) => {
	/* -------------------------------------------------------------------------- */
	/*           STEP 2 - get data for each json file and construct path          */
	/* -------------------------------------------------------------------------- */
	const fileJsonData: Level_2 = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	const commentJsonBlocks = fileJsonData.commentBlocks ? fileJsonData.commentBlocks : [""];
	const fileLevelPath = filePath.replace("json_output/", "").replace(path.extname(filePath), "");

	var htmlBody: string = "";

	/* -------------------------------------------------------------------------- */
	/*                   STEP 3 - Create the html comment block                   */
	/* -------------------------------------------------------------------------- */
	var htmlCommentBlocks = "";
	commentJsonBlocks.forEach((commentBlock: CommentBlock, index) => {
		/* ------------------------ Build each comment block ------------------------ */
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
			index
		);
		const htmlCommentBlock = `
			<div class="accordion-item stepDefinition" id="commentBlock${index}">
				${bloc}
			</div>`;
		/* ---------------------- Push to the global html block --------------------- */
		htmlCommentBlocks += htmlCommentBlock + "<br/><br/>";
	});

	/* -------------------------------------------------------------------------- */
	/*                        STEP 4 - Create the html body                       */
	/* -------------------------------------------------------------------------- */
	htmlBody = `
		${fileJsonData.levelName ? fileJsonData.levelName : ""}
		${fileJsonData.levelName ? fileJsonData.levelName : ""}
		<div class="pagetitle">
			<h2>Steps</h2>
		</div>
		<div class="accordion">
		${htmlCommentBlocks ? htmlCommentBlocks : ""}
		</div>
	`;
	/* -------------------------------------------------------------------------- */
	/*               STEP 5 - Build the html file including the body              */
	/* -------------------------------------------------------------------------- */
	const htmlFile = createHtmlFile(htmlBody);

	/* -------------------------------------------------------------------------- */
	/*                 STEP 6 - Write the corresponding html file                 */
	/* -------------------------------------------------------------------------- */
	HtmlToFile(htmlFile, `${destinationPath}/${fileLevelPath}`);
});
