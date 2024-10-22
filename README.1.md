# To do

NEED

- Global menu level 1
- Make navigation menu dynamic (create accoding to html files + layout open page)

- Change for the global org >> Update doc

Improve

- expand todo block

Bonus

- Search & filtering
- Table css
- Accordion css
- Extract values for param

# Introduction

This is a code agnostic comment with tag parser.

### What it does

It takes files and extract specific structured comment to create a documentation.<br />
It uses some tags to structure the documentation (see part III.).

### Needs

We perform automated test using cypress, cucumber in typescript.<br />
We want to document our step definition written in cucumber to have a kind of "dictionnary" of the gherkin step definition to use, and how to use.<br />
So everyone can go through this doc and writte some test scenario.<br />
Ex : the user clicks on the "name" button

- name is replaced by the name written in the button

### Problematic

At 1st we looked at https://jsdoc.app/ >>> it is not compatible with typescript

- Then we found plugins to make jsdoc compatible with typescript >>> they were not maintained
  We looked at https://typedoc.org/options/configuration/ >>> it was not compatible with the gherkin syntax (Given, When, ...)<br />
  We looked at other documentation tool >>> Most were not compatible with typescript or the plugins were too old<br />
  I had hope when I saw that someone faced the same issue : https://github.com/TypeStrong/TypeDoc/issues/2498<br />
  We tried to install this plugin and make it work >>> it seems that it has some conflicts with our actual type script configuration.<br />
  Our front dev had not much time to found a solution to make this plugin work.<br />

### Solution

Make our own comment parser to create documentation

In resume it is a really simplify jsdoc that doesn't care about your code but only your comment.<br />
It could even be used for all language or type of document

# I. How to run

### I.1. Code folders

- Input will contain the files to go accross to create the documentation + a level definition json file
- src/ressources
  - interface for the object used
  - command to extract and parse the data
- extractJsComments, main code
- json_output will contains for each file the comment tags extract as json format
- html_output will contains for each file the corresponding html file

### I.2. Run

Add in the input folder the files you want to treat.<br />

#### Extract json file from comment

`npm run doc:extract`
<br/>

#### Create the full html folder

`npm run docToHtml:createHtmlStruct`

#### Extract json file from comment then create the html files

`npm run generate:doc`

# II. How it works

### II.1. Global structure

This works wit comment blocks > Each comment blocks will produce a documentation block.<br />
A comment block start with /\*_ and end with _/ (like jsdoc comments).<br />
In each block tags are added to specify the type of content for the documentation.<br />

\* as this "tool" doesn't take into account the code itself, the comment blocks can be written where ever you want. <br/>
However it is a good practice to put for each step definition the block above.<br />
In that way it is easy to follow change made on the code and to update the comment accordingly.

### II.2. Levels

The comment extraction allows 3 level :

- Level 1 that will be represented by an html folder
- Level 2 that will be represented by an html file in its level 1 folder
- Level 3 that will be represented by a part in the html file

This is made in 2 parts :

- levelDefinition.json file
- levels tags

#### Levels defintion

The input folder should contain a file : levelDefinition.json
That file will define the level and can have a small description for each level

This json is :

```
"level1s" : Level_1 {
	levelName: string;
	levelDesc: string;
	level_2s:
  {
    levelName: string;
	  levelDesc: string;
  }[];
}[];
```

```
Example
{
    "level_1s": [
        {
            "levelName": "level_1_1",
            "levelDesc": "All steps related to HCP Dashboard",
            "level_2s": [
                {
                    "levelName": "ContextSetup",
                    "levelDesc": "These steps are used to setup the context of tests config and user login"
                },
                {
                    "levelName": "Navigation",
                    "levelDesc": "These steps are used to navigate to a specific page or verify that the HCP is properly redirected"
                }
            ]
        },
        {
            "levelName": "App",
            "levelDesc": "All steps related to App",
            "level_2s": []
        }
    ]
}
```

#### Levels tags

The corresponding tags are :
@level1 level1_name
@level2 level2Name
@level3 level1_name

#### IMPORTANT

- level name should not have space
- level names will be uncamelized on the html pages
- level name in the levelDefinition must extactly correspond to the one written in the code files
  \*\* if not the comment blocks will be written in the generic page

### II.3. Tags type

#### Simple tag

These tag only necessite to put the tag name followed by text <br />
ex : description / folder name

#### Complexe tag

These tag necessite to complete the tag with some variable after it<br />
ex : param / todo<br />
If the variable are not correctly set an error will appear on the console. However if the param is not set it will take the value none and all the text will go in the content.<br />

# III. Tags

### III.1. Code tags

**@stepType** (Simple tag)

> will be used to regroup the step type together<br />
> Values are : Given / When / Then <br />
> @stepdef TWhen

**@stepDef** (Simple tag)

> will be used as a title of the comment block. Usually it is a copy of the step definition text<br />
> @stepdef The user clicks on ...

**@param** (Complexe tag)

> will be used to describe the parameter used in the step definition <br />
> It is composed of 2 parameters :

- param type : after the tag and between {}
- param name : 1st word after the param type

> example : @param {string} name it will be used to pass the name of the user to ...

### III.2. Description tags

**@description** (Simple tag)

> Use to add a description to explain more in details the step definition<br />
> @description this step def is used to make the user clicks ...

**@see** (Simple tag)

> Use to add a link to a docuementation or website<br />
> not working now

### III.3. Other tags

**@todo** (Complexe tag)

> will be used to point some improvement or other task that can be made on the code / the doc ...<br />
> It is composed with 1 parameter :

- todo type : after the tag and between {}

> example : @todo {CODE} Factorize ...<br />
> example : @todo {DOC} List the value that can be use in this param

### III.4. Generic tag

**@whatEver** (Simple tag)<br />
All tag that are not recognized by the "tool" will be marked as generic tag.<br />
They will be displayed with the name of the tag and the text as content

# IV. Example :

```
/**
 * @interactionType 1_generic_Click
 * These steps are used to do basic click action
 */

/**
 * @stepType When
 * @stepDef the user clicks on the {element}
 * @memberof 1_generic_Click
 * @description Clicks on an element + verify that it is te only one in the page
 * @param {string} element - element's name
 * @see README.md (see home page)
 * @example the user clicks on the "user list add user button"
 */
When("the user clicks on the {string}", (element: string) => {
	cy.dataCy(camelize(element)).click();
});

/**
 * @stepType When
 * @stepDef the user clicks on the {element} in a random position
 * @memberof 1_generic_Click
 * @description Clicks on a random element of this type
 * @param {string} element - element's name
 * @see README.md (see home page)
 * @example the user clicks on the "user list table row" in a random position
 * Will open a random user from the list
 * @todo {SIMPLE} Rephrase to align all random steps (click children ...)
 */
When("the user clicks on the {string} in a random position", (element: string) => {
	cy.dataCy(camelize(element)).yieldRandom().click();
});

```
