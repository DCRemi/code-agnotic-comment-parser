import { CommentBlock, FileCommentExtract, InteractionType } from "./interfaces";

export function createHtmlFileDesc(fileData: FileCommentExtract): string {
	var fileName = fileData.fileName;
	var fileDesc = fileData.fileDesc.replace(/.\n/g, "<br />");
	const htmlBlock = `
		<div class="pagetitle">
			<h1>${fileName}</h1>
			<p>${fileDesc}</p>
		</div>
`;
	return htmlBlock;
}

export function createHtmlInteractionType(interactionTypes: InteractionType[]): string {
	if (interactionTypes.length > 0) {
		var htmlBlocks: string = `
		<div class="pagetitle" id="interActionTypes">
			<h2>Interaction types </h2>
		</div>
	`;
		interactionTypes.forEach((interactionType) => {
			var interactionTypeName = interactionType.interactionTypeName;
			var interactionTypeDesc = interactionType.interactionTypeDesc.replace(/.\n/g, "<br />");
			const htmlBlock = `
		<div class="pagetitle" id="BlockDef">
			<h3>${interactionTypeName}</h3>
			<p>${interactionTypeDesc}</p>
		</div>
	`;
			htmlBlocks += htmlBlock;
			// htmlBlocks.push(htmlBlock);
		});

		return htmlBlocks;
	} else {
		return "";
	}
}

export function createDefHtmlBlock(commentBlock: CommentBlock): string {
	var stepDefName = commentBlock.stepDef;
	var stepDefDesc = commentBlock.descriptionTags ? commentBlock.descriptionTags[0].description : "";
	stepDefDesc = stepDefDesc.replace(/.\n/g, "<br />");
	var stepDefMemberOf = commentBlock.memberof;
	var htmlBlock: string;
	if (stepDefMemberOf) {
		htmlBlock = `
			<div class="stepDefinition" id="BlockDef">
				<h3>${stepDefName}</h3>
				<p>${stepDefDesc}</p>
				<p><h4>Member of : </h4>${stepDefMemberOf}</p>
			</div>
`;
	} else {
		htmlBlock = `
			<div class="stepDefinition" id="BlockDef">
				<h3>${stepDefName}</h3>
				<p>${stepDefDesc}</p>
			</div>
		`;
	}
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
							<td>${paramTag.param_desc.replace(/.\n/g, "<br />")}</td>
						</tr>
			`;
		});

		const htmlBlock: string = `
			<div class="stepDefinition" id="BlockParam">
				<h4>Parameters : </h4>
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
			</div>
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
			<div class="stepDefinition" id="BlockExample">
				<h4>Example :</h4>
				<div class="card">
					<div class="card-body">
						<code class="hljs">
							${stepDefExample.replace(/.\n/g, "<br />")}
						</code>
					</div>
				</div>
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
							<td>${todoTag.todo_text.replace(/.\n/g, "<br />")}</td>
						</tr>
			`;
		});

		const htmlBlock: string = `
			<div class="stepDefinition" id="BlockToDo">
				<h4>To Do : </h4>				
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
			</div>
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
			${paramBlock ? paramBlock : ""}
			${exampleBlock ? exampleBlock : ""}
			${todoBlock ? todoBlock : ""}
		</div>
`;
	return htmlBlock;
}

export function createHtmlFile(mainHtml: string): string {
	const htmlBlock = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
		<title>Home, Block</title>
		<link type="text/css" rel="stylesheet" href="styles/style.css" />
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
			integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
			crossorigin="anonymous"
		/>
		<!-- Script -->
		<script
			src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
			integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
			crossorigin="anonymous"
		></script>
		<script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>
		<script type="module" src="https://cdn.jsdelivr.net/npm/zero-md@3?register"></script>
	</head>
	<body>
		<header id="header" class="header fixed-top d-flex align-items-center">
			<div class="d-flex align-items-center justify-content-between">
				<div class="logo d-flex align-items-center">
					<a href="index.html" class="logo d-flex align-items-center">
						<img
							src="https://cdn0.iconfinder.com/data/icons/juice/512/juice_cucumber_vegetables_drink-512.png"
							alt=""
						/>
					</a>
				</div>
				<div class="logo d-flex align-items-center">
					<h1 class="d-flex align-items-center">Doc-Parser</h1>
				</div>
			</div>
		</header>
		<aside id="sidebar" class="sidebar">
			<ul id="sidebar-nav" class="sidebar-nav">
				<li class="nav-item">
					<a href="contextSetupOutput.html" class="nav-link"> Context Setup </a>
				</li>
				<li class="nav-item">
					<a href="navigationOutput.html" class="nav-link collapsed"> Navigation </a>
				</li>
				<li class="nav-item">
					<a href="listCommonOutput.html" class="nav-link collapsed"> List common </a>
				</li>
				<li class="nav-item"><a href="storageOutput.html" class="nav-link collapsed"> Storage </a></li>
				<li class="nav-item"><a href="genericOutput.html" class="nav-link collapsed"> Generic </a></li>
			</ul>
		</aside>
		<main id="main" class="main">
				${mainHtml}	
			</main>
	</body>
</html>
`;
	return htmlBlock;
}
