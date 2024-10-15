const fs = require("fs");
const path = require("path");

const levelDefinitionData = JSON.parse(fs.readFileSync("input/levelDefinition.json", "utf-8"));

console.log(levelDefinitionData.level1);

levelDefinitionData.level1.forEach((element) => {
	// create a folder
	// Complete index.html racine
	// For each level2 of level 1 > create a file ...
});
