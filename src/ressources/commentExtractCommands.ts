import {
	CommentBlock,
	DescriptionTag,
	ExampleTag,
	GenericCommentBlock,
	GenericTag,
	GenericTagSentence,
	ParamTag,
	SeeTag,
	TagIndex,
	TodoTag
} from "./interfaces";
/* -------------------------------------------------------------------------- */
/*                               Extract JS data                              */
/* -------------------------------------------------------------------------- */

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
 * Extract from a jsCommentBlock each tag marked with @ and with their index and the index name
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
 * Extract from a jsCommentBlock, using the corresponding TagsIndex, all tag and their content
 * @param {string} jsCommentBlock text from which tags are to extract
 * @param {TagIndex[]} jsBlockTagsIndex array of tags to extract
 * @returns array of GenericTagSentence that contains the tag and its content
 */
export const extractGenericTagBlock = function (
	jsCommentBlock: string,
	jsBlockTagsIndex: TagIndex[]
): GenericTagSentence[] {
	const genericTagSentences: GenericTagSentence[] = [];
	jsBlockTagsIndex.forEach((tagIndex, index) => {
		let genericTagSentence: GenericTagSentence;
		genericTagSentence = {
			tag: tagIndex.tag.trim(),
			tag_content:
				index !== jsBlockTagsIndex.length - 1 // exception for the last tag that has not a next tag to set the end
					? jsCommentBlock.substring(jsBlockTagsIndex[index].tagEnd, jsBlockTagsIndex[index + 1].tagStart).trim()
					: jsCommentBlock.substring(jsBlockTagsIndex[index].tagEnd).trim()
		};
		// Remove wildcards from the contents, then remove space and line break at the end
		genericTagSentence.tag_content = genericTagSentence.tag_content.replace(/\*/gi, "").trim();
		genericTagSentence.tag_content = genericTagSentence.tag_content.replace(/\n\s+/gi, "\n").trim();
		genericTagSentences.push(genericTagSentence);
	});
	return genericTagSentences;
};

/* ---------------------------- Extract Tags data --------------------------- */

/**
 * @description Treat block tag depending on the type, iterate on all tag of the blocks to extract all data
 * @param {GenericGlobalComment} genericCommentBlock comment block that contains the file tag
 * @returns CommentBlock extracted data
 */
export const extractBlockTagData = function (genericCommentBlock: GenericCommentBlock): CommentBlock {
	const tagTypeRegex = /\{(.*)\}/;

	// const commentBlock: CommentBlock = { blocNumber: genericCommentBlock.blocNumber, stepType: "Missing" };
	const commentBlock: CommentBlock = {};

	genericCommentBlock.genericTagSentences.forEach((genericTagSentence) => {
		switch (genericTagSentence.tag) {
			case "@level1":
				commentBlock.level1 = genericTagSentence.tag_content.trim();
				break;
			case "@level2":
				commentBlock.level2 = genericTagSentence.tag_content.trim();
				break;
			case "@level3":
				commentBlock.level3 = genericTagSentence.tag_content.trim();
				break;
			case "@stepDef":
				commentBlock.stepDef = genericTagSentence.tag_content.trim();
				break;
			case "@param":
				let paramTag: ParamTag;
				const paraValuesRegex = /-Values-/;
				var paramType, paramName, paramDesc;
				/* --------------------- param tag correctly configured --------------------- */
				if (genericTagSentence.tag_content.match(tagTypeRegex)) {
					// extract the parameter type contained inside {}
					paramType = genericTagSentence.tag_content.match(tagTypeRegex)[0];
					// remove the parameter type from tag content
					const paramName_desc_values = genericTagSentence.tag_content.substring(paramType.length).trim();

					// extract the parameter name that is the 1st word after the type
					paramName = paramName_desc_values.match(/\w+/)[0];
					// remove the parameter type from tag content
					const paramDesc_values = paramName_desc_values.substring(paramName.length).trim();

					// extract the parameter description and values separated by -Values-
					paramDesc = paramDesc_values.split(paraValuesRegex)[0];
					const paramValues_list = paramDesc_values.split(paraValuesRegex)[1];
					const paramValues = paramValues_list?.split(/\//);
					paramTag = {
						paramName,
						paramType,
						paramDesc,
						paramValues
					};
				} else {
					/* --------------------- param tag NOT correctly configured --------------------- */
					const error = "**Param tag config is missing (see documentation)**";
					console.error(`error : ${error}`);
					paramTag = {
						paramName: error,
						paramType: "Undefined",
						paramDesc: "Undefined"
					};
				}

				// if the paramTags array doesn't exist, can't use push but need to initialize it
				commentBlock.paramTags ? commentBlock.paramTags.push(paramTag) : (commentBlock.paramTags = [paramTag]);
				break;
			case "@todo":
				let todoTag: TodoTag;
				// if the tag contains a type inside {type}
				if (genericTagSentence.tag_content.match(tagTypeRegex)) {
					const todoType = genericTagSentence.tag_content.match(tagTypeRegex);
					todoTag = {
						todoType: todoType[1],
						todoText: genericTagSentence.tag_content.substring(todoType[0].length).trim()
					};
				}
				// if the tag doesn't contain a type it will put none
				else {
					todoTag = {
						todoType: "none",
						todoText: genericTagSentence.tag_content
					};
					console.error("error : the todo tag config is missing missing {todoType} description (see documentation)");
				}
				// if the todoTags array doesn't exist, can't use push but need to initialize it
				commentBlock.todoTags ? commentBlock.todoTags.push(todoTag) : (commentBlock.todoTags = [todoTag]);
				break;
			case "@description":
				const descriptionTag: DescriptionTag = {
					description: genericTagSentence.tag_content
				};
				// if the descriptionTags array doesn't exist, can't use push but need to initialize it
				commentBlock.descriptionTags
					? commentBlock.descriptionTags.push(descriptionTag)
					: (commentBlock.descriptionTags = [descriptionTag]);
				break;
			case "@see":
				const seeTag: SeeTag = {
					see_content: genericTagSentence.tag_content
				};
				// if the seeTags array doesn't exist, can't use push but need to initialize it
				commentBlock.seeTags ? commentBlock.seeTags.push(seeTag) : (commentBlock.seeTags = [seeTag]);
				break;
			case "@example":
				const exampleTag: ExampleTag = {
					example_content: genericTagSentence.tag_content
				};
				// if the exampleTag array doesn't exist, can't use push but need to initialize it
				commentBlock.exampleTags
					? commentBlock.exampleTags.push(exampleTag)
					: (commentBlock.exampleTags = [exampleTag]);
				break;
			default:
				const genericTag: GenericTag = {
					tag: genericTagSentence.tag,
					content: genericTagSentence.tag_content
				};
				// if the descriptionTags array doesn't exist, can't use push but need to initialize it
				commentBlock.genericTags
					? commentBlock.genericTags.push(genericTag)
					: (commentBlock.genericTags = [genericTag]);
				break;
		}
	});
	return commentBlock;
};
