import nodePandoc from 'node-pandoc'
let src = './word.docx';

// Arguments can be either a single String or in an Array
let args = '-f docx -t markdown -o ./markdown.md';


document.addEventListener("DOMContentLoaded", function () {
	fetch("json_1.json", { mode: "no-cors" })
		.then((response) => response.json())
		.then((data) => {
				const dataDisplay = document.getElementById("dataDisplay");

			// Create HTML elements to display the JSON data
			const nameElement = document.createElement("p");
			nameElement.textContent = "Name: " + data.name;

			const ageElement = document.createElement("p");
			ageElement.textContent = "Age: " + data.age;

			const cityElement = document.createElement("p");
			cityElement.textContent = "City: " + data.city;

			// Append the elements to the "dataDisplay" div
			dataDisplay.appendChild(nameElement);
			dataDisplay.appendChild(ageElement);
			dataDisplay.appendChild(cityElement);
		})
		.catch((error) => console.error("Error fetching JSON data:", error));
});

