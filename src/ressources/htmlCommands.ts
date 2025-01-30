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
export function createLevel_0_IndexHtml(Level1IndexLinks: string): string {
	var level0IndexHtml = fs.readFileSync("src/ressources/htmlFile.html", "utf-8");
	const mainHtml = `
			<div class="pagetitle">
				<h1>READ ME</h1>
				<br />
				<br />
				<zero-md src="README.md"></zero-md>
			</div>`;
	const sidebar = `
			<ul id="sidebar-nav" class="sidebar-nav">
				${Level1IndexLinks}
				<li class="nav-item">
					<a href="noLevel1.html" class="nav-link"> No Level </a>
				</li>
			</ul>`;
	level0IndexHtml = level0IndexHtml.replace("${sideBar}", sidebar);
	level0IndexHtml = level0IndexHtml.replace("${mainHtml}", mainHtml);
	return level0IndexHtml;
}

/**
 * Create noLevel0 file with link to level 1 index files
 * @param {string} Level1IndexLinks
 * @returns {string} NoLevel 0 file content
 */
export function createLevel_0_NoLevelHtml(Level1IndexLinks: string): string {
	var level0NoLevelHtml = fs.readFileSync("src/ressources/htmlFile.html", "utf-8");
	const sidebar = `
			<ul id="sidebar-nav" class="sidebar-nav">
				${Level1IndexLinks}
				<li class="nav-item">
					<a href="noLevel1.html" class="nav-link"> No Level </a>
				</li>
			</ul>`;
	level0NoLevelHtml = level0NoLevelHtml.replace("${sideBar}", sidebar);
	return level0NoLevelHtml;
}

/**
 * Create level1 index file with link to level 2 html files
 * @param {level_1} level_1
 * @param {string[]} level1FolderPath
 * @returns {string} Level 1 index file content
 */
export function createLevel_1_BaseHtml(level_1: Level_1): string {
	var level1IndexHtml = fs.readFileSync("src/ressources/htmlFile.html", "utf-8");

	var level2FilePathsLinks = "";
	level_1.level_2s.forEach((level_2) => {
		level2FilePathsLinks += `
				<li class="nav-item">
					<a href=${level_2.levelName}.html class="nav-link">
						${unCamelized(level_2.levelName)}	
					</a>
				</li>`;
	});
	const sidebar = `
			<ul id="sidebar-nav" class="sidebar-nav">
				<li class="nav-item">
					<a href="index.html" class="nav-link"> HOME </a>
				</li>
			</ul>
			<ul id="sidebar-nav" class="sidebar-nav">
				${level2FilePathsLinks}
			</ul>`;

	const mainHtml = `
			<div>
				<h1 class="pagetitle">${level_1.levelName}</h1>
				<p>${level_1.levelDesc}</p>
				<div>\${mainHtml}</div>
			</div>`;

	level1IndexHtml = level1IndexHtml.replace("${sideBar}", sidebar);
	level1IndexHtml = level1IndexHtml.replace("${mainHtml}", mainHtml);

	return level1IndexHtml;
}

/* -------------------------------------------------------------------------- */
/*                            Html blocks creation                           */
/* -------------------------------------------------------------------------- */
/**
 * Construct the html block for the step definition adding the expand/collapse button with the block index
 * @param index will be use inside the accordion item so the button collapse the right box
 */
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
						<h5>${stepDefName}</h5>
					</button>`;
	return htmlBlock;
}

/**
 * Create the description html block
 * Manage if multiple description blocks
 */
export function createDescHtmlBlock(commentBlock: CommentBlock): string {
	var htmlDescBlock = "";
	if (commentBlock.descriptionTags) {
		var stepDefDescBloc = "";
		commentBlock.descriptionTags.forEach((descriptionTag) => {
			stepDefDescBloc += `
								<p>${descriptionTag.description.replace(/.\n/g, "<br />")}</p>
								`;
		});
		htmlDescBlock = `
							<div class="stepDefinition" id="BlockDef">
								${stepDefDescBloc}
							</div>`;
	}
	return htmlDescBlock;
}

/**
 * Create the param html block
 * Manage if multiple param blocks
 * add into the table the parameter of this tag
 */
export function createParamHtmlBlock(commentBlock: CommentBlock): string {
	var htmlParamBlock: string = "";

	if (commentBlock.paramTags) {
		var htmlParamTableLine = "";
		commentBlock.paramTags.forEach((paramTag) => {
			var paramValuesList = "";
			if (paramTag.paramValues) {
				paramTag.paramValues.forEach((paramValue) => {
					paramValuesList += `
												<li>
													${paramValue}
												</li>`;
				});
			}
			htmlParamTableLine += `
									<tr>
										<th>${paramTag.paramName}</th>
										<td>${paramTag.paramType}</td>
										<td>${paramTag.paramDesc.replace(/.\n/g, "<br />")}</td>
										<td>
											<ul>
												${paramValuesList}
											</ul>
										</td>
									</tr>`;
		});

		htmlParamBlock = `
						<div class="stepDefinition" id="BlockParam">
							<h4>Parameters : </h4>
							<table class="table">
								<thead>
									<tr>
									<th scope="col">Name</th>
									<th scope="col">Type</th>
									<th scope="col">Description</th>
									<th scope="col">Values</th>
									</tr>
								</thead>
								<tbody>
									${htmlParamTableLine}
								</tbody>
							</table>
						</div>`;
	}
	return htmlParamBlock;
}

/**
 * Create the example html block
 * Manage if multiple example blocks
 */
export function createExampleHtmlBlock(commentBlock: CommentBlock): string {
	var htmlExampleBlock: string = "";
	if (commentBlock.exampleTags) {
		var exampleBlocks = "";
		commentBlock.exampleTags.forEach((exampleTag) => {
			exampleBlocks += `
									<pre><code data-prismjs-copy="Copy" class="language-js">${exampleTag.example_content}</code></pre>`;
		});

		htmlExampleBlock = `
						<div class="stepDefinition" id="BlockExample">
							<h4>Example :</h4>
							<div class="card">
								<div class="card-body">
									${exampleBlocks}
								</div>
							</div>
						</div>`;
	}
	return htmlExampleBlock;
}

/**
 * Create the to do html block
 * Manage if multiple to do blocks
 * add into the table the parameter of this tag
 */
export function createToDoHtmlBlock(commentBlock: CommentBlock): string {
	var htmlToDoBlock: string = "";
	if (commentBlock.todoTags) {
		var htmlTodoBlock: string = "";
		commentBlock.todoTags.forEach((todoTag) => {
			htmlTodoBlock += `
									<tr>
										<th>${todoTag.todoType.toUpperCase()}</th>
										<td>${todoTag.todoText.replace(/.\n/g, "<br />")}</td>
									</tr>`;
		});
		htmlToDoBlock = `
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
	}
	return htmlToDoBlock;
}

export function createStepDefHtmlBlock(
	TitleBlock: string,
	defBlock: string,
	paramBlock: string,
	exampleBlock: string,
	todoBlock: string,
	index: number
): string {
	// index is needed because accordion needs to have an unique ID of what to expand / collapse
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
	var level2HtmlFile = fs.readFileSync("src/ressources/htmlFile.html", "utf-8");
	const sidebar = `
			<ul id="sidebar-nav" class="sidebar-nav">
				<li class="nav-item">
					<a href="index.html" class="nav-link"> HOME </a>
				</li>
			</ul>
			<ul id="sidebar-nav" class="sidebar-nav">
				${level_2.htmlNavBar}
			</ul>`;
	level2HtmlFile = level2HtmlFile.replace("${sideBar}", sidebar);
	level2HtmlFile = level2HtmlFile.replace("${mainHtml}", mainHtml);
	return level2HtmlFile;
}
