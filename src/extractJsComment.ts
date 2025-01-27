import {
	extractJsComContent,
	extractGenericTagBlock,
	getTagIndex,
	removeJsComBoundary,
	extractBlockTagData
} from "./ressources/commentExtractCommands";
import { getAllFilePathFromDir, JSONToFile, unCamelized } from "./ressources/helpers";
import {
	CommentBlock,
	GenericCommentBlock,
	GenericCommentsTable,
	Levels,
	Level_1,
	Level_2
} from "./ressources/interfaces";

// import fs from "fs";
const fs = require("fs");
const path = require("path");

/* ---------------------------- Variables --------------------------- */
const folderPath = "input";

/* ---------------------- Create the jsonOutput folder ---------------------- */
if (!fs.existsSync("./json_output")) {
	fs.mkdirSync("./json_output");
}

/* -------------------------------------------------------------------------- */
/*                         STEP 0 - Get files tree data                       */
/* -------------------------------------------------------------------------- */
/* ------------------------ Get all input files path ------------------------ */
const filesPaths: string[] = [];
getAllFilePathFromDir(folderPath, filesPaths, ".ts");
// filesPaths contains the list of all files path

/* ----------------------------- Get level data ----------------------------- */
const levelDefinitionData: Levels = JSON.parse(fs.readFileSync("input/levelDefinition.json", "utf-8"));

/* ---------------------- Create empty blocks for each ---------------------- */
levelDefinitionData.noLevel1Blocks = [];

levelDefinitionData.level_1s.forEach((level1) => {
	level1.noLevel2Blocks = [];
	level1.level_2s.forEach((level2) => {
		level2.commentBlocks = [];
	});
});

/* -------------------------------------------------------------------------- */
/*                 Filing levelDefinitionData object with data                */
/* -------------------------------------------------------------------------- */
// each empty block created above will be filed with the corresponding json bocks

const commentBlocks = [];
filesPaths.forEach((filePath) => {
	/* -------------------------------------------------------------------------- */
	/*                        STEP 1 - Read type script file                      */
	/* -------------------------------------------------------------------------- */
	const file = fs.readFileSync(filePath, { encoding: "utf-8" });

	/* -------------------------------------------------------------------------- */
	/*                      STEP 2 - Retrieve comment blocks                      */
	/* -------------------------------------------------------------------------- */
	// Get data between comment block indicator ("combination of slash and wildcards")
	const jsCommentsBlocks = extractJsComContent(file);

	/* -------------------------------------------------------------------------- */
	/*                            STEP 3 - Clean blocks                           */
	/* -------------------------------------------------------------------------- */
	// Remove comment block indicator ("combination of slash and wildcards")
	const jsCommentsBlocksCleaned: string[] = [];
	jsCommentsBlocks?.forEach((element: string, index: number) => {
		jsCommentsBlocksCleaned[index] = removeJsComBoundary(element);
	});

	/* -------------------------------------------------------------------------- */
	/*                  STEP 4 - Extract tag's value and content                  */
	/* -------------------------------------------------------------------------- */
	const genericCommentBlocks: GenericCommentBlock[] = [];
	const genericCommentsTable: GenericCommentsTable = {
		genericCommentBlocks
	};
	jsCommentsBlocksCleaned.forEach((element, index) => {
		if (getTagIndex(element).length !== 0) {
			genericCommentsTable.genericCommentBlocks[index] = {
				blocNumber: index + 1,
				genericTagSentences: extractGenericTagBlock(element, getTagIndex(element))
			};
		}
	});

	/* -------------------------------------------------------------------------- */
	/*               STEP 5 - Extract tag data depending on the tag               */
	/* -------------------------------------------------------------------------- */

	genericCommentsTable.genericCommentBlocks.forEach((genericCommentBlock) => {
		/* ----------------------- Extract comment block data ----------------------- */
		const commentBlock: CommentBlock = extractBlockTagData(genericCommentBlock);

		const level1ThatMatch = levelDefinitionData.level_1s.find((level1) => level1.levelName === commentBlock.level1);
		if (level1ThatMatch) {
			/* ----------- Build navbar for level 1 wiht link to level 2 pages ---------- */
			var level2FilePathsLinks = "";
			level1ThatMatch.level_2s.forEach((level_2) => {
				level2FilePathsLinks += `
							<li class="nav-item">
								<a href=${level_2.levelName}.html class="nav-link">
									${unCamelized(level_2.levelName)}	
								</a>
							</li>`;
			});
			/* ------------- If the level1 written in the tag @level1 exist ------------- */
			const level2ThatMatch = level1ThatMatch.level_2s.find((level2) => level2.levelName === commentBlock.level2);
			if (level2ThatMatch) {
				/* ------------- If the level2 written in the tag @level2 exist ------------- */
				level2ThatMatch.commentBlocks.push(commentBlock);
				// add on each level 2 block the nav bar menu (used when building html pages)
				level2ThatMatch.htmlNavBar = level2FilePathsLinks;
			} else {
				/* --------- If the level2 written in the tag @level2 doesn't exist --------- */
				level1ThatMatch.noLevel2Blocks.push(commentBlock); //the block is written in the level 1 genric file
			}
		} else {
			/* --------- If the level1 written in the tag @level1 doesn't exist --------- */
			levelDefinitionData.noLevel1Blocks.push(commentBlock); //the block is written in the level "0" genric file
		}
	});

	/* -------------------------------------------------------------------------- */
	/*                STEP 6 - Sort blocks by level 3 inside level2               */
	/* -------------------------------------------------------------------------- */

	// TO DO
});

/* -------------------------------------------------------------------------- */
/*                 STEP 7 - Write extracted data in json files                */
/* -------------------------------------------------------------------------- */

levelDefinitionData.level_1s.forEach((level1) => {
	level1.level_2s.forEach((level2) => {
		JSONToFile(level2, "./json_output/" + level1.levelName + "/" + level2.levelName);
	});
	JSONToFile(level1.noLevel2Blocks, path.join("./json_output/" + level1.levelName, "noLevel"));
});
JSONToFile(levelDefinitionData.noLevel1Blocks, path.join("./json_output", "noLevel"));
