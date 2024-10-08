// import { CommentBlocks, CommentBlock } from "./interfaces";

const blocBlockStepDefs = document.querySelector("#BlockStepDefs");

const filePath = "./contextSetupOutput.json";

// const file = fs.readFileSync(filePath, { encoding: "utf-8" });

fetch(filePath)
	.then((response) => response.json())
	.then((json) => {
		json.commentBlocks.forEach((commentBlock) => {
			console.log("test remi ", commentBlock);

			const blockDescElement = document.createElement("div");
			console.log("test blockDescElement ", blockDescElement);
			// itemCard.classList.add("item-card");

			const blockName = document.createElement("h3");
			blockName.textContent = commentBlock.blockName;

			const blockDesc = document.createElement("p");
			blockDesc.textContent = "description" + commentBlock.blockDesc;

			blockDescElement.appendChild(blockName);
			blockDescElement.appendChild(blockDesc);

			blocBlockStepDefs.appendChild(blockDescElement);
		});
	});
