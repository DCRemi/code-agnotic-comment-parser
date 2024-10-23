import {
	extractJsComContent,
	extractGenericTagBlock,
	getTagIndex,
	removeJsComBoundary,
	extractBlockTagData
} from "./ressources/commentExtractCommands";
import { getAllFilePathFromDir, JSONToFile } from "./ressources/helpers";
import {
	CommentBlock,
	GenericCommentBlock,
	GenericGlobalComments,
	Levels,
	Level_1,
	Level_2
} from "./ressources/interfaces";

// import fs from "fs";
const fs = require("fs");
const path = require("path");

/* ---------------------------- Variables --------------------------- */
const folderPath = "input";

/* -------------------------------------------------------------------------- */
/*                         STEP 0 - Get files tree data                       */
/* -------------------------------------------------------------------------- */

/* --------------------------- Get code files path -------------------------- */
const filesPaths: string[] = [];
getAllFilePathFromDir(folderPath, filesPaths, ".ts");

/* ----------------------------- Get level data ----------------------------- */
const levelDefinitionData: Levels = JSON.parse(fs.readFileSync("input/levelDefinition.json", "utf-8"));

/* ---------------------- Create empty blocks for each ---------------------- */
levelDefinitionData.genericBlocks = [];

levelDefinitionData.level_1s.forEach((level1) => {
	level1.genericLevel1Blocks = [];
	level1.level_2s.forEach((level2) => {
		level2.commentBlocks = [];
	});
});
levelDefinitionData.genericBlocks = [];

/* ----------------------- Create the jsonOutput folder --------------------- */
if (!fs.existsSync("./json_output")) {
	fs.mkdirSync("./json_output");
}

const commentBlocks = [];

filesPaths.forEach((filePath) => {
	/* -------------------------------------------------------------------------- */
	/*                        STEP 1 - Read type script file                      */
	/* -------------------------------------------------------------------------- */
	const file = fs.readFileSync(filePath, { encoding: "utf-8" });

	/* -------------------------------------------------------------------------- */
	/*    STEP 2 - Retrieve jsdoc style comment between "slash**"" and "*slash"   */
	/* -------------------------------------------------------------------------- */
	const jsCommentsBlocks = extractJsComContent(file);

	/* -------------------------------------------------------------------------- */
	/*          STEP 3 - Remove blocks indicator "slash **" and "*slash"          */
	/* -------------------------------------------------------------------------- */
	const jsCommentsBlocksCleaned: string[] = [];
	jsCommentsBlocks?.forEach((element: string, index: number) => {
		jsCommentsBlocksCleaned[index] = removeJsComBoundary(element);
	});

	/* -------------------------------------------------------------------------- */
	/*           STEP 4 - For each block extract tag's value and content          */
	/* -------------------------------------------------------------------------- */
	const genericCommentBlocks: GenericCommentBlock[] = [];
	const genericGlobalComments: GenericGlobalComments = {
		genericCommentBlocks
	};
	jsCommentsBlocksCleaned.forEach((element, index) => {
		if (getTagIndex(element).length !== 0) {
			genericGlobalComments.genericCommentBlocks[index] = {
				blocNumber: index + 1,
				genericTagSentences: extractGenericTagBlock(element, getTagIndex(element))
			};
		}
	});

	/* -------------------------------------------------------------------------- */
	/*               STEP 5 - Extract tag data depending on the tag               */
	/* -------------------------------------------------------------------------- */

	genericGlobalComments.genericCommentBlocks.forEach((genericCommentBlock) => {
		/* ----------------------- Extract comment block data ----------------------- */
		const commentBlock: CommentBlock = extractBlockTagData(genericCommentBlock);

		const level1ThatMatch = levelDefinitionData.level_1s.find((level1) => level1.levelName === commentBlock.level1);
		if (level1ThatMatch) {
			/* ------------- If the level1 written in the tag @level1 exist ------------- */
			const level2ThatMatch = level1ThatMatch.level_2s.find((level2) => level2.levelName === commentBlock.level2);
			if (level2ThatMatch) {
				/* ------------- If the level2 written in the tag @level2 exist ------------- */
				level2ThatMatch.commentBlocks.push(commentBlock);
			} else {
				/* --------- If the level2 written in the tag @level2 doesn't exist --------- */
				level1ThatMatch.genericLevel1Blocks.push(commentBlock); //the block is written in the level 1 genric file
			}
		} else {
			/* --------- If the level1 written in the tag @level1 doesn't exist --------- */
			levelDefinitionData.genericBlocks.push(commentBlock); //the block is written in the level "0" genric file
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
	JSONToFile(level1.genericLevel1Blocks, path.join("./json_output/" + level1.levelName, "generic"));
});
JSONToFile(levelDefinitionData.genericBlocks, path.join("./json_output", "generic"));
