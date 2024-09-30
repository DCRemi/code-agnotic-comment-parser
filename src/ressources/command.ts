import {
	CommentBlock,
	DescriptionTag,
	ExampleTag,
	FileCommentExtract,
	GenericCommentBlock,
	GenericGlobalComments,
	GenericTagSentence,
	ParamTag,
	SeeTag,
	TagIndex,
	TodoTag
} from "./interfaces";
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
export const getTagIndex = function (jsCommentBlock: string): TagIndex[] {
	const tagRegex = / * @\w*/g;
	const tagMatches = jsCommentBlock.matchAll(tagRegex);

	const tagsIndex: TagIndex[] = [];
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
export const getTagDataFromBlock = function (
	jsCommentBlock: string,
	jsBlockTagsIndex: TagIndex[]
): GenericTagSentence[] {
	const genericTagSentences: GenericTagSentence[] = [];

	jsBlockTagsIndex.forEach((element, index) => {
		let genericTagSentence: GenericTagSentence;
		genericTagSentence = {
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
 * construct from a Generic global comment a structured json with different tags and their parameters
 * @param {string} fileName name of the file the comments comes from
 * @param {GenericGlobalComments} genericGlobalComments array of tags extracted
 * @returns json structured with all the known tags and their parameter to be used as documentation
 */
export const extractTagSpecificData = function (
	fileName: string,
	genericGlobalComments: GenericGlobalComments
): FileCommentExtract {
	const fileComments: FileCommentExtract = { fileName, folderNames: [], commentBlocks: [] };
	genericGlobalComments.genericCommentBlocks.forEach((genericCommentBlock) => {
		let commentBlock: CommentBlock = { blocNumber: genericCommentBlock.blocNumber, folder: "" };
		genericCommentBlock.genericTagSentences.forEach((genericTagSentence) => {
			const typeRegex = /\{.*\}/;

			switch (genericTagSentence.tag) {
				case "@folderName":
					fileComments.folderNames.push(genericTagSentence.tag_content.trim());
					break;
				case "@stepDef":
					commentBlock.stepDef = genericTagSentence.tag_content.trim();
				case "@memberof":
					commentBlock.folder = genericTagSentence.tag_content.trim();
					break;
				case "@param":
					const param_type = genericTagSentence.tag_content.match(typeRegex)[0];
					const param_name_desc = genericTagSentence.tag_content.substring(param_type.length).trim();
					const param_name = param_name_desc.match(/\w+/)[0];
					const paramTag: ParamTag = {
						param_type,
						param_name,
						param_desc: param_name_desc.substring(param_name.length).trim()
					};
					commentBlock.paramTags.push(paramTag);
					break;
				case "@todo":
					const todo_type = genericTagSentence.tag_content.match(typeRegex)[0];
					const todoTag: TodoTag = {
						todo_type,
						todo_text: genericTagSentence.tag_content.substring(todo_type.length).trim()
					};
					commentBlock.todoTags.push(todoTag);
					break;
				case "@description":
					const descriptionTag: DescriptionTag = {
						description: genericTagSentence.tag_content
					};
					commentBlock.descriptionTags.push(descriptionTag);
				case "@see":
					const seeTag: SeeTag = {
						see_content: genericTagSentence.tag_content
					};
					commentBlock.seeTags.push(seeTag);
					break;
				case "@example":
					const exampleTag: ExampleTag = {
						example_content: genericTagSentence.tag_content
					};
					commentBlock.exampleTags.push(exampleTag);
					break;

				default:
					break;
			}
		});
		fileComments.commentBlocks.push(commentBlock);
	});
	return fileComments;
};

/**
 * Write a json object in a file
 * @param obj json object to save in a file
 * @param filename
 */
export const JSONToFile = (obj, filename) => fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));