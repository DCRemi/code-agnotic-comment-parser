import { HtmlToFile, JSONToFile } from "./ressources/helpers";
import { createLevel_0_baseHtml, createLevel_1_BaseHtml } from "./ressources/htmlCommands";
import { Levels } from "./ressources/interfaces";

const fs = require("fs");
const path = require("path");

/* -------------------------------- Variables ------------------------------- */
const htmlOutputFolder = "./html_output";
const jsonOutputFolder = "./json_output";
const htmlFilesOutputFolder = path.join(htmlOutputFolder, "pages_tree");
var Level1IndexLinks = "";

/* -------------------------------------------------------------------------- */
/*                  STEP 1 - Read level definition json file                  */
/* -------------------------------------------------------------------------- */
const levelDefinitionData: Levels = JSON.parse(fs.readFileSync("input/levelDefinition.json", "utf-8"));

if (!fs.existsSync(htmlFilesOutputFolder)) {
	fs.mkdirSync(htmlFilesOutputFolder);
}
if (!fs.existsSync(jsonOutputFolder)) {
	fs.mkdirSync(jsonOutputFolder);
}

/* -------------------------------------------------------------------------- */
/*      STEP 2 -  Create files and folders + create html link to level 1      */
/* -------------------------------------------------------------------------- */
levelDefinitionData.level_1s.forEach((level_1) => {
	/* ------------------------- Create Level 1 html folders ------------------------- */
	const level1HtmlFolderPath = path.join(htmlFilesOutputFolder, level_1.levelName);
	if (!fs.existsSync(level1HtmlFolderPath)) {
		fs.mkdirSync(level1HtmlFolderPath);
	}

	/* --------------- Create Level 1 json folders + noLevel file --------------- */
	const level1JsonFolderPath = path.join(jsonOutputFolder, level_1.levelName);
	if (!fs.existsSync(level1JsonFolderPath)) {
		fs.mkdirSync(level1JsonFolderPath);
	}
	JSONToFile("", path.join(jsonOutputFolder, "noLevel"));

	/* -------------------------- Create level 2 html files -------------------------- */
	level_1.level_2s.forEach((level_2) => {
		HtmlToFile("", path.join(level1HtmlFolderPath, level_2.levelName));
	});

	/* ---------------- Create level 2 json files + noLevel files --------------- */
	level_1.level_2s.forEach((level_2) => {
		JSONToFile("", path.join(level1JsonFolderPath, level_2.levelName));
	});
	JSONToFile("", path.join(level1JsonFolderPath, "noLevel"));

	/* ----------------------- Create Level 1 index files ----------------------- */
	const level1IndexFilePath = level1HtmlFolderPath + "/index";
	const level1NoLevelFilePath = level1HtmlFolderPath + "/nolevel";
	const level1BaseFile = createLevel_1_BaseHtml(level_1);
	HtmlToFile(level1BaseFile, level1IndexFilePath);
	HtmlToFile(level1BaseFile, level1NoLevelFilePath);

	/* ----- Create link to level 1 index file to put in level 0 index file ----- */
	Level1IndexLinks += `
				<li class="nav-item">
					<a href="/${level1HtmlFolderPath}/index.html" class="nav-link">
					${level_1.levelName}	
					</a>
				</li>`;
});

/* -------------------------------------------------------------------------- */
/*                     STEP 3 - Create level 0 index file                     */
/* -------------------------------------------------------------------------- */
const level0BaseFile = createLevel_0_baseHtml(Level1IndexLinks);
HtmlToFile(level0BaseFile, htmlFilesOutputFolder + "/index");
HtmlToFile(level0BaseFile, htmlFilesOutputFolder + "/nolevel");
