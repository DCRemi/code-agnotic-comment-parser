const fs = require("fs");
// import {} from "./interfaces"
// let globalComment : GlobalComments;

// #region Functions
const getJsCom = function (text) {
	// Construction of regex
	const startRegex = "\\/\\*\\*";
	const endRegex = "\\*\\";
	const stringregex = `${startRegex}(.*?)([\\s\\S])${endRegex}/`;
	const delimiterRegex = new RegExp(stringregex, "gs");
	return text.match(delimiterRegex);
};

const removeJsComStartEnd = function (text) {
	// Construction of regex
	const startRegex = "\\/\\*\\*[\\s]*";
	const endRegex = "\\n \\*/";
	const stringregex = `${startRegex}(.*)${endRegex}`;
	const delimiterRegex = new RegExp(stringregex, "s");
	// regex is not global (flag g)
	// [0] is the full match containing start and end
	// [1] is the first capturing group (see https://javascript.info/regexp-methods)
	// As we want to remove /** */ we keep the [1]
	return text.match(delimiterRegex)[1];
};

const getTagIndex = function (jsCommentBlock) {
	const tagRegex = / * @\w*/g;
	const tagMatches = jsCommentBlock.matchAll(tagRegex);

	let tagsIndex = [];
	for (const match of tagMatches) {
		tagsIndex.push({ tag: match[0], tagStart: match.index, tagEnd: match.index + match[0].length });
	}
	return tagsIndex;
};

const getTagDataFromBlock = function (jsCommentBlock, jsBlockTagsIndex) {
	let commentBlock = [];
	jsBlockTagsIndex.forEach((element, index) => {
		let tagSentence = {
			tag: element.tag.trim(),
			content:
				index !== jsBlockTagsIndex.length - 1 // for the last tag the end is */ and not the next tag start
					? jsCommentBlock.substring(jsBlockTagsIndex[index].tagEnd, jsBlockTagsIndex[index + 1].tagStart).trim()
					: jsCommentBlock.substring(jsBlockTagsIndex[index].tagEnd).trim()
		};
		// Remove wildcards from the contents, then remove space and line break at the end
		tagSentence.content=tagSentence.content.replaceAll(" *","").trim()
		commentBlock.push(tagSentence);
	});
	return commentBlock;
};

const JSONToFile = (obj, filename) => fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));
// #endregion

// const inputFilePath = "./sampleData/test.js"
const inputFilePath = "./input/contextSetup.ts";
const outputFilePath = "./output/jsCommentExtractedOutput";

// #region run
/** STEP 1 : Get file content */
const file = fs.readFileSync(inputFilePath, { encoding: "utf-8" });

/** STEP 2 : Retrieve only js doc style comment between in blocks */
const jsCommentsBlocks = getJsCom(file);

/** STEP 3 : Remove start and end indicator of blocks */
let jsCommentsBlocksClean = [];
jsCommentsBlocks.forEach((element, index) => {
	jsCommentsBlocksClean[index] = removeJsComStartEnd(element);
});

/** STEP 4 : For each comments block extract tag value and content */
let jsCommentsBlocksTagData = [];
jsCommentsBlocksClean.forEach((element, index) => {
	jsCommentsBlocksTagData[index] = {
		blocNumber : index+1,
		genericTagSentences : getTagDataFromBlock(element, getTagIndex(element))
	}
});

/** STEP 5 : Write result in a json file */
JSONToFile(jsCommentsBlocksTagData, outputFilePath);
// #endregion
