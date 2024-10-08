export function createCommentBlock(
	stepDefName: string,
	stepDefDesc: string,
	stepDefParam: string,
	stepDefExample: string,
	stepDefToDo: string
): string {
	const htmlBlock = `
	<div id="commentBlock">
		<div id="BlockDef">
			<h2>${stepDefName}</h2>
			<p>${stepDefDesc}</p>
		</div>
		<div id="BlockParam">
			<p>${stepDefParam}</p>
		</div>
		<div id="BlockEx">
			<p>${stepDefExample}</p>
		</div>
		<div id="BlockTODO">
			<p>${stepDefToDo}</p>
		</div>
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
