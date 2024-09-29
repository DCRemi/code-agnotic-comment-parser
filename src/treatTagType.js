const fs = require("fs");

// #region Functions
const JSONToFile = (obj, filename) => fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));
// #endregion

const fileName = "finalOutPut"
const inputFilePath = "/home/dcremi/code-bepatient/dashboards/doc-code/output/jsCommentExtractedOutput.json";
const outputFilePath = `./output/${fileName}`;

// #region run 
/** STEP 1 extract JSON*/
const data = fs.readFileSync(inputFilePath);
// parsing the JSON content
const jsonData = JSON.parse(data);

/** STEP 2 construct file */

let fileComments = {fileName,folderNames:[],commentBlocks:[]}
jsonData.forEach((genericCommentBlock,index) => {
	// console.log(`\n genericCommentBlock ${index} \n\n`)
	// console.log(genericCommentBlock)
	let commentBlock = {blocNumber:genericCommentBlock.blocNumber}

	genericCommentBlock.genericTagSentences.forEach((genericTagSentence,index) => {
		const typeRegex = /\{.*\}/;

	// 	console.log(`\n genericTagSentence ${index} \n\n`)
	// 	console.log(genericTagSentence)
		switch (genericTagSentence.tag) {
			case "@folderName":
				fileComments.folderNames.push(genericTagSentence.content.trim());
			break;
			case "@stepDef":
				commentBlock.stepDef = genericTagSentence.content.trim();
			case "@memberof":
				commentBlock.folder = genericTagSentence.content.trim();
			break;
			case "@param":
				const param_type = genericTagSentence.content.match(typeRegex)[0]
				const param_name_desc = genericTagSentence.content.substring(param_type.length).trim()
				const param_name = param_name_desc.match(/\w+/)[0]
				commentBlock.paramTags = {
					param_type,
					param_name,			
					param_desc : param_name_desc.substring(param_name.length).trim()
				}

			break;
			case "@todo":
				const todo_type = genericTagSentence.content.match(typeRegex)[0]
				commentBlock.todoTags = {
					todo_type,	
					todo_text : genericTagSentence.content.substring(todo_type.length).trim()	
				}
			break;
			case "@description":
			commentBlock.descriptionTags = {
				description : genericTagSentence.content				
				}
			default:
				break;
		}

	});
	fileComments.commentBlocks.push(commentBlock)

});

JSONToFile(fileComments, outputFilePath);

// #endregion
