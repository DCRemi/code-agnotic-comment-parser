import { copyFilesStructToHtml, getAllFilePathFromDir, HtmlToFile } from "./ressources/command";

const fs = require("fs");
const folderPath = "./json_output/";
const filesPaths: string[] = [];
const path = require("path");

getAllFilePathFromDir(folderPath, filesPaths);
const htmlContent = "<html>Whatever</html>";

const sourcePathName = "json_output";
const destinationPath = "html_output/html_pages";
copyFilesStructToHtml(filesPaths, sourcePathName, destinationPath, htmlContent);
