import { unCamelized } from "./helpers";
import { CommentBlock, Level_1, Level_2 } from "./interfaces";
const fs = require("fs");
const path = require("path");

/* -------------------------------------------------------------------------- */
/*                      Level files and folders creation                      */
/* -------------------------------------------------------------------------- */
/**
 * Create level0 index file with link to level 1 index files
 * @param {string} Level1IndexLinks
 * @returns {string} Level 0 index file content
 */
export function createLevel_0_baseHtml(Level1IndexLinks: string): string {
	const level0IndexHtml = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
		<title>Home, Block</title>
		<link type="text/css" rel="stylesheet" href="../styles/style.css" />
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
					<a href="/html_output/pages_tree/index.html" class="logo d-flex align-items-center">
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
					${Level1IndexLinks}
					<li class="nav-item">
						<a href=nolevel.html class="nav-link">
							No Level	
						</a>
				</ul>
			</aside>
		<main id="main" class="main">
				<div>
					htmlPartToReplace
				</div>
				<div class="pagetitle">
				<h1>READ ME</h1>
				<br />
				<br />
				<zero-md src="README.md"></zero-md>
			</div>
		</main>
	</body>
</html>`;
	// 1 create level 1 folder and for each index file vide pour les lien dans le index du level 1
	return level0IndexHtml;
}

/**
 * Create level1 index file with link to level 2 html files
 * @param {level_1} level_1
 * @param {string[]} level1FolderPath
 * @returns {string} Level 1 index file content
 */
export function createLevel_1_BaseHtml(level_1: Level_1): string {
	var level2FilePathsLinks = "";
	level_1.level_2s.forEach((level_2) => {
		level2FilePathsLinks += `
				<li class="nav-item">
					<a href=${level_2.levelName}.html class="nav-link">
						${unCamelized(level_2.levelName)}	
					</a>
				</li>`;
	});
	const level1IndexHtml = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
		<title>Home, Block</title>
		<link type="text/css" rel="stylesheet" href="../../styles/style.css" />
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
					<a href="/html_output/pages_tree/index.html" class="logo d-flex align-items-center">
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
				${level2FilePathsLinks}
				<li class="nav-item">
				<a href=nolevel.html class="nav-link">
					No Level	
				</a>
				</li>
			</ul>
		</aside>
		<main id="main" class="main">
			<div>
				<h1 class="pagetitle">${level_1.levelName}</h1>
				<p>${level_1.levelDesc}</p>
			<div>
			htmlPartToReplace
			</div>
			</div>
		</main>
	</body>
</html>`;
	// 1 create level 1 folder and for each index file vide pour les lien dans le index du level 1
	return level1IndexHtml;
}

/* -------------------------------------------------------------------------- */
/*                            Html blocks creation                           */
/* -------------------------------------------------------------------------- */
export function createTitleHtmlBlock(commentBlock: CommentBlock, index: number): string {
	var stepDefName = commentBlock.stepDef;
	const htmlBlock = `
					<button
						class="accordion-button collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseHeader${index}"
						aria-expanded="false"
						aria-controls="collapseHeader${index}"
					>
						<h3 >${stepDefName}</h3>
					</button>`;
	return htmlBlock;
}

export function createDefHtmlBlock(commentBlock: CommentBlock): string {
	var stepDefDesc = commentBlock.descriptionTags ? commentBlock.descriptionTags[0].description : "";
	stepDefDesc = stepDefDesc.replace(/.\n/g, "<br />");
	var stepDefMemberOf = commentBlock.memberof;
	var htmlBlock: string;
	if (stepDefMemberOf) {
		htmlBlock = `
						<div class="stepDefinition" id="BlockDef">
							<p>${stepDefDesc}</p>
							<p><h4>Member of : </h4>${stepDefMemberOf}</p>
						</div>`;
	} else {
		htmlBlock = `
						<div class="stepDefinition" id="BlockDef">
							<p>${stepDefDesc}</p>
						</div>`;
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
									</tr>`;
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
						</div>`;
		return htmlBlock;
	} else {
		return "";
	}
}

export function createExampleHtmlBlock(commentBlock: CommentBlock): string {
	var stepDefExample: string = "";
	if (commentBlock.exampleTags) {
		stepDefExample = commentBlock.exampleTags[0].example_content;
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
						</div>`;
		return htmlBlock;
	} else {
		return "";
	}
}

export function createToDoHtmlBlock(commentBlock: CommentBlock): string {
	if (commentBlock.todoTags) {
		var htmlTodoBlock: string = "";

		commentBlock.todoTags.forEach((todoTag) => {
			htmlTodoBlock += `
									<tr>
										<th>${todoTag.todo_type.toUpperCase()}</th>
										<td>${todoTag.todo_text.replace(/.\n/g, "<br />")}</td>
									</tr>`;
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
						</div>`;
		return htmlBlock;
	} else {
		return "";
	}
}

export function createStepDefHtmlBlock(
	TitleBlock: string,
	defBlock: string,
	paramBlock: string,
	exampleBlock: string,
	todoBlock: string,
	index: number
): string {
	const htmlBlock = `
							<div class="accordion-item stepDefinition" id="commentBlock${index}">
									${TitleBlock ? TitleBlock : ""}
									<div
										id="collapseHeader${index}"
										class="accordion-body accordion-collapse collapse"
										aria-labelledby="flush-headingOne"
										data-bs-parent="#accordionFlushExample"
									>
											${defBlock ? defBlock : ""}
											${paramBlock ? paramBlock : ""}
											${exampleBlock ? exampleBlock : ""}
											${todoBlock ? todoBlock : ""}
									</div>
							</div>`;

	return htmlBlock;
}

export function createHtmlFile(mainHtml: string, level_2: Level_2): string {
	const htmlBlock = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
		<title>Home, Block</title>
		<link type="text/css" rel="stylesheet" href="../../styles/style.css" />
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
					<a href="/html_output/pages_tree/index.html" class="logo d-flex align-items-center">
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
				${level_2.htmlNavBar}
				<li class="nav-item">
					<a href=nolevel.html class="nav-link">
						No Level	
					</a>
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
