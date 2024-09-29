import { Given } from "@badeball/cypress-cucumber-preprocessor";

import { hcpNoPatient, hcpPatient, hcpValid, hcpWF } from "../../../fixtures/user";
import { hcpDataStore } from "../../../support/helperFunctions/shareData";

/**
 * @folderName 0_contextSetup
 * @description These steps are used to setup the context of tests config and user login
 */

// #region BO Config

/**
 * @steDef a project with {config} is configured
 * @memberof 0_contextSetup
 * @description For now it is used to reflect the config needed (only manual purpose)
 * @param {string} config - Not implemented (manual purpose)
 * @todo {question} See to use it with fixture import or to remove ?
 */
Given("a project with {string} is configured", () => {
	// cy.backEndCall_resetDb();
	// cy.backEndCall_importFile("1.WF-test/0.wf-test.json");
});
// #endregion

// #region HCP Login

/**
 * @steDef (API + SIMPLE) -- the HCP is logged in the {projectName} project with {account}
 * @memberof 0_contextSetup
 * @description Use to log the HCP in a particular project with a particular account
 * @param {string} projectName - Allows to set up the project URL by project's name
 *  --- Values : qacapture / wftest
 * @param {string} account - Reference to an HCP account (with/ without patient ...Etc) HCP account are defined in cypress/fixtures/user.ts
 * @todo {DOC} >> add list of values possible like "param values" ? link to user.ts ?
 * @todo {SIMPLE} >> reduce the number of hcp possible / simplify
 *  HCP without data (neither patient nor visit)
 * @todo {API} >> make login with API
 */

Given("the HCP is logged in the {string} project with {string}", (projectName, account) => {
	let baseUrl;
	switch (projectName) {
		case "wftest":
			baseUrl = "wfTestBaseUrl";
			break;
		case "qacapture":
			baseUrl = "captureBaseUrl";
			break;
		default:
			throw new Error(`The configuration for the project ${projectName} has not been implemented.`);
	}
	Cypress.config("baseUrl", Cypress.env(baseUrl));

	switch (account) {
		case "a valid HCP account":
			cy.loginTestAccount(hcpValid.email, hcpValid.password);
			break;
		case "an HCP account with patients":
			cy.loginTestAccount(hcpPatient.email, hcpPatient.password);
			break;
		case "an HCP account without patients":
			cy.loginTestAccount(hcpNoPatient.email, hcpNoPatient.password);
			break;
		case "an HCP account with visits":
			cy.loginTestAccount(hcpPatient.email, hcpPatient.password);
			break;
		case "an HCP account without visits":
			cy.loginTestAccount(hcpNoPatient.email, hcpNoPatient.password);
			break;
		case "an account to test WF":
			cy.loginTestAccount(hcpWF.email, hcpWF.password);
			break;
		case "the recently activated account":
			cy.loginPendingTermsAndConditions(hcpDataStore.email, hcpDataStore.password);
			break;
		case "the recently activated account with accepted terms of use":
			cy.loginPending2FASetUp(hcpDataStore.email, hcpDataStore.password);
			break;
		case "the stored account":
			cy.loginByEmailCode(hcpDataStore.email, hcpDataStore.password);
			break;
		default:
			throw new Error(`The login for ${account} has not been implemented.`);
	}
});
// #endregion
