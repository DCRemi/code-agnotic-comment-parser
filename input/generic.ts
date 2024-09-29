import { BeforeAll, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";

import { camelize } from "../../../support/helperFunctions/camelize";
import { hcpDataStore, listStore, visitDetailsStore } from "../../../support/helperFunctions/shareData";
import { convertTo12HourFormat } from "../../../support/helperFunctions/timeFormat";

/**
 * @namespace 1_generic
 * @description These steps are used to do basic actions click, type ... and basic assertion visible, contains ...etc
 */

// Before every feature file
BeforeAll(() => {
	// Delete all emails

	cy.mhDeleteAll();
});

// After every feature file
// AfterAll(() => {
// });

// Before every scenario
// Before(() => {
// });

// After every scenario
// After(() => {
// });

// #region Click
/**
 * @namespace 1_generic.Click
 * @description These steps are used to do basic actions click, type ...
 */

// #region Clicks on element

// *********** Position *************
/**
 * @Method the HCP clicks on the {element}
 * @memberof 1_generic.Click
 * @description Clicks on an element + verify that it is te only one in the page
 * @param {string} element - element's name
 * @see README.md (see home page)
 * @example the HCP clicks on the "patients list add patient button"
 */
When("the HCP clicks on the {string}", (element) => {
	cy.dataCy(camelize(element)).click();
});

/**
 * @Method the HCP clicks on the {element} in position {pos}
 * @memberof 1_generic.Click
 * @description Clicks on the Xth element of that type
 * @param {string} element - element's name
 * @param {number} pos - element's position
 * @see README.md (see home page)
 * @example the HCP clicks on the "visit list table row" in position 1
 * Will open the 1st visit in the list
 */
When("the HCP clicks on the {string} in position {int}", (element, pos) => {
	cy.dataCy(camelize(element)).should("have.length.of.at.least", pos);
	cy.dataCy(camelize(element))
		.eq(pos - 1)
		.click();
});

/**
 * @Method the HCP clicks on the {element} in a random position
 * @memberof 1_generic.Click
 * @description Clicks on a random element of this type
 * @param {string} element - element's name
 * @see README.md (see home page)
 * @example the HCP clicks on the "patient list table row" in a random position
 * Will open a random patient from the list
 * @todo SIMPLE >> Rephrase to align all random steps
 */
When("the HCP clicks on the {string} in a random position", (element) => {
	cy.dataCy(camelize(element)).yieldRandom().click();
});

// *********** Contains *************
/**
 * @Method the HCP clicks on the {element} that contains {value}
 * @memberof 1_generic.Click
 * @description Clicks on a element that contains a specific text  + verify that it is te only one in the page
 * @param {string} element - element's name
 * @param {string} value - element's value -- text that is contained by the element
 * @see README.md (see home page)
 * @example the HCP clicks on the "patient list table row" that contains "Joe"
 * Will open the patient names Joe
 */
When("the HCP clicks on the {string} that contains {string}", (element, value) => {
	cy.dataCyContains(camelize(element), value.toString()).click();
});

/**
 * @Method the HCP clicks on the {element} that contains {value} in position {pos}
 * @memberof 1_generic.Click
 * @description Clicks on the Xth element that contains a specific text
 * @param {string} element - element's name
 * @param {string} value - element's value -- text that is contained by the element
 * @param {number} pos - element's position
 * @see README.md (see home page)
 * @example the HCP clicks on the "patient list table row" that contains "Unverified" in position 3
 * Will open the 3rd patient that has a Unverified status
 */
When("the HCP clicks on the {string} that contains {string} in position {int}", (element, value, pos) => {
	cy.dataCyContains(camelize(element), value.toString()).should("have.length.of.at.least", pos);
	cy.dataCyContains(camelize(element), value.toString())
		.eq(pos - 1)
		.click();
});

/**
 * @Method the HCP clicks on a random {element} that contains {value}
 * @memberof 1_generic.Click
 * @description Clicks on a random element that contains a specific text
 * @param {string} element - element's name
 * @param {string} value - element's value -- text that is contained by the element
 * @see README.md (see home page)
 * @example the HCP clicks on a random "patient list table row" that contains "Active"
 * Will opens a random patient that has a Active status
 */
When("the HCP clicks on a random {string} that contains {string}", (element, value) => {
	cy.dataCyContains(camelize(element), value.toString()).yieldRandom().click();
});
// #endregion

// #region Clicks on element in parent

// *********** Position *************
/**
 * @Method the HCP clicks on the {element} of the {parentElement}
 * @memberof 1_generic.Click
 * @description Clicks on an element that is inside a parent element
 * @param {string} childElement - element's name
 * @param {string} parentElement - name of the element that contains the one to click on
 * @see README.md (see home page)
 */
When("the HCP clicks on the {string} of the {string}", (childElement, parentElement) => {
	cy.dataCy(camelize(parentElement)).findCy(camelize(childElement)).click();
});

/**
 * @Method the HCP clicks on the {childElement} of the {parentElement} in position {parentElementPosition}
 * @memberof 1_generic.Click
 * @description Clicks on an element that is inside the Xth parent element of this type
 * @param {string} childElement - element's name
 * @param {string} parentElement - name of the element that contains the one to click on
 * @param {number} parentElementPosition - parent element's position
 * @see README.md (see home page)
 * @example the HCP clicks on the "patient list table row kebab button" of the "patient list table row" in position 1
 * Will open the kebab menu of the 1st patient in the list
 */
When(
	"the HCP clicks on the {string} of the {string} in position {int}",
	(childElement, parentElement, parentElementPosition) => {
		cy.dataCy(camelize(parentElement)).should("have.length.of.at.least", parentElementPosition);
		cy.dataCy(camelize(parentElement))
			.eq(parentElementPosition - 1)
			.findCy(camelize(childElement))
			.click();
	}
);

/**
 * @Method the HCP clicks on the {childElement} of the {parentElement} in a random position
 * @memberof 1_generic.Click
 * @description Clicks on a the element that is contained in a random parentElement of this type
 * @param {string} childElement - element's name
 * @param {string} parentElement - name of the element that contains the one to click on
 * @see README.md (see home page)
 * @example the HCP clicks on the "patient list table row kebab button" of the "patient list table row" in a random position
 * Will open the kebab menu of a random patient in the list
 * @todo SIMPLE >> Rephrase to align all random steps
 */
When("the HCP clicks on the {string} of the {string} in a random position", (childElement, parentElement) => {
	cy.dataCy(camelize(parentElement)).yieldRandom().findCy(camelize(childElement)).click();
});

/**
 * @Method the HCP clicks on the {childElement} in position {childElementPosition} of the {parentElement}
 * @memberof 1_generic.Click
 * @description Clicks on an element that is inside a parent element
 * @param {string} childElement - element's name
 * @param {number} childElementPosition - parent element's position
 * @param {string} parentElement - name of the element that contains the one to click on
 * @see README.md (see home page)
 */
When(
	"the HCP clicks on the {string} in position {int} of the {string}",
	(childElement, childElementPosition, parentElement) => {
		cy.dataCy(camelize(parentElement))
			.findCy(camelize(childElement))
			.should("have.length.of.at.least", childElementPosition);

		cy.dataCy(camelize(parentElement))
			.findCy(camelize(childElement))
			.eq(childElementPosition - 1)
			.click();
	}
);

/**
 * @Method the HCP clicks on a random {childElement} of a random {parentElement}
 * @memberof 1_generic.Click
 * @description Clicks on a random element of this type that is contained in a random parentElement of this type
 * @param {string} childElement - element's name
 * @param {string} parentElement - name of the element that contains the one to click on
 * @see README.md (see home page)
 * @todo SIMPLE >> Rephrase to align all random steps
 */
When("the HCP clicks on a random {string} of a random {string}", (childElement, parentElement) => {
	cy.dataCy(camelize(parentElement)).yieldRandom().findCy(camelize(childElement)).yieldRandom().click();
});

// *********** Each *************
/**
 * @Method the HCP clicks on the {element} for each {parentElement}
 * @memberof 1_generic.Click
 * @description Clicks on a specific element for all parentElement
 * @param {string} childElement - element's name (for now only cancel icon is possible)
 * @param {string} parentElement - name of the element that contains the one to click on
 * @see README.md (see home page)
 * @example the HCP clicks on the "cancel icon" for each "patients list status filter chip"
 * Will remove all the patient list status filter chip
 * @todo CODE >>> fix a bug if use a forEach
 */
When("the HCP clicks on the {string} for each {string}", (childElement, parentElement) => {
	if (childElement === "cancel icon") {
		/**
		 * @info
		 * A for is used instead of a for each because of a strange behavior that yield and element but clicks on the next one then for the last one it doesn't find
		 * see bellow
		 */
		cy.dataCy(camelize(parentElement)).then((elements) => {
			for (let index = 0; index < elements.length; index += 1) {
				cy.dataCy(camelize(parentElement)).first().find("[data-testid=CancelIcon]").click();
			}
		});
	}

	/**
	 * The following way of doing it is not working because of very strange behavior
	 * with pathway, console shows it yielded chip 2  but the screen shows the 1st
	 * when click cancel icon > it cancel not the one that is yielded (in the console)
	 * if 2 elements > console shows yield number 2 but cancel 1
	 * Then try to cancel the one that is canceled and not visible
	 *
	 * Fixed with a for
	 *
	 * Strange part
	 *  >> status > no pb >> only with pathway chip
	 *  >> without click > correct order is shown
	 * cy.dataCy(camelize(parentElement)).each((el) => {
	 * // if ($list.length - index - 1 !== 1) {
	 * cy.wrap(el).within(() => {
	 * cy.get("[data-testid=CancelIcon]").click();
	 * 			// cy.wait(3000);
	 * 		// cy.reload();
	 *	});
	 * 	});
	 */
});
// #endregion

// #region Other
/**
 * @Method the HCP clicks on the corner
 * @memberof 1_generic.Click
 * @description Clicks on an element + verify that it is te only one in the page
 * @see README.md (see home page)
 * @example the HCP clicks on the corner
 * Remove the focus of a field / try or quit a popup
 * @todo QUESTION >> Merge with click ??
 */
When("the HCP clicks on the corner", () => {
	cy.get("body").click(0, 0);
});

/**
 * @Method the HCP hovers the {string}
 * @memberof 1_generic.Click
 * @description Hovers an element
 * @param {string} element - element's name
 * @see README.md (see home page)
 * @example the HCP hovers the "side nav site element"
 * Make a tooltip of the site element in the menu appears
 */
When("the HCP hovers the {string}", (element) => {
	cy.dataCy(camelize(element)).trigger("mouseover");
});
// #endregion
// #endregion

// #region Fields
/**
 * @namespace 1_generic.Fields
 * @description These steps are used to do basic actions on fields
 */

/**
 * @Method the HCP enters {element} in the {text}
 * @memberof 1_generic.Fields
 * @description Enters a text in a field
 * @param {string} element - element's name
 * @param {string} text - can be "variable" OR free text (if the text is not a known variable)
 * ---- Available variable "" / "a valid date in the future" / "a valid time" / "a random long text" / "the stored password"
 * @see README.md (see home page)
 * @todo DOC >> add option in param
 * @example the HCP enters "a random long text" in the "visit panel notes for patient field"
 * @example the HCP enters "a valid date in the future" in the "visit panel date field"
 * @example the HCP enters "" in the "add patient panel <field_name> field" AND the HCP blurs the "add patient panel <field_name> field" "input"
 * Will enter the field and then remove the focus (test empty field error)
 * @example the HCP enters "Jean" in the "patients list search field"
 */
When("the HCP enters {string} in the {string}", (text, element) => {
	switch (text) {
		case "":
			cy.dataCy(camelize(element)).click();
			break;
		case "a valid date in the future": {
			const dateInFuture = faker.date.future();
			const month = dateInFuture.getMonth() + 1;
			const day = dateInFuture.getDate();
			const year = dateInFuture.getFullYear();
			cy.dataCy(camelize(element)).type(`${month < 10 ? "0" : ""}${month}/${day < 10 ? "0" : ""}${day}/${year}`);
			break;
		}
		case "a valid time": {
			const hour = faker.number.int(23);
			const minute = faker.number.int(59);
			cy.dataCy(camelize(element)).type(convertTo12HourFormat(`${hour}:${minute < 10 ? "0" : ""}${minute}`));
			break;
		}
		case "a random long text":
			cy.dataCy(camelize(element)).type(faker.lorem.paragraph());
			break;
		case "the stored password":
			cy.dataCy(camelize(element)).type(hcpDataStore.password);
			break;
		default:
			cy.dataCy(camelize(element)).type(text);
	}
});

/**
 * @Method the HCP blurs the {element} {fieldType}
 * @memberof 1_generic.Fields
 * @description Enters a text in a field
 * @param {string} element - element's name
 * @param {string} fieldType - input or combobox
 * @see README.md (see home page)
 * @todo DOC >> add option in param
 * @example the HCP enters "" in the "add patient panel <field_name> field" AND the HCP blurs the "add patient panel <field_name> field" "input"
 * Will enter the field and then remove the focus (test empty field error)
 */
When("the HCP blurs the {string} {string}", (element, fieldType) => {
	switch (fieldType) {
		case "input":
			cy.dataCy(camelize(element)).find("input").blur();
			break;
		case "combobox":
			cy.dataCy(camelize(element)).find("[role=combobox]").blur();
			break;
		default:
			cy.dataCy(camelize(element)).blur();
	}
});

/**
 * @Method the HCP clears the {element} {dataType}
 * @memberof 1_generic.Fields
 * @description Clears a field value
 * @param {string} element - element's name
 * @param {string} dataType - text or options selected or note
 * @see README.md (see home page)
 * @todo DOC >> add option in param
 * @example the HCP clears the "edit patient profile pathway field" "options selected"
 * @example the HCP clears the "edit patient profile external Id field" "text"
 */
When("the HCP clears the {string} {string}", (element, dataType) => {
	switch (dataType) {
		case "text":
			cy.dataCy(camelize(element)).find("input").clear();
			break;
		case "options selected":
			/**
			 * @info
			 * A for is used instead of a for each because of a strange behavior that yield and element but clicks on the next one then for the last one it doesn't find
			 * see bellow
			 */
			cy.dataCy(camelize(element)).then(($el) => {
				if ($el.find("[data-testid=CancelIcon]").length > 0) {
					// evaluates as false
					cy.wrap($el)
						.find("[data-testid=CancelIcon]")
						.then((elements) => {
							for (let index = 0; index < elements.length; index += 1) {
								cy.get("[data-testid=CancelIcon]").first().click();
							}
						});
				}
			});
			break;
		case "note":
			cy.dataCy(camelize(element)).clear();
			break;
		default:
			throw new Error(`The validation for the ${dataType} has not been implemented.`);
	}
});

/**
 * @Method the HCP selects {string} options in the {string}
 * @memberof 1_generic.Fields
 * @description Selects an option in a list according to the text contained in the option
 * @param {string} optionText - text contained in the option to select
 * @param {string} selectList - select list element's name
 * @see README.md (see home page)
 * @todo ORTHO >> remove s from options
 * @example the HCP selects "Pathway (15)" options in the "edit patient profile pathway field"
 * Will select in the pathway field the option that contains "Pathway (15)"
 */
When("the HCP selects {string} options in the {string}", (optionText, selectList) => {
	cy.dataCy(camelize(selectList)).find("input").click();
	cy.contains("li[role=option]", optionText).click();
});

/**
 * @Method the HCP selects {int} random options in the {string}
 * @memberof 1_generic.Fields
 * @description Selects a specific number of options in a list
 * @param {string} numberOfOption - number of options to select
 * @param {string} selectList - select list element's name
 * @see README.md (see home page)
 * @example the HCP selects 3 random options in the "edit patient profile pathway field"
 * Will select in the pathway field 3 random options
 */
When("the HCP selects {int} random options in the {string}", (numberOfOption, selectList) => {
	for (let index = 0; index < numberOfOption; index += 1) {
		cy.dataCy(camelize(selectList)).find("input").click();
		cy.get("li[role=option]").yieldRandom().click();
	}
});
// #endregion

// #region Assertion
/**
 * @namespace 1_generic.ElementStatus
 * @description These steps are used to assert status of element (visibility, enablility ...etc) >> TO DO merge steps to have :
 * visibility status AND enable/disable for different type of field (input, button ...Etc )
 */

// #region Element status (visible / enabled ...)
/**
 * @Method the {string} is {string} SEE TODO
 * @memberof 1_generic.ElementStatus
 * @description Assert that an element has a particular status
 *
 */
Then("the {string} is {string}", (element, status) => {
	switch (status) {
		case "visible":
			cy.dataCy(camelize(element)).eq(0).scrollIntoView();
			cy.dataCy(camelize(element)).should("be.visible");
			break;
		case "hidden":
			cy.dataCy(camelize(element)).should("not.be.visible");
			break;
		case "not present":
			cy.dataCy(camelize(element)).should("not.exist");
			break;
		case "mandatory":
			cy.dataCy(camelize(element)).find("input").should("have.attr", "required");
			break;
		case "enabled":
			cy.dataCy(camelize(element)).should("be.enabled");
			break;
		case "disabled":
			cy.dataCy(camelize(element)).should("have.attr", "disabled");
			break;
		default:
			throw new Error(`The validation for the ${status} status has not been implemented.`);
	}
});

Then("the {string} in the {string} is {string}", (childElement, parentElement, status) => {
	switch (status) {
		case "visible":
			cy.dataCy(camelize(parentElement))
				.eq(0)
				.within(() => {
					cy.dataCy(camelize(childElement)).eq(0).scrollIntoView();
					cy.dataCy(camelize(childElement)).should("be.visible");
				});
			break;
		case "hidden":
			cy.dataCy(camelize(parentElement)).eq(0).findCy(camelize(childElement)).should("not.be.visible");
			break;
		case "not present":
			cy.dataCy(camelize(parentElement)).eq(0).findCy(camelize(childElement)).should("not.exist");
			break;
		case "mandatory":
			cy.dataCy(camelize(parentElement)).eq(0).findCy(camelize(childElement)).should("have.attr", "required");
			break;
		case "enabled":
			cy.dataCy(camelize(parentElement)).eq(0).findCy(camelize(childElement)).should("be.enabled");
			break;
		case "disabled":
			cy.dataCy(camelize(parentElement)).eq(0).findCy(camelize(childElement)).should("have.attr", "disabled");
			break;
		default:
			throw new Error(`The validation for the ${status} status has not been implemented.`);
	}
});

Then("the {string} input is {string}", (element, status) => {
	switch (status) {
		case "enabled":
			cy.dataCy(camelize(element)).find("input").should("be.enabled");
			break;
		case "disabled":
			cy.dataCy(camelize(element)).find("input").should("have.attr", "disabled");
			break;
		default:
			throw new Error(`The validation for the ${status} status has not been implemented.`);
	}
});

Then("the {string} {string} displayed in the {string}", (childElement, option, parentElement) => {
	if (option === "is") {
		cy.dataCy(camelize(parentElement))
			.eq(0)
			.within(() => {
				cy.dataCy(camelize(childElement)).eq(0).scrollIntoView();
				cy.dataCy(camelize(childElement)).should("be.visible");
			});
	} else if (option === "is not") {
		cy.dataCy(camelize(parentElement))
			.eq(0)
			.within(() => {
				cy.dataCy(camelize(childElement)).should("not.exist");
			});
	} else {
		throw new Error(`The option ${option} has not been implemented.`);
	}
});
// #endregion

// #region Element content
/**
 * @namespace 1_generic.ElementContent
 * @description These steps are used to assert element content >> TO DO merge steps to have a coherent set
 */
Then("the {string} displays {string}", (element, text) => {
	switch (text) {
		case "the stored patient name and ID":
			cy.dataCy(camelize(element)).should(
				"have.text",
				`${listStore.patientListRowData.patientRowPatientFirstName} ${listStore.patientListRowData.patientRowPatientLastName} (${listStore.patientListRowData.patientRowPatientId})`
			);
			break;
		case "the stored patient name and ID from visit details":
			cy.dataCy(camelize(element)).should(
				"have.text",
				`${visitDetailsStore.patientFullNameValue} (${visitDetailsStore.patientIdValue})`
			);
			break;
		case "the stored pathway from visit details":
			cy.dataCy(camelize(element)).find("div").find("div").should("have.text", visitDetailsStore.pathwayValue);
			break;
		case "the stored date from visit details":
			cy.dataCy(camelize(element)).find("input").should("have.value", visitDetailsStore.dateValue);
			break;
		case "the stored time from visit details":
			cy.dataCy(camelize(element))
				.find("input")
				.should("have.value", convertTo12HourFormat(visitDetailsStore.timeValue));
			break;
		case "the stored HCP from visit details":
			cy.dataCy(camelize(element))
				.find("input")
				.should("have.value", visitDetailsStore.hcpFullNameValue.replace("Dr ", "Dr. "));
			break;
		case "the stored location from visit details":
			cy.dataCy(camelize(element)).find("input").should("have.value", visitDetailsStore.locationValue);
			break;
		case "the stored location address from visit details":
			cy.dataCy(camelize(element)).find("input").should("have.value", visitDetailsStore.locationAddressValue);
			break;
		case "the stored notes for patient from visit details":
			cy.dataCy(camelize(element)).find("textarea").eq(0).should("have.text", visitDetailsStore.notesForPatientValue);
			break;
		case "the stored internal notes from visit details":
			cy.dataCy(camelize(element)).find("textarea").eq(0).should("have.text", visitDetailsStore.internalNotesValue);
			break;
		default:
			cy.dataCy(camelize(element)).should("have.text", text);
	}
});

Then("the {string} is displayed for every {string}", (childElement, parentElement) => {
	cy.dataCy(camelize(parentElement)).each(($el) => {
		cy.wrap($el).findCy(camelize(childElement)).eq(0).scrollIntoView();
		cy.wrap($el).findCy(camelize(childElement)).should("be.visible");
	});
});

Then("the {string} contains {string}", (element, text) => {
	cy.dataCy(camelize(element)).should("contain", text);
});

Then("the {string} input contains {string}", (element, text) => {
	cy.dataCy(camelize(element)).find("input").should("have.attr", "value", text);
});

Then("the {string} text matches {string}", (element, text) => {
	cy.dataCy(camelize(element)).should(($value) => {
		expect($value.text().toLowerCase()).to.contain(text.toLowerCase());
	});
});

Then("every {string} contains {string}", (element, text) => {
	cy.dataCy(camelize(element)).each(($el) => {
		cy.wrap($el).should("contain", text);
	});
});

Then("every {string} text matches {string}", (element, text) => {
	cy.dataCy(camelize(element)).each(($el) => {
		cy.wrap($el).should(($value) => {
			expect($value.text().toLowerCase()).to.contain(text.toLowerCase());
		});
	});
});

Then("the {string} has the label {string}", (element, label) => {
	cy.dataCy(camelize(element)).eq(0).scrollIntoView();
	cy.dataCy(camelize(element)).within(() => {
		cy.get("label").scrollIntoView();
		cy.get("label").should("have.text", label).and("be.visible");
	});
});

Then("the {string} has the placeholder {string}", (element, placeholder) => {
	cy.dataCy(camelize(element)).eq(0).scrollIntoView();
	cy.dataCy(camelize(element)).within(() => {
		cy.get("input").should("have.attr", "placeholder", placeholder).and("be.visible");
	});
});

Then("the {string} has the error message {string}", (element, errorMessage) => {
	cy.dataCy(camelize(element)).eq(0).scrollIntoView();
	cy.dataCy(camelize(element)).within(() => {
		cy.get("p").should("have.text", errorMessage).and("be.visible");
	});
});

Then("the {string} does not have error message", (element) => {
	cy.dataCy(camelize(element)).eq(0).scrollIntoView();
	cy.dataCy(camelize(element)).within(() => {
		cy.get("p").should("not.exist");
	});
});

Then("the {string} displays {string} in the {string} in position {int}", (childElement, text, parentElement, pos) => {
	cy.dataCy(camelize(parentElement))
		.eq(pos - 1)
		.findCy(camelize(childElement))
		.should("have.text", text);
});

Then("the {string} contains {string} in the {string} in position {int}", (childElement, text, parentElement, pos) => {
	cy.dataCy(camelize(parentElement))
		.eq(pos - 1)
		.findCy(camelize(childElement))
		.should("contain.text", text);
});

Then("the {string} displays {string} in the {string}", (childElement, text, parentElement) => {
	cy.dataCy(camelize(parentElement)).eq(0).findCy(camelize(childElement)).should("have.text", text);
});

Then("the {string} contains {string} in the {string}", (childElement, text, parentElement) => {
	cy.dataCy(camelize(parentElement)).eq(0).findCy(camelize(childElement)).should("contain.text", text);
});

// #endregion

Then("a tooltip displays {string}", (tooltipText) => {
	cy.get("[role=tooltip]").should("contain", tooltipText);
});

Then("the {string} has the type {string}", (element, type) => {
	cy.dataCy(camelize(element)).within(() => {
		cy.get("input").should("have.attr", "type", type);
	});
});

Then(
	"the {string} {string} displayed in the {string} in position {int}",
	(childElement, option, parentElement, pos) => {
		cy.dataCy(camelize(parentElement)).should("have.length.of.at.least", pos);
		if (option === "is") {
			cy.dataCy(camelize(parentElement))
				.eq(pos - 1)
				.findCy(camelize(childElement))
				.scrollIntoView();
			cy.dataCy(camelize(parentElement))
				.eq(pos - 1)
				.findCy(camelize(childElement))
				.should("be.visible");
		} else if (option === "is not") {
			cy.dataCy(camelize(parentElement))
				.eq(pos - 1)
				.findCy(camelize(childElement))
				.should("not.exist");
		} else {
			throw new Error(`The option ${option} has not been implemented.`);
		}
	}
);

Then("the {string} has the background color {string} in position {int}", (element, color, pos) => {
	cy.dataCy(camelize(element))
		.eq(pos - 1)
		.should("have.css", "background-color", color);
});
// #endregion
