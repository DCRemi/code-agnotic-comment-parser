# Introduction
### What it does  
It takes files and extract specific structured comment to create a documentation.<br />
It uses some tags to structure the documentation (see part III.).

### Needs
We perform automated test using cypress, cucumber in typescript.<br />
We want to document our step definition written in cucumber to have a kind of "dictionnary" of the gherkin step definition to use, and how to use.<br />
So everyone can go through this doc and writte some test scenario.<br />
Ex : the user clicks on the "name" button 
* name is replaced by the name written in the button

### Problematic
At 1st we looked at https://jsdoc.app/  >>> it is not compatible with typescript
* Then we found plugins to make jsdoc compatible with typescript >>> they were not maintained
We looked at https://typedoc.org/options/configuration/ >>> it was not compatible with the gherkin syntax (Given, When, ...)<br />
We looked at other documentation tool >>> Most were not compatible with typescript or the plugins were too old<br />
I had hope when I saw that someone faced the same issue : https://github.com/TypeStrong/TypeDoc/issues/2498<br />
We tried to install this plugin and make it work >>> it seems that it has some conflicts with our actual type script configuration.<br />
Our front dev had not much time to found a solution to make this plugin work.<br />

### Solution
Make our own comment parser to create documentation

In resume it is a really simplify jsdoc that doesn't care about your code but only your comment.<br />
It could even be used for all language or type of document


# I. Code folders
* Input will contain the files to go accross to create the documentation
* Output will contains for each file the comment tags extract.
* src/ressources
  * interface for the object used
  * command to extract and parse the data
* extractJsComments, main code

# II. How it works
### II.1. Global structure
This works wit comment blocks > Each comment blocks will produce a documentation block.<br />
A comment block start with /** and end with */ (like jsdoc comments).<br />
In each block tags are added to specify the type of content for the documentation.<br />

\* as this "tool" doesn't take into account the code itself, the comment blocks can be written where ever you want. However it is a good practice to put for each step definition the block above.<br />
In that way it is easy to follow change made on the code and to update the comment accordingly.

### II.2. Blocks
There is 2 types of blocks 
* Folder blocks : use to define the folder that will belong to the file (contains folder name tag)
* Step definition blocks : use to define the documentation that describe a step definition (contains stepdef tag)


### II.3. Tags type
#### Simple tag
These tag only necessite to put the tag name followed by text <br />
ex : description / folder name 

#### Complexe tag
These tag necessite to complete the tag with some variable after it<br />
ex : param / todo<br />
If the variable are not correctly set an error will appear on the console. However if the param is not set it will take the value none and all the text will go in the content.<br />

# III. Tags
### III.1. Folder tags
@folderName (Simple tag)
> Create a folder for the file<br /> 
> @folderName name of the folder 

@memberof (Simple tag)
> Add the comment block to the folder <br /> 
> @memberof name of an existing folder in the file
\* if the folder name doesn't exist it will be treated as a generic tag 

### III.2. Code tags
@stepdef (Simple tag)
> will be used as a title of the comment block. Usually it is a copy of the step definition text<br /> 
> @stepdef The user clicks on ... 

@param (complexe tag)
> will be used to describe the parameter used in the step definition <br />
> It is composed of 2 parameters :

* param type : after the tag and between {}
* param name : 1st word after the param type

> example : @param {string} name it will be used to pass the name of the user to ...


### III.3. Description tags
@description (Simple tag)
> Use to add a description to explain more in details the step definition<br /> 
> @description this step def is used to make the user clicks ...

@see (Simple tag)
> Use to add a link to a docuementation or website<br /> 
> not working now

### III.4. Other tags
@todo 
> will be used to point some improvement or other task that can be made on the code / the doc ...<br />
> It is composed with 1 parameter :

* todo type : after the tag and between {}

> example : @todo {CODE} Factorize ...<br />
> example : @todo {DOC} List the value that can be use in this param

### III.5. Generic tag 
All tag that are not recognized by the "tool" will be marked as generic tag.<br />
They will be displayed with the name of the tag and the text as content


# IV. Example : 
/code







