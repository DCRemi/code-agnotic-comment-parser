import { CommentBlock, FileCommentExtract, InteractionType } from "./interfaces";

export function createHtmlFileDesc(fileData: FileCommentExtract): string {
	var fileName = fileData.fileName;
	var fileDesc = fileData.fileDesc;
	const htmlBlock = `
	<div id="BlockDef">
		<h1>${fileName}</h1>
		<p>${fileDesc}</p>
	</div>
`;
	return htmlBlock;
}

export function createHtmlInteractionType(interactionTypes: InteractionType[]): string {
	var htmlBlocks: string = `
		<div id="BlockDef">
			<h2>Interaction types </h2>
		</div>
	`;
	interactionTypes.forEach((interactionType) => {
		var interactionTypeName = interactionType.interactionTypeName;
		var interactionTypeDesc = interactionType.interactionTypeDesc;
		const htmlBlock = `
		<div id="BlockDef">
			<h3>${interactionTypeName}</h3>
			<p>${interactionTypeDesc}</p>
		</div>
	`;
		htmlBlocks += "<br/>" + htmlBlock;

		// htmlBlocks.push(htmlBlock);
	});

	return htmlBlocks;
}

export function createDefHtmlBlock(commentBlock: CommentBlock): string {
	var stepDefName = commentBlock.stepDef;
	var stepDefDesc = commentBlock.descriptionTags ? commentBlock.descriptionTags[0].description : "";
	var stepDefMemberOf = commentBlock.memberof;

	const htmlBlock = `
		<div id="BlockDef">
			<h3>${stepDefName}</h3>
			<p>${stepDefDesc}</p>
			<p><br/> Member of : ${stepDefMemberOf}</p>
		</div>
`;

	return htmlBlock;
}

export function createParamHtmlBlock(commentBlock: CommentBlock): string {
	if (commentBlock.paramTags) {
		var htmlParamBlock: string = "";

		commentBlock.paramTags.forEach((paramTag) => {
			htmlParamBlock += `
			<tr>
				<th>${paramTag.param_name}</th>
				<td>${paramTag.param_type}</td>
				<td>${paramTag.param_desc}</td>
			</tr>
			`;
		});

		const htmlBlock: string = `
			<table class="table">
			<thead>
				<tr>
				<th scope="col">Name</th>
				<th scope="col">Type</th>
				<th scope="col">Description</th>
				</tr>
			</thead>
				<tbody>
						${htmlParamBlock}
				</tbody>
			</table>
			`;
		return htmlBlock;
	} else {
		return "";
	}
}

export function createExampleHtmlBlock(commentBlock: CommentBlock): string {
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

export function createToDoHtmlBlock(commentBlock: CommentBlock): string {
	if (commentBlock.todoTags) {
		var htmlTodoBlock: string = "";

		commentBlock.todoTags.forEach((todoTag) => {
			htmlTodoBlock += `
			<tr>
				<th>${todoTag.todo_type.toUpperCase()}</th>
				<td>${todoTag.todo_text}</td>
			</tr>
			`;
		});

		const htmlBlock: string = `
			<table class="table">
			<thead>
				<tr>
				<th scope="col">Type</th>
				<th scope="col">Description</th>
				</tr>
			</thead>
				<tbody>
						${htmlTodoBlock}
				</tbody>
			</table>
			`;
		return htmlBlock;
	} else {
		return "";
	}
}

export function createStepDefHtmlBlock(
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
