import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

import { patientIds } from "../../../fixtures/patient";
import { listStore } from "../../../support/helperFunctions/shareData";

/**
 * @namespace 3_navigation
 * @description These steps are used to navigate to a specific page or verify that the HCP is properly redirected
 */

// #region Actions

/**
 * @namespace 3_navigation.action
 * @description These steps are used to navigate to a specific page or verify that the HCP is properly redirected
 */

/**
 * @Method (CODE + SIMPLE) -- the HCP navigates to the {pageName} page
 * @memberof 3_navigation.action
 * @description Step to open a specific page directly without having to do that through interface
 * @param {string} pageName - Name of the page to navigate with criteria (like empty visit ...)
 * @todo DOC >> add option in param
 * @todo CODE >> storage system and add a specific step for that (saveNumberOfElement could be added in the argument of this step def see https://alirahealth-engineering.atlassian.net/browse/NEXTG-6229)
 * @todo SIMPLE >> the number of options (merge cases (ex : empty list and list))
 */
Given("the HCP navigates to the {string} page", (pageName) => {
	let pageData = {
		url: "",
		dataCy: "",
		request: "",
		saveNumberOfElement: ""
	};

	switch (pageName) {
		case "login":
			pageData = {
				url: "/",
				dataCy: "loginConnectButton",
				saveNumberOfElement: false
			};
			break;
		case "english project login page":
			Cypress.config("baseUrl", Cypress.env("captureBaseUrl"));
			pageData = {
				url: "/",
				dataCy: "loginConnectButton",
				saveNumberOfElement: false
			};
			break;
		case "french project login page":
			Cypress.config("baseUrl", Cypress.env("wfTestBaseUrl"));
			pageData = {
				url: "/",
				dataCy: "loginConnectButton",
				saveNumberOfElement: false
			};
			break;
		case "patients list":
			cy.intercept(
				"GET",
				"/api/users/?order_by=created&order=desc&limit=20&offset=0&role=PATIENT&project_id=[0-9]&sites=[0-9]"
			).as("completePatientList");
			pageData = {
				url: "/hcp/patients",
				dataCy: "patientListTableRow",
				request: "@completePatientList",
				saveNumberOfElement: true
			};
			/**
			 * @todo get the list of user (full list) => put it to patientListStore
			 * So it can be used on other step def
			 *
			 */
			break;
		case "empty visit list":
			cy.intercept(
				"GET",
				"/api/visits/?site=[0-9]&page=1&page_size=20&order=desc&order_by=scheduled_at&status=TODO&status=DONE&status=ONGOING&status=MISSED&status=INCOMPLETE"
			).as("completeVisitList");
			pageData = {
				url: "/hcp/visits",
				dataCy: "visitsListSearchBar",
				request: "@completeVisitList",
				saveNumberOfElement: false
			};
			break;
		case "visit list":
			cy.intercept(
				"GET",
				"/api/visits/?site=[0-9]&page=1&page_size=20&order=desc&order_by=scheduled_at&status=TODO&status=DONE&status=ONGOING&status=MISSED&status=INCOMPLETE"
			).as("completeVisitList");
			pageData = {
				url: "/hcp/visits",
				dataCy: "visitListTableRow",
				request: "@completeVisitList",
				saveNumberOfElement: true
			};

			break;
		case "patient with visits details":
			cy.intercept("GET", /\/api\/users\/\d+/).as("patientProfile");
			pageData = {
				url: "/hcp/patients/67",
				dataCy: "patientDetailsInfoBox",
				request: "@patientProfile",
				saveNumberOfElement: false
			};
			break;
		case "patient with questionnaires details":
			cy.intercept("GET", /\/api\/users\/\d+/).as("patientProfile");
			pageData = {
				url: "/hcp/patients/43",
				dataCy: "patientDetailsInfoBox",
				request: "@patientProfile",
				saveNumberOfElement: false
			};
			break;
		case "patient details":
			cy.intercept("GET", /\/api\/users\/\d+/).as("patientProfile");
			pageData = {
				url: "/hcp/patients/65",
				dataCy: "patientDetailsInfoBox",
				request: "@patientProfile",
				saveNumberOfElement: false
			};
			break;
		case "random patient details":
			cy.intercept("GET", /\/api\/users\/\d+/).as("patientProfile");
			pageData = {
				url: `/hcp/patients/${patientIds[Math.floor(Math.random() * patientIds.length)]}`,
				dataCy: "patientDetailsInfoBox",
				request: "@patientProfile",
				saveNumberOfElement: false
			};
			break;
		case "questionnaire details":
			cy.intercept("GET", /\/api\/containers\/activities\/\d+/).as("containerActivities");
			pageData = {
				url: "/hcp/patients/71/questionnaire/150?containerId=6",
				dataCy: "questionnaireDetailsViewTitle",
				request: "@containerActivities",
				saveNumberOfElement: false
			};
			break;
		case "patient without visits details":
			cy.intercept("GET", /\/api\/users\/\d+/).as("patientProfile");
			pageData = {
				url: "/hcp/patients/64",
				dataCy: "patientDetailsInfoBox",
				request: "@patientProfile",
				saveNumberOfElement: false
			};
			break;
		case "patient with visits details with only internal notes":
			cy.intercept("GET", /\/api\/users\/\d+/).as("patientProfile");
			pageData = {
				url: "/hcp/patients/66",
				dataCy: "patientDetailsInfoBox",
				request: "@patientProfile",
				saveNumberOfElement: false
			};
			break;
		case "patient with visits details without notes":
			cy.intercept("GET", /\/api\/users\/\d+/).as("patientProfile");
			pageData = {
				url: "/hcp/patients/71",
				dataCy: "patientDetailsInfoBox",
				request: "@patientProfile",
				saveNumberOfElement: false
			};
			break;
		default:
			throw new Error(`The validation for the ${pageName} page has not been implemented.`);
	}

	cy.visit(pageData.url);

	if (pageData.saveNumberOfElement) {
		// for patient list and visit list we save the number of total element return by the request to be able to compare it
		cy.waitPages({
			url: pageData.url,
			dataCy: pageData.dataCy
		});
		cy.wait(pageData.request).then((interception) => {
			const numberOfElement = interception.response.body.count;
			listStore.numberOfElement = numberOfElement;
		});
	} else {
		cy.waitPages({
			url: pageData.url,
			dataCy: pageData.dataCy,
			request: pageData.request
		});
	}
});
// #endregion

// #region Assertion
/**
 * @namespace 3_navigation.assertion
 * @description These steps are used to navigate to a specific page or verify that the HCP is properly redirected
 */
/**
 * @Method (SIMPLE) -- the HCP is sent to the {pageName} page
 * @memberof 3_navigation.assertion
 * @description Assert that the HCP is properly redirected to the right page
 * @param {string} pageName - Name of the page to navigate with criteria (like empty visit ...)
 * @todo DOC >> add option in param
 * @todo SIMPLE >> the number of options (merge cases)
 */
Then("the HCP is sent to the {string} page", (pageName) => {
	let pageUrl;
	switch (pageName) {
		case "Verification code":
			pageUrl = "/2f-auth";
			break;
		case "HCP Dashboard":
			pageUrl = "/hcp/dashboard";
			break;
		case "patients list":
			pageUrl = "/hcp/patients";
			break;
		case "patient details":
			pageUrl = "/hcp/patients/[0-9]+";
			break;
		case "patient edit details":
			pageUrl = "/hcp/patients/[0-9]+?view=editPatient";
			break;
		case "login":
			pageUrl = "/login";
			break;
		case "visits list":
			pageUrl = "/hcp/visits";
			break;
		case "password create":
			pageUrl = "/create-password?token=";
			break;
		case "terms of use":
			pageUrl = "/term-of-use";
			break;
		case "set up 2FA":
			pageUrl = "/2f-auth";
			break;
		case "reset password":
			pageUrl = "/reset-password?token=";
			break;
		default:
			throw new Error(`The validation for the ${pageName} page has not been implemented.`);
	}
	cy.url().should("match", new RegExp(`${Cypress.config().baseUrl}${pageUrl.replace(/\?/g, "\\?")}`));
});

/**
 * @Method (SIMPLE) -- the HCP is sent to the {activity} activity page
 * @memberof 3_navigation.assertion
 * @description Test that the user is properly redirected to the right activity page
 * @param {string} activity - Define the name of the activity and link it to patientID and activity ID
 * @todo DOC >> add option in param
 * @todo SIMPLE >> simplify this step (to linked to hard coded IDs ...)
 * @todo CODE >> to have a fixture with the patient and their particularity for activity
 *  */
Then("the HCP is sent to the {string} activity page", (activity) => {
	let patientId;
	let questionnaireId;
	let containerId;
	switch (activity) {
		case "Container test score simple":
			patientId = 43;
			questionnaireId = 8;
			containerId = 6;
			break;
		default:
			throw new Error(`The validation for the activity ${activity} details page has not been implemented.`);
	}
	cy.url().should("include", `hcp/patients/${patientId}/questionnaire/${questionnaireId}?containerId=${containerId}`);
});
// #endregion
