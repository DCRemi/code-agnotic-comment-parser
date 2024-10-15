export function unCamelized(camelWord: string) {
	const toUnCamelized = camelWord.slice(1);
	// Replace all capital letters by separator followed by lowercase one
	var unCamelized = toUnCamelized.replace(/[A-Z]/g, function (letter) {
		return " " + letter.toLowerCase();
	});
	return camelWord[0].toUpperCase() + unCamelized;
}
