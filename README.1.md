# To do

ID-09 copy clip board
ID-10 Add @value to param optional (values possible for param)
ID-11 noLevel pages improve
ID-12 expand todo block
ID-13 faire des bigs example

Bonus

- Search & filtering
- Table css
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

### I.1. Code folders (structure)

- Input will contain the files to go across to create the documentation + a level definition json file
- src/ressources
  - helpers functions
  - interface for the object used
  - commands to extract and parse the data
- createHtmlFiles, createLevelStructure and extractJsComments are the main code
- json_output will contains for each file the comment tags extract as json format
- html_output will contains for each file the corresponding html file

### I.2. Run

Add in the input folder the files you want to treat.<br />

`npm run generate:doc`
This command will run all the scripts need to generate the final html files
It runs all the script through `run-s doc:*`

#### Step 1 : create the json and html folder structure

`npm run doc:createLevelStruct`
<br/>

##### Create json structure

- a root noLevel empty json file
- a folder for each level1 + the noLevel empty json file
- an empty json file for each level2
  <br/>

##### Create html structure

- root html files that contains the html structure with the navBar and a body to replace
  -- noLevel.html (SEE to remove )
  -- index.html
- a folder for each level1 + the html files
  -- noLevel.html (SEE to remove )
  -- index.html that contains the html structure with the navBar and a body to replace
- an empty html file for each level2
  <br/>

#### Step 2 : Generate json files from comment

`npm run doc:extract`
<br/>

#### Step 3 : Create the full html folder from json files

`npm run doc:createHtmlFiles`
<br/>

#### Step 4 : copy the README file to html root folder

`npm run doc:copyREADME`
<br/>

#### Reset folders

`npm run resetFolders`
<br/>

# II. How it works

### II.1. Global structure

This works with comment blocks > Each comment blocks will produce a documentation block.<br />
A comment block start with /\*\* and end with \*/ (like jsdoc comments).<br />
In each block tags are added to specify the type of content for the documentation.<br />

\* as this "tool" doesn't take into account the code itself, the comment blocks can be written where you want. <br/>
However it is a good practice to put for each step definition the comment block above.<br />
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
@level2 level2_name
@level3 level3_name

#### IMPORTANT

- level name should not have space
- level names will be uncamelized on the html pages
- level name in the levelDefinition must extactly correspond to the one written in the code files
  \*\* if not the comment blocks will be written in the generic page

- for now level3 can only be Given / When / Then

### II.3. Tags type

#### Simple tag

These tag only necessitate to put the tag name followed by text <br />
like description tag for example

#### Complex tag

These tag necessitate to complete the tag with some variable after it<br />
ex : param / todo<br />
If the variable are not correctly set an error will appear on the console.

However if the param is not set it will take the value none and all the text will go in the content.<br />

# III. Tags

### III.1. Code tags

**@levelX** (Simple tag)

> @levelX levelName<br />
> @level1 platformName<br />
> @level2 featureName<br />
> @level3 stepTypeName<br />

**@stepDef** (Simple tag) (should be UNIQUE)

> will be used as a title of the comment block. Usually it is a copy of the step definition text<br />
> @stepdef The user clicks on ...

**@param** (Complex tag) (can be MULTIPLE)

> will be used to describe the parameter used in the step definition <br />
> It is composed of 2 parameters :

- param type : after the tag and between {}
- param name : 1st word after the param type
- param value : started with -Values- and separated by /

> example : @param {string} name it will be used to pass the name of the user to ...
> -Values- Remi / Julien
> param will be a "string" named "name" with the description "it will be used to pass the name of the user to ..." and values will be Remi and Julien

**@example** (Simple tag) (can be MULTIPLE)

> will be used to give example on how to use the code
> it will allows to copy paste the example
> <br/>

> example : @example the HCP stores data from a random "patient list table row" and opens it

### III.2. Description tags

**@description** (Simple tag) (should be UNIQUE)

> Use to add a description to explain more in details the step definition<br />
> @description this step def is used to make the user clicks ...

**@see** (Simple tag) (NOT Implemented)

> Use to add a link to a documentation or website<br />
> not working now

### III.3. Other tags

**@todo** (Complex tag) (can be MULTIPLE)

> will be used to point some improvement or other task that can be made on the code / the doc ...<br />
> It is composed with 1 parameter :

- todo type : after the tag and between {}

> example : @todo {CODE} Factorize ...<br />
> example : @todo {DOC} List the value that can be use in this param

### III.4. Generic tag

**@whatEver** (Simple tag) (can be MULTIPLE)
<br />
All tag that are not recognized by the "tool" will be marked as generic tag.<br />
They will be displayed with the name of the tag and the text as content

# IV. Example :

```

```
