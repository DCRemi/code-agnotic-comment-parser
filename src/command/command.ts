import { GenericCommentBlock, GenericTagSentence, TagIndex } from "../../interfaces";
const fs = require("fs");

/**
 * Extract from a file the jsComment starting /** and ending with wildcard/
 * @param {string} text text to extract jsComment from
 * @returns {string[]} array with each jsComment block in a cell
 */
export const extractJsComContent = function (text: string): RegExpMatchArray | null {
	const jsComStart = "\\/\\*\\*";
	const jsComEnd = "\\*\\";
	const jsBoundaryRegex = new RegExp(`${jsComStart}(.*?)([\\s\\S])${jsComEnd}/`, "gs");
	return text.match(jsBoundaryRegex);
};

/**
 * Remove jsComment boundary char /** and wildcard/
 * @param {string} text jsComment block
 * @returns {string[]} jSComment block without boundary
 */
export const removeJsComBoundary = function (text: string): string {
	const jsComStartToRemove = "\\/\\*\\*[\\s]*";
	const jsComEndToRemove = "\\n \\*/";
	const jsCommentWithBoundaryToRemove = new RegExp(`${jsComStartToRemove}(.*)${jsComEndToRemove}`, "s");
	// regex is not global (flag g)
	// [0] is the full match containing start and end
	// [1] is the first capturing group (see https://javascript.info/regexp-methods)
	// As we want to remove /** */ we keep the [1]
	return text.match(jsCommentWithBoundaryToRemove)?.[1] || text;
};

/**
 * extract from a jsCommentBlock each tag marked with @ and with their index in the string
 * @param {string} jsCommentBlock 
 * @returns list of all tag with their index
 */
export const getTagIndex = function (jsCommentBlock: string):TagIndex[] {
	const tagRegex = / * @\w*/g;
	const tagMatches = jsCommentBlock.matchAll(tagRegex);

	const tagsIndex :TagIndex[]= [];
	for (const match of tagMatches) {
		tagsIndex.push({ tag: match[0], tagStart: match.index, tagEnd: match.index + match[0].length });
	}
	return tagsIndex;
};

/**
 * extract from a jsCommentBlock all tag and their content
 * @param {string} jsCommentBlock text from which tags are to extract
 * @param {TagIndex[]} jsBlockTagsIndex array of tags to extract
 * @returns array of GenericTagSentence that contains the tag and its content
 */
export const getTagDataFromBlock = function (jsCommentBlock:string, jsBlockTagsIndex:TagIndex[]):GenericTagSentence[] {
	const genericTagSentences:GenericTagSentence[] = [];

	jsBlockTagsIndex.forEach((element, index) => {
        
		let genericTagSentence:GenericTagSentence 
        genericTagSentence= {
			tag: element.tag.trim(),
			tag_content:
				index !== jsBlockTagsIndex.length - 1 // for the last tag the end is */ and not the next tag start
					? jsCommentBlock.substring(jsBlockTagsIndex[index].tagEnd, jsBlockTagsIndex[index + 1].tagStart).trim()
					: jsCommentBlock.substring(jsBlockTagsIndex[index].tagEnd).trim()
		};
		// Remove wildcards from the contents, then remove space and line break at the end
		genericTagSentence.tag_content = genericTagSentence.tag_content.replace(/ \*/gi, "").trim();
		genericTagSentences.push(genericTagSentence);
	});
	return genericTagSentences;
};

/**
 * Write a json object in a file 
 * @param obj json object to save in a file 
 * @param filename 
 */
export const JSONToFile = (obj, filename) => fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));
