import { When } from "@badeball/cypress-cucumber-preprocessor";

import { camelize } from "../../../support/helperFunctions/camelize";
import { listStore, patientProfileStore, visitDetailsStore } from "../../../support/helperFunctions/shareData";

/**
 * @namespace 4_Storage.List
 * @description Steps to store list data
 * ---- CODE >> Merge position and random
 * ---- CODE >> open or not ?
 * ---- CODE >> add storage of total number of element
 */

/**
 * @Method (SIMPLE + FIX) -- the HCP stores data from a random {listName} and opens it
 * @memberof 4_Storage.List
 * @description Stores data from a random list's row and open that row
 * @param {string} listName - What data listed should be stored (patient or visit)
 * --- Values : patient list table row or visit list table row
 * @example the HCP stores data from a random "patient list table row" and opens it
 * @example the HCP stores data from a random "visit list table row" and opens it
 * @todo CODE >> PATIENTS and VISIT See list name in README >>> camelize(listName)ListTableRow
 * @todo FIX >> Make date working
 */
When("the HCP stores data from a random {string} and opens it", (listName) => {
	cy.dataCy(camelize(listName))
		.yieldRandom()
		.within((el) => {
			if (listName.toString().includes("visit")) {
				/**
				 * @todo make date working then remove optional from interface
				 */
				// cy.dataCy("visitRowDateCell")
				// 	.invoke("text")
				// 	.then((visitRowDateCellValue) => {
				// 		listStore.visitListRowData.visitRowDate = new Date(visitRowDateCellValue);
				// 	});
				cy.dataCy("visitRowPatientIdCell")
					.invoke("text")
					.then((visitRowPatientIdCellValue) => {
						listStore.visitListRowData.visitRowPatientId = visitRowPatientIdCellValue;
					});
				cy.dataCy("visitRowPatientNameCell")
					.invoke("text")
					.then((visitRowPatientNameCellValue) => {
						listStore.visitListRowData.visitRowPatientName = visitRowPatientNameCellValue;
					});
				cy.dataCy("visitRowPatientSurnameCell")
					.invoke("text")
					.then((visitRowPatientSurnameCellValue) => {
						listStore.visitListRowData.visitRowPatientSurname = visitRowPatientSurnameCellValue;
					});
				cy.dataCy("visitRowVisitSiteCell")
					.invoke("text")
					.then((visitRowVisitSiteCellValue) => {
						listStore.visitListRowData.visitRowLocation = visitRowVisitSiteCellValue;
					});
				cy.dataCy("visitRowHcpCell")
					.invoke("text")
					.then((visitHcpValue) => {
						// Save only the doctor name and first name
						listStore.visitListRowData.visitRowHcp = visitHcpValue.split("Dr.").pop();
					});
			}
			// for patient List
			else if (listName.toString().includes("patient")) {
				cy.dataCy("patientRowFirstNameCell")
					.invoke("text")
					.then((patientRowFirstNameCellValue) => {
						listStore.patientListRowData.patientRowPatientFirstName = patientRowFirstNameCellValue;
					});
				cy.dataCy("patientRowLastNameCell")
					.invoke("text")
					.then((patientRowLastNameCellValue) => {
						listStore.patientListRowData.patientRowPatientLastName = patientRowLastNameCellValue;
					});
				cy.dataCy("patientRowIDCell")
					.invoke("text")
					.then((patientRowIDCellValue) => {
						listStore.patientListRowData.patientRowPatientId = patientRowIDCellValue;
					});
				/**
				 * @todo make date working then remove optional from interface
				 */
				// cy.dataCy("patientRowCreateDateCell")
				// 	.invoke("text")
				// 	.then((patientRowCreateDateCellValue) => {
				// 		listStore.patientListRowData.patientRowCreateDate = patientRowCreateDateCellValue;
				// 	});
				cy.dataCy("patientRowStatusCell")
					.invoke("text")
					.then((patientRowStatusCellValue) => {
						listStore.patientListRowData.patientRowStatus = patientRowStatusCellValue;
					});
			} else {
				throw new Error(
					`The completion of the personal information section with ${listName} data has not been implemented.`
				);
			}
			cy.wrap(el).click();
		});
});

/**
 * @Method the HCP stores data from a random {listName}
 * @memberof 4_Storage.List
 * @description Stores data from a random list's row
 * @param {string} listName - What data listed should be stored (patient or visit)
 * @todo CODE >> PATIENTS and VISIT See list name in README >>> camelize(listName)ListTableRow
 * @example the HCP stores data from a random "patient list table row"
 *
 */
When("the HCP stores data from a random {string}", (listName) => {
	cy.dataCy(camelize(listName))
		.yieldRandom()
		.within(() => {
			if (listName.toString().includes("visit")) {
				/**
				 * @todo make date working then remove optional from interface
				 */
				// cy.dataCy("visitRowDateCell")
				// 	.invoke("text")
				// 	.then((visitRowDateCellValue) => {
				// 		listStore.visitListRowData.visitRowDate = new Date(visitRowDateCellValue);
				// 	});
				cy.dataCy("visitRowPatientIdCell")
					.invoke("text")
					.then((visitRowPatientIdCellValue) => {
						listStore.visitListRowData.visitRowPatientId = visitRowPatientIdCellValue;
					});
				cy.dataCy("visitRowPatientNameCell")
					.invoke("text")
					.then((visitRowPatientNameCellValue) => {
						listStore.visitListRowData.visitRowPatientName = visitRowPatientNameCellValue;
					});
				cy.dataCy("visitRowPatientSurnameCell")
					.invoke("text")
					.then((visitRowPatientSurnameCellValue) => {
						listStore.visitListRowData.visitRowPatientSurname = visitRowPatientSurnameCellValue;
					});
				cy.dataCy("visitRowVisitSiteCell")
					.invoke("text")
					.then((visitRowVisitSiteCellValue) => {
						listStore.visitListRowData.visitRowLocation = visitRowVisitSiteCellValue;
					});
				cy.dataCy("visitRowHcpCell")
					.invoke("text")
					.then((visitHcpValue) => {
						// Save only the doctor name and first name
						listStore.visitListRowData.visitRowHcp = visitHcpValue.split("Dr.").pop();
					});
			}
			// for patient List
			else if (listName.toString().includes("patient")) {
				cy.dataCy("patientRowFirstNameCell")
					.invoke("text")
					.then((patientRowFirstNameCellValue) => {
						listStore.patientListRowData.patientRowPatientFirstName = patientRowFirstNameCellValue;
					});
				cy.dataCy("patientRowLastNameCell")
					.invoke("text")
					.then((patientRowLastNameCellValue) => {
						listStore.patientListRowData.patientRowPatientLastName = patientRowLastNameCellValue;
					});
				cy.dataCy("patientRowIDCell")
					.invoke("text")
					.then((patientRowIDCellValue) => {
						listStore.patientListRowData.patientRowPatientId = patientRowIDCellValue;
					});
				/**
				 * @todo make date working then remove optional from interface
				 */
				// cy.dataCy("patientRowCreateDateCell")
				// 	.invoke("text")
				// 	.then((patientRowCreateDateCellValue) => {
				// 		listStore.patientListRowData.patientRowCreateDate = patientRowCreateDateCellValue;
				// 	});
				cy.dataCy("patientRowStatusCell")
					.invoke("text")
					.then((patientRowStatusCellValue) => {
						listStore.patientListRowData.patientRowStatus = patientRowStatusCellValue;
					});
			} else {
				throw new Error(
					`The completion of the personal information section with ${listName} data has not been implemented.`
				);
			}
		});
});

/**
 * @Method (SIMPLE + FIX) -- the HCP stores data from the {listName} in position {pos}
 * @memberof 4_Storage.List
 * @description Stores data from a list row in a certain position
 * @param {string} listName - What data listed should be stored (patient or visit)
 * --- Values : patient list table row or visit list table row
 * @param {number} pos - row number
 * @example the HCP stores data from the "patient list table row" in position 1
 * @example the HCP stores data from the "visit list table row" in position 4
 * @todo CODE >> PATIENTS and VISIT See list name in README
 * @todo CODE >> As it is used for visit after creating a patient >> To remove if visit is created with API
 * OR do a step that create a patient + store data + open it ?
 * @todo FIX >> Make date working
 */
When("the HCP stores data from the {string} in position {int}", (listName, pos) => {
	cy.dataCy(camelize(listName))
		.eq(pos - 1)
		.within(() => {
			if (listName.toString().includes("visit")) {
				/**
				 * @todo make date working then remove optional from interface
				 */
				// cy.dataCy("visitRowDateCell")
				// 	.invoke("text")
				// 	.then((visitRowDateCellValue) => {
				// 		listStore.visitListRowData.visitRowDate = new Date(visitRowDateCellValue);
				// 	});
				cy.dataCy("visitRowPatientIdCell")
					.invoke("text")
					.then((visitRowPatientIdCellValue) => {
						listStore.visitListRowData.visitRowPatientId = visitRowPatientIdCellValue;
					});
				cy.dataCy("visitRowPatientNameCell")
					.invoke("text")
					.then((visitRowPatientNameCellValue) => {
						listStore.visitListRowData.visitRowPatientName = visitRowPatientNameCellValue;
					});
				cy.dataCy("visitRowPatientSurnameCell")
					.invoke("text")
					.then((visitRowPatientSurnameCellValue) => {
						listStore.visitListRowData.visitRowPatientSurname = visitRowPatientSurnameCellValue;
					});
				cy.dataCy("visitRowVisitSiteCell")
					.invoke("text")
					.then((visitRowVisitSiteCellValue) => {
						listStore.visitListRowData.visitRowLocation = visitRowVisitSiteCellValue;
					});
				cy.dataCy("visitRowHcpCell")
					.invoke("text")
					.then((visitHcpValue) => {
						// Save only the doctor name and first name
						listStore.visitListRowData.visitRowHcp = visitHcpValue.split("Dr.").pop();
					});
			}
			// for patient List
			else if (listName.toString().includes("patient")) {
				cy.dataCy("patientRowFirstNameCell")
					.invoke("text")
					.then((patientRowFirstNameCellValue) => {
						listStore.patientListRowData.patientRowPatientFirstName = patientRowFirstNameCellValue;
					});
				cy.dataCy("patientRowLastNameCell")
					.invoke("text")
					.then((patientRowLastNameCellValue) => {
						listStore.patientListRowData.patientRowPatientLastName = patientRowLastNameCellValue;
					});
				cy.dataCy("patientRowIDCell")
					.invoke("text")
					.then((patientRowIDCellValue) => {
						listStore.patientListRowData.patientRowPatientId = patientRowIDCellValue;
					});
				/**
				 * @todo make date working then remove optional from interface
				 */
				// cy.dataCy("patientRowCreateDateCell")
				// 	.invoke("text")
				// 	.then((patientRowCreateDateCellValue) => {
				// 		listStore.patientListRowData.patientRowCreateDate = patientRowCreateDateCellValue;
				// 	});
				cy.dataCy("patientRowStatusCell")
					.invoke("text")
					.then((patientRowStatusCellValue) => {
						listStore.patientListRowData.patientRowStatus = patientRowStatusCellValue;
					});
			} else {
				throw new Error(
					`The completion of the personal information section with ${listName} data has not been implemented.`
				);
			}
		});
});

/**
 * @namespace 4_Storage.values
 * @description Steps to store data
 */

/**
 * @Method the HCP stores {elementToStore} values to compare them
 * @memberof 4_Storage.values
 * @description Store value from the elementToStore inside a shared data
 * @param {string} elementToStore - patient details profile box / visit details
 * @see README.md (see home page)
 * @example the HCP stores "patient details profile box" values to compare them
 * the "edit patient profile first name field" contains the patient value stored
 */
When("the HCP stores {string} values to compare them", (elementToStore) => {
	switch (elementToStore) {
		case "patient details profile box":
			cy.dataCy("patientDetailsFirstNameFieldValue").then((value) => {
				patientProfileStore.patientDetailsFirstNameFieldValue = value.text();
			});
			cy.dataCy("patientDetailsLastNameFieldValue").then((value) => {
				patientProfileStore.patientDetailsLastNameFieldValue = value.text();
			});
			cy.dataCy("patientDetailsGenderFieldValue").then((value) => {
				patientProfileStore.patientDetailsGenderFieldValue = value.text();
			});
			cy.dataCy("patientDetailsPhoneNumberFieldValue").then((value) => {
				patientProfileStore.patientDetailsPhoneNumberFieldValue = value.text();
			});
			cy.dataCy("patientDetailsEmailFieldValue").then((value) => {
				patientProfileStore.patientDetailsEmailField = value.text();
			});
			cy.dataCy("patientDetailsPreEligibilityResultsFieldValue").then((value) => {
				patientProfileStore.patientDetailsPreEligibilityResultsFieldValue = value.text();
			});
			cy.dataCy("patientDetailsPatientsPathwayFieldValue").then((value) => {
				patientProfileStore.patientDetailsPatientsPathwayFieldValue = value.text();
			});
			cy.dataCy("patientDetailsHospitalIdFieldValue").then((value) => {
				patientProfileStore.patientDetailsHospitalIdFieldValue = value.text();
			});
			cy.dataCy("patientDetailsExternalIdFieldValue").then((value) => {
				patientProfileStore.patientDetailsExternalIdFieldValue = value.text();
			});
			break;
		case "visit details":
			cy.dataCy("visitDetailsVisitName").then((value) => {
				visitDetailsStore.patientFullNameValue = value.text();
			});
			cy.dataCy("visitDetailsVisitId").then((value) => {
				visitDetailsStore.patientIdValue = value.text().replace("ID: ", "");
			});
			cy.dataCy("visitDetailsPathwayFieldValue").then((value) => {
				visitDetailsStore.pathwayValue = value.text();
			});
			cy.dataCy("visitDetailsDateFieldValue").then((value) => {
				visitDetailsStore.dateValue = value.text();
			});
			cy.dataCy("visitDetailsTimeFieldValue").then((value) => {
				visitDetailsStore.timeValue = value.text();
			});
			cy.dataCy("visitDetailsHCPResponsibleFieldValue").then((value) => {
				visitDetailsStore.hcpFullNameValue = value.text();
			});
			cy.dataCy("visitDetailsLocationFieldValue").then((value) => {
				visitDetailsStore.locationValue = value.text();
			});
			cy.dataCy("visitDetailsLocationAddressFieldValue").then((value) => {
				visitDetailsStore.locationAddressValue = value.text();
			});
			cy.dataCy("visitNoteInternalNotes")
				.findCy("visitNoteContent")
				.then((value) => {
					visitDetailsStore.internalNotesValue = value.text();
				});
			cy.dataCy("visitNoteNotesForPatient")
				.findCy("visitNoteContent")
				.then((value) => {
					visitDetailsStore.notesForPatientValue = value.text();
				});
			break;
		default:
			throw new Error(`The store of ${elementToStore} data has not been implemented.`);
	}
});
