import {
	createDefHtmlBlock,
	createExampleHtmlBlock,
	createHtmlFile,
	createParamHtmlBlock,
	createStepDefHtmlBlock,
	createToDoHtmlBlock,
	createTitleHtmlBlock
} from "./ressources/htmlCommands";
import { getAllFilePathFromDir, HtmlToFile } from "./ressources/helpers";
import { CommentBlock, Level_2, Levels } from "./ressources/interfaces";
const fs = require("fs");
const path = require("path");

/* ---------------------------- Variables --------------------------- */
const jsonOutputFolder = "./json_output/";
const filesPaths: string[] = [];
const destinationPath = "html_output/pages_tree";

/* -------------------------------------------------------------------------- */
/*                     Step 0 - Get the list of json files                    */
/* -------------------------------------------------------------------------- */
getAllFilePathFromDir(jsonOutputFolder, filesPaths, ".json");

filesPaths.forEach((filePath) => {
	/* -------------------------------------------------------------------------- */
	/*               Case 1 - Files corresponding to existing level               */
	/* -------------------------------------------------------------------------- */
	if (!filePath.includes("noLevel")) {
		/* -------------------------------------------------------------------------- */
		/*           STEP 1 - get data from the json file and construct path          */
		/* -------------------------------------------------------------------------- */
		const fileJsonData: Level_2 = JSON.parse(fs.readFileSync(filePath, "utf-8"));
		const commentJsonBlocks = fileJsonData.commentBlocks ? fileJsonData.commentBlocks : [""];
		const fileLevelPath = filePath.replace("json_output/", "").replace(path.extname(filePath), "");
		/* -------------------------------------------------------------------------- */
		/*                   STEP 2 - Create the html comment block                   */
		/* -------------------------------------------------------------------------- */
		var htmlGivenBlocks = "";
		var htmlWhenBlocks = "";
		var htmlThenBlocks = "";
		var htmlUnknownBlocks = "";
		commentJsonBlocks.forEach((commentBlock: CommentBlock, index) => {
			/* ------------------------ Build each comment block ------------------------ */
			const TitleHtmlBlock = createTitleHtmlBlock(commentBlock, index);
			const defHtmlBlock = createDefHtmlBlock(commentBlock);
			const paramHtmlBlock = createParamHtmlBlock(commentBlock);
			const exampleHtmlBlock = createExampleHtmlBlock(commentBlock);
			const todoHtmlBlock = createToDoHtmlBlock(commentBlock);
			const htmlStepDefBlock = createStepDefHtmlBlock(
				TitleHtmlBlock,
				defHtmlBlock,
				paramHtmlBlock,
				exampleHtmlBlock,
				todoHtmlBlock,
				index
			);

			/* ----------------------- Split between level3 blocs ----------------------- */
			switch (commentBlock.level3) {
				case "Given":
					htmlGivenBlocks += htmlStepDefBlock + "<br/>";
					break;
				case "When":
					htmlWhenBlocks += htmlStepDefBlock + "<br/>";
					break;
				case "Then":
					htmlThenBlocks += htmlStepDefBlock + "<br/>";
					break;
				case "default":
					htmlUnknownBlocks += htmlStepDefBlock + "<br/>";
					break;
			}
		});
		/* ---------------------------- Create main block --------------------------- */
		const htmlCommentBlocks = `
		<h2 class="pagetitle"> Given </h2>
			<div class="accordion">
					${htmlGivenBlocks}
			</div>
			<br />
		<h2 class="pagetitle"> When </h2>
			<div class="accordion">
					${htmlWhenBlocks}
			</div>
			<br />
		<h2 class="pagetitle"> Then </h2>
			<div class="accordion">
					${htmlThenBlocks}
			</div>
			<br />
		<h2 class="pagetitle"> Unknown </h2>
			<div class="accordion">
					${htmlUnknownBlocks}
			</div>`;
		/* -------------------------------------------------------------------------- */
		/*                        STEP 3 - Create the html body                       */
		/* -------------------------------------------------------------------------- */
		var htmlBody: string = "";
		htmlBody = `
		<div>
			<h1 class="pagetitle">${fileJsonData.levelName ? fileJsonData.levelName : ""}</h1>
			<p>${fileJsonData.levelDesc ? fileJsonData.levelDesc : ""}</p>
		</div>
			${htmlCommentBlocks ? htmlCommentBlocks : ""}`;
		/* -------------------------------------------------------------------------- */
		/*               STEP 4 - Integrating the body in the html file               */
		/* -------------------------------------------------------------------------- */
		const htmlFile = createHtmlFile(htmlBody, fileJsonData);
		/* -------------------------------------------------------------------------- */
		/*                 STEP 5 - Write the corresponding html file                 */
		/* -------------------------------------------------------------------------- */
		HtmlToFile(htmlFile, `${destinationPath}/${fileLevelPath}`);
	} else {
		/* -------------------------------------------------------------------------- */
		/*              Case 2 - Files corresponding to no existing level             */
		/* -------------------------------------------------------------------------- */
		/* -------------------------------------------------------------------------- */
		/*           STEP 1 - get data from the json file and construct path          */
		/* -------------------------------------------------------------------------- */
		const noLevelBlocks: CommentBlock[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
		const levelFolder = filePath.replace("json_output/", "").replace(path.basename(filePath), "");
		const noLevelFilePath = destinationPath + "/" + levelFolder + "noLevel2.html";
		const noLevelHtmlFile = fs.readFileSync(noLevelFilePath, "utf-8");
		var htmlFile;
		if (noLevelBlocks.length !== 0) {
			/* -------------------------------------------------------------------------- */
			/*                   STEP 2 - Create the html comment block                   */
			/* -------------------------------------------------------------------------- */
			var htmlCommentBlocks = "";
			noLevelBlocks.forEach((commentBlock: CommentBlock, index) => {
				/* ------------------------ Build each comment block ------------------------ */
				const TitleHtmlBlock = createTitleHtmlBlock(commentBlock, index);
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
				<div>
					<h1 class="pagetitle">Level 1 : ${commentBlock.level1 ? commentBlock.level1 : ""}</h3>
					<h2 class="pagetitle">Level 2 : ${commentBlock.level2 ? commentBlock.level2 : ""}</h3>
				</div>
				<div class="accordion-item stepDefinition" id="commentBlock${index}">
					${bloc}
				</div>`;
				/* ---------------------- Push to the global html block --------------------- */
				htmlCommentBlocks += htmlCommentBlock + "<br/><br/>";
			});

			/* -------------------------------------------------------------------------- */
			/*                        STEP 3 - Create the html body                       */
			/* -------------------------------------------------------------------------- */
			var htmlBody: string = "";
			htmlBody = `
			<h1 class="pagetitle">Unknown Level steps</h1>
			<div class="accordion">
			${htmlCommentBlocks ? htmlCommentBlocks : ""}
			</div>`;
			/* -------------------------------------------------------------------------- */
			/*               STEP 5 - Build the html file including the body              */
			/* -------------------------------------------------------------------------- */
			htmlFile = noLevelHtmlFile.replace("htmlPartToReplace", htmlBody);
		} else {
			htmlFile = noLevelHtmlFile.replace("htmlPartToReplace", "<p>No unknown levels or tags<p>");
		}
		/* -------------------------------------------------------------------------- */
		/*                 STEP 6 - Write the corresponding html file                 */
		/* -------------------------------------------------------------------------- */
		HtmlToFile(htmlFile, noLevelFilePath.replace(path.extname(noLevelFilePath), ""));
	}
});
