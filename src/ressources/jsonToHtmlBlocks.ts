import { CommentBlock } from "./interfaces";

export function createDefBlock(commentBlock: CommentBlock): string {
	var stepDefName = commentBlock.stepDef;
	var stepDefDesc = commentBlock.descriptionTags ? commentBlock.descriptionTags[0].description : "";

	const htmlBlock = `
		<div id="BlockDef">
			<h2>${stepDefName}</h2>
			<p>${stepDefDesc}</p>
		</div>
`;

	return htmlBlock;
}

export function createParamBlock(commentBlock: CommentBlock): string {
	var stepDefParam: string = "";
	if (commentBlock.paramTags) {
		stepDefParam =
			commentBlock.paramTags[0].param_type +
			" \n" +
			commentBlock.paramTags[0].param_name +
			" \n" +
			commentBlock.paramTags[0].param_desc;
	}
	const htmlBlock = `
		<div id="BlockParam">
			<p>${stepDefParam}</p>
		</div>
`;
	return htmlBlock;
}

export function createExampleBlock(commentBlock: CommentBlock): string {
	var stepDefExample: string = "";
	if (commentBlock.exampleTags) {
		stepDefExample = commentBlock.exampleTags[0].example_content;
	}

	const htmlBlock = `
		<div id="BlockParam">
			<p>${stepDefExample}</p>
		</div>
`;
	return htmlBlock;
}

export function createToDoBlock(commentBlock: CommentBlock): string {
	var stepDefToDo: string = "";
	if (commentBlock.todoTags) {
		stepDefToDo =
			commentBlock.todoTags[0].todo_type.toUpperCase() + "   text   : " + commentBlock.todoTags[0].todo_text;
	}

	const htmlBlock = `
		<div id="BlockParam">
			<p>${stepDefToDo}</p>
		</div>
`;
	return htmlBlock;
}

export function createStepDefBlock(
	defBlock: string,
	paramBlock: string,
	exampleBlock: string,
	todoBlock: string
): string {
	const htmlBlock = `
	<div id="commentBlock">
		${defBlock ? defBlock : ""}
		<br/>
		${paramBlock ? paramBlock : ""}
		${exampleBlock ? exampleBlock : ""}
		${todoBlock ? todoBlock : ""}
	</div>
`;
	return htmlBlock;
}

export function createHtmlFile(body: string): string {
	const htmlBlock = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
		<title>Home, Block</title>
	</head>
	<body>
		${body}	
	</body>
</html>
`;
	return htmlBlock;
}
