import { HtmlToFile } from "./ressources/helpers";
import { createLevel1IndexHtml } from "./ressources/htmlCommands";
import { Level_1, Levels } from "./ressources/interfaces";

const fs = require("fs");
const path = require("path");

/* -------------------------------- Variables ------------------------------- */
const htmlOutputFolder = "./html_output";
const htmlFilesOutputFolder = path.join(htmlOutputFolder, "pages_tree");
var Level1IndexLinks = "";

/* -------------------------------------------------------------------------- */
/*                  STEP 1 - Read level definition json file                  */
/* -------------------------------------------------------------------------- */
const levelDefinitionData: Levels = JSON.parse(fs.readFileSync("input/levelDefinition.json", "utf-8"));

if (!fs.existsSync(htmlFilesOutputFolder)) {
	fs.mkdirSync(htmlFilesOutputFolder);
}

levelDefinitionData.level_1s.forEach((level_1) => {
	/* -------------------------------------------------------------------------- */
	/*               STEP 2 Create level 1 folders files						  */
	/* -------------------------------------------------------------------------- */
	/* ------------------------- Create level 1 folders ------------------------- */
	const level1FolderPath = path.join(htmlFilesOutputFolder, level_1.levelName);
	if (!fs.existsSync(level1FolderPath)) {
		fs.mkdirSync(level1FolderPath);
	}

	const level1IndexFilePath = level1FolderPath + "/index";

	/* ----------------------- Create level 2 files empty ----------------------- */
	HtmlToFile("", level1IndexFilePath);

	level_1.level_2s.forEach((level_2) => {
		const level2FilePath = path.join(level1FolderPath, level_2.levelName);
		HtmlToFile("", level2FilePath);
	});
	/* -------------- Create html links block to level 1 index.html ------------- */
	Level1IndexLinks += `
				<a href="/${level1FolderPath}/index.html">
					<button type="button" class="btn btn-success btn-lg"> ${level_1.levelName} </button>
				</a>
				<br /><br />`;
});

/* ----------------- Create and write level 1 indexedDB.html ---------------- */
const level0IndexFile = createLevel1IndexHtml(Level1IndexLinks);
HtmlToFile(level0IndexFile, htmlFilesOutputFolder + "/index");

/* -------------------------------------------------------------------------- */
/*                   STEP 3 - Create each level 2 html file                   */
/* -------------------------------------------------------------------------- */
levelDefinitionData.level_1s.forEach((level_1) => {});
