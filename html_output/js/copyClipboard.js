// Source https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html

let blocks = document.querySelectorAll("pre:has(code)");
let copyButtonLabel = "Copy Code";

blocks.forEach((block) => {
	// only add button if browser supports Clipboard API
	if (navigator.clipboard) {
		let button = document.createElement("button");
		console.log(button);
		button.innerText = copyButtonLabel;
		block.appendChild(button);

		button.addEventListener("click", async () => {
			await copyCode(block, button);
		});
	}
});

async function copyCode(block, button) {
	let code = block.querySelector("code");
	let text = code.innerText;

	await navigator.clipboard.writeText(text);

	// visual feedback that task is completed
	button.innerText = "Code Copied";

	setTimeout(() => {
		button.innerText = copyButtonLabel;
	}, 700);
}
