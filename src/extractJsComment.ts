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
	/*                  STEP 2 - Extract untreated comment blocks                 */
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
		// Check if the block contains a tag if not it is not treated
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
		/* -------------------------------------------------------------------------- */
		/*           STEP 5.1 - Extract tag specific data from generic block          */
		/* -------------------------------------------------------------------------- */
		const commentBlock: CommentBlock = extractBlockTagData(genericCommentBlock);

		/* -------------------------------------------------------------------------- */
		/*           STEP 5.2 - Add specified blocks to the corresping level          */
		/*                   inside the levelDefinitionData object	                  */
		/* -------------------------------------------------------------------------- */

		// Check that the level1 from the block exists in levelDefinition file
		const level1ThatMatch = levelDefinitionData.level_1s.find((level1) => level1.levelName === commentBlock.level1);
		if (level1ThatMatch) {
			// If the level1 tag is referenced in the levelDefinitionData file
			var level2FilePathsLinks = "";
			level1ThatMatch.level_2s.forEach((level_2) => {
				/* ----------- Build navbar for level 1 with link to level 2 pages ---------- */
				level2FilePathsLinks += `
							<li class="nav-item">
								<a href=${level_2.levelName}.html class="nav-link">
									${unCamelized(level_2.levelName)}	
								</a>
							</li>`;
			});

			/* --------------------- Level 2 existence verification --------------------- */
			const level2ThatMatch = level1ThatMatch.level_2s.find((level2) => level2.levelName === commentBlock.level2);
			// Check that the level2 from the block exists in levelDefinition file

			if (level2ThatMatch) {
				// If the level2 tag is referenced in the levelDefinitionData file
				level2ThatMatch.commentBlocks.push(commentBlock);
				level2ThatMatch.htmlNavBar = level2FilePathsLinks; // add on each level 2 block the nav bar menu (used when building html pages)
			} else {
				// If the level2 tag is not referenced in the levelDefinitionData file it considered as no level1 block
				level1ThatMatch.noLevel2Blocks.push(commentBlock); //the block is written in the level 1 generic file
			}
		} else {
			// If the level1 tag is not referenced in the levelDefinitionData file it considered as no level1 block
			levelDefinitionData.noLevel1Blocks.push(commentBlock); //the block is written in the level "0" generic file
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
