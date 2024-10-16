const fs = require("fs");
const path = require("path");
/**
 * Uncamelized a word
 * @param {string} camelWord json object to save in a file
 * @return {string} put 1st letter upperCase + replace following other uppercase by space and lowercase
 */
export function unCamelized(camelWord: string) {
	const toUnCamelized = camelWord.slice(1);
	// Replace all capital letters by separator followed by lowercase one
	var unCamelized = toUnCamelized.replace(/[A-Z]/g, function (letter) {
		return " " + letter.toLowerCase();
	});
	return camelWord[0].toUpperCase() + unCamelized;
}

/**
 * Write a json object in a file
 * @param {string} obj json object to save in a file
 * @param {string} filename
 */
export const JSONToFile = (obj, filename) => fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));

/**
 * Write a html object in a file
 * @param {string} obj html object to save in a file
 * @param {string} filename
 */
export const HtmlToFile = (obj, filename) => fs.writeFileSync(`${filename}.html`, obj);

/**
 * Recursive command that go through a folder and all its sub-folder to list all files path
 *
 * @param {string} folderPath to go through
 * @param {string[]} filesPaths this should be declared outside the call of this command to allows the recursivity
 * @example const folderPath = "input";
 * const filesPaths: string[] = [];
 * getAllFilePathFromDir(folderPath, filesPaths);
 * filesPaths.forEach((filePath) => {...}
 */
export function getAllFilePathFromDir(folderPath: string, filesPaths?: string[], fileExtenstion?: string) {
	fs.readdirSync(folderPath).forEach((element) => {
		if (fs.statSync(path.join(folderPath, element)).isDirectory()) {
			getAllFilePathFromDir(path.join(folderPath, element), filesPaths, fileExtenstion);
		} else {
			if (path.extname(element) === fileExtenstion) {
				filesPaths.push(path.join(folderPath, element));
			}
		}
	});
}
