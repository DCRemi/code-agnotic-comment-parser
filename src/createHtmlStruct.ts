import { copyFilesStructToHtml, getAllFilePathFromDir, HtmlToFile } from "./ressources/command";

const fs = require("fs");
const folderPath = "./html_output/input/json/";
const filesPaths: string[] = [];
const path = require("path");

getAllFilePathFromDir(folderPath, filesPaths);
const htmlContent = "<html>Whatever</html>";

const sourcePath = "html_output/input/json";
const destinationPath = "html_output/html_pages";
copyFilesStructToHtml(filesPaths, sourcePath, destinationPath, htmlContent);

/**
 * 		"predocToHtml:createHtmlStruct": "cp -r ./output/* ./html_output/input/json",
 */
