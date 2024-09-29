import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

import { camelize } from "../../../support/helperFunctions/camelize";
import { listStore } from "../../../support/helperFunctions/shareData";

/**
 * @namespace 2_ListCommon
 * @description common step for list
 */

// #region Actions
/**
 * @namespace 2_ListCommon.action
 * @description Steps to play with the list navigation (number of element per page, between pages)
 * CODE >> add the command to sort and filter ?
 */

/**
 * @Method the HCP clicks on the {nextOrPrevious} arrow of the {listName} list
 * @memberof 2_ListCommon.action
 * @description Navigate through list pages with navigation arrow
 * @param {string} nextOrPrevious - Way to navigate
 * --- Values : next or previous
 * @param {string} listName - Name of the list the HCP navigates (patient or visit)
 * @example the HCP clicks on the "next" arrow of the "visits" list
 * @example the HCP clicks on the "previous" arrow of the "patient" list
 */
When("the HCP clicks on the {string} arrow of the {string} list", (nextOrPrevious, listName) => {
	let dataCy;
	if (listName.toString().includes("patient")) {
		cy.intercept("GET", /api\/users\/\?.*limit=[0-9]+&offset=[0-9]+&role=PATIENT&project_id=[0-9]+&sites=[0-9]+.*/).as(
			"ListLoaded"
		);
		dataCy = "patientsListTableGrid";
	} else if (listName.toString().includes("visit")) {
		cy.intercept("GET", /api\/visits\/\?site=[0-9]+&page=[0-9]+&page_size=[0-9]+&.*/).as("ListLoaded");
		dataCy = "visitsListTableGrid";
	}

	cy.dataCy(`${listName}ListPagination`)
		.find(`[data-testid=KeyboardArrow${nextOrPrevious === "next" ? "Right" : "Left"}Icon]`)
		.parent()
		.click();
	cy.waitPages({ dataCy, request: "@ListLoaded" });
});

/**
 * @Method the HCP selects a number of element per page {numberOfElementPerPage} on the {listName} list
 * @memberof 2_ListCommon.action
 * @description Navigate through list pages with navigation arrow
 * @param {number} numberOfElementPerPage - Number of element per page to select
 * --- Values available in lists are : 10/20/50/100
 * @param {string} listName - Name of the list the HCP the HCP is (patient or visit)
 * @example the HCP selects a number of element per page 10 on the "visits" list
 * @example the HCP selects a number of element per page 50 on the "patient" list
 */
When("the HCP selects a number of element per page {int} on the {string} list", (numberOfElementPerPage, listName) => {
	let dataCy;
	let requestRegex;
	if (listName.toString().includes("patient")) {
		requestRegex = new RegExp(
			`/api/users/?.*limit=${numberOfElementPerPage}+&offset=[0-9]+&role=PATIENT&project_id=[0-9]+&sites=[0-9]+.*`
		);
		dataCy = "patientsListTableGrid";
	} else if (listName.toString().includes("visit")) {
		requestRegex = new RegExp(`/api/visits/?.site=[0-9]+&page=[0-9]+&page_size=${numberOfElementPerPage}&.*`);
		dataCy = "visitsListTableGrid";
	}

	cy.intercept("GET", requestRegex).as("ListLoaded");
	cy.dataCy(`${listName}ListPagination`).find("input").parent().click();
	cy.get("ul[role=listbox]").contains("li", numberOfElementPerPage).click();

	cy.waitPages({ dataCy, request: "@ListLoaded" });
});

/**
 * @Method the HCP searches {text} in the {element} and wait for the list to be updated
 * @memberof 1_generic.Other
 * @description Enters a text in a field
 * @param {string} text - can be "variable" OR free text (if the text is not a known variable)
 * -- Variable : the stored patient ID
 * @param {string} element - element's name (can be patient or visit element)
 * @see README.md (see home page)
 * @todo DOC >> add option in param
 * @example the HCP searches "the stored patient ID" in the "visits list search field" and wait for the list to be updated
 * @example the HCP searches "joe@mail.com" in the "patients list search field" and wait for the list to be updated
 * @example the HCP searches "the stored patient ID" in the "visits list search field" and wait for the list to be updated
 */
When("the HCP searches {string} in the {string} and wait for the list to be updated", (text, element) => {
	let dataCyToWait;
	let searchText;

	switch (text) {
		case "the stored patient ID":
			searchText = listStore.patientListRowData.patientRowPatientId;
			break;
		default:
			searchText = text;
	}
	if (searchText) {
		const textHtml = new URLSearchParams({ search: searchText }).toString();
		if (element.toString().includes("patient")) {
			cy.intercept("GET", `/api/users/?**&${textHtml}&**`).as("requestToWait");
			dataCyToWait = "patientListTableRow";
		} else if (element.toString().includes("visit")) {
			cy.intercept("GET", `/api/visits/?**&${textHtml}&**`).as("requestToWait");
			dataCyToWait = "visitListTableRow";
		}
		cy.dataCy(camelize(element)).find("input").type(searchText);
		cy.wait("@requestToWait");
		cy.dataCy(dataCyToWait).should("be.visible");
	}
});
// #endregion

// #region Assertion
/**
 * @namespace 2_ListCommon.assertion
 * @description Steps to assert that list numbers are correct
 */

/**
 * @Method (SIMPLE) -- the {listName} displays all value
 * @memberof 2_ListCommon.assertion
 * @description Assert that the total number of element (in the pagination) correspond to the number of element stored
 * @param {string} listName - Name of the list that displays all value
 * @example the "patients list" displays all value
 * @todo CODE >> PATIENTS and VISIT See list name in README
 * @todo CODE >> put "all" as a variable > adapt with the stored number of value step def
 */
Then("the {string} displays all value", (listName) => {
	cy.waitPages({ dataCy: `${camelize(listName)}TableGrid` });

	cy.dataCy(`${camelize(listName)}Pagination`).within(() => {
		const pageNumberingRegex = /\d+ of \d+/;
		cy.contains("p", pageNumberingRegex)
			.invoke("text")
			.should((numberOfNumber) => {
				const actualNumberOfPatient = Cypress._.toInteger(numberOfNumber.split(" of ")[1]);
				const totalNumberOfPatient = listStore.numberOfElement;

				expect(totalNumberOfPatient).to.be.equal(actualNumberOfPatient);
			});
	});
});

/**
 * @Method the {listName} list displays the correct {correctData} for page {pageNumber}
 * @memberof 2_ListCommon.assertion
 * @description Assert that the element's number or pagination numbers are correct for the current pagination value for a specific page
 * @param {string} listName - Name of the list that is asserted --- Values : patient or visit
 * @param {string} correctData - Name of the data that should be asserted --- Values : number of element OR pagination values
 * @param {string} pageNumber - Page number where the HCP is ---* will impact if last page (see comment in code)
 * @example the "patient" list displays the correct "number of element" for page 3
 * the list has the correct number of line for page 3 with the current "number of element per page"
 * @example the "patient" list displays the correct "pagination" for page 3
 * the list has the pagination number for page 3 with the current "number of element per page"
 * @todo DOC >> explain more the code + better name for variable
 */
Then("the {string} list displays the correct {string} for page {int}", (listName, correctData, pageNumber) => {
	/**
	 * @todo remove this part when datacy for list are harmonized (visits vs visit)
	 */
	const listDataCy = `${listName}List`;
	const paginationDataCy = `${listName}sList`;

	const totalNumberOfElement = listStore.numberOfElement;
	const pageNumberingRegex = /\d+ of \d+/;

	cy.dataCy(`${paginationDataCy}Pagination`)
		.find("input")
		.invoke("val")
		.then((numberOfElementPerPageString) => {
			// Number of element per page set
			const numberOfElementPerPage = Cypress._.toInteger(numberOfElementPerPageString);

			// Number of element that currently in the page ...
			const numberOfElementResting =
				totalNumberOfElement - Cypress._.toInteger(numberOfElementPerPage) * (pageNumber - 1);

			if (correctData === "number of element") {
				cy.dataCy(`${listDataCy}TableRow`).should((el) => {
					expect(el.length).to.be.equal(
						numberOfElementResting > numberOfElementPerPage ? numberOfElementPerPage : numberOfElementResting
						// TRUE means that we are NOT on the last page so we display numberOfElementPerPage elements
						// FALSE means that we are on the last page so we display numberOfElementResting elements
					);
				});
			} else if (correctData === "pagination") {
				cy.contains("p", pageNumberingRegex)
					.invoke("text")
					.should((numberOfNumber) => {
						const pageStartNumber = 1 + (pageNumber - 1) * numberOfElementPerPage;
						const pageEndNumber =
							numberOfElementResting > numberOfElementPerPage
								? numberOfElementPerPage * pageNumber
								: totalNumberOfElement;
						expect(numberOfNumber).to.be.equal(`${pageStartNumber}–${pageEndNumber} of ${totalNumberOfElement}`);
					});
			}
		});
});

/**
 * @Method the {listName} list displays the correct {correctData} for a pagination of {numberOfElementPerPage}
 * @memberof 2_ListCommon.assertion
 * @description Assert that the element's number or pagination numbers are correct for the current page for a specific pagination value
 * @param {string} listName - Name of the list that is asserted --- Values : patient or visit
 * @param {string} correctData - Name of the data that should be asserted --- Values : number of element OR pagination values
 * @param {string} numberOfElementPerPage - Pagination value --- Values : 10/20/50/100
 * @example the "patient" list displays the correct "number of element" for a pagination of 10
 * the list has the correct number of line for the current page with the "number of element per page"
 * @example the "patient" list displays the correct "pagination" for a pagination of 100
 * the list has the pagination number for the current page with the "number of element per page"
 * @todo DOC >> explain more the code + better name for variable
 */
Then(
	"the {string} list displays the correct {string} for a pagination of {int}",
	(listName, correctData, numberOfElementPerPage) => {
		const totalNumberOfElement = listStore.numberOfElement;
		const pageNumberingRegex = /\d+ of \d+/;

		if (correctData === "number of element") {
			cy.dataCy(`${listName}ListTableRow`).should((el) => {
				expect(el.length).to.be.equal(
					totalNumberOfElement > numberOfElementPerPage ? numberOfElementPerPage : totalNumberOfElement
					// TRUE means that we are NOT on the last page so we display numberOfElementPerPage elements
					// FALSE means that we are on the last page so we display numberOfElementResting elements
				);
			});
		} else if (correctData === "pagination") {
			cy.contains("p", pageNumberingRegex)
				.invoke("text")
				.should((numberOfNumber) => {
					const pageEndNumber =
						totalNumberOfElement > numberOfElementPerPage ? numberOfElementPerPage : totalNumberOfElement;
					expect(numberOfNumber).to.be.equal(`1–${pageEndNumber} of ${totalNumberOfElement}`);
				});
		}
	}
);
// #endregion
