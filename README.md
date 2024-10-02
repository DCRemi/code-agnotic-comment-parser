# Introduction
### What it does  
It takes files and extract specific structured comment to create a documentation.
It uses some tags to structure the documentation (see part X).

### Needs
We perform automated test using cypress, cucumber in typescript.
We want to document our step definition written in cucumber to have a kind of "dictionnary" of the gherkin step definition to use, and how to use.
So everyone can go through this doc and writte some test scenario.
Ex : the user clicks on the "name" button 
* name is replaced by the name written in the button

### Problematic
At 1st we looked at https://jsdoc.app/  >>> it is not compatible with typescript
* Then we found plugins to make jsdoc compatible with typescript >>> they were not maintained
We looked at https://typedoc.org/options/configuration/ >>> it was not compatible with the gherkin syntax (Given, When, ...)
We looked at other documentation tool >>> Most were not compatible with typescript or the plugins were too old
I had hope when I saw that someone faced the same issue : https://github.com/TypeStrong/TypeDoc/issues/2498
We tried to install this plugin and make it work >>> it seems that it has some conflicts with our actual type script configuration.
Our front dev had not much time to found a solution to make this plugin work.

### Solution
Make our own comment parser to create documentation

In resume it is a really simplify jsdoc that doesn't care about your code but only your comment.
It could even be used for all language or type of document


# Code folders
* Input will contain the files to go accross to create the documentation
* Output will contains for each file the comment tags extract.
* src/ressources
  * interface for the object used
  * command to extract and parse the data
* extractJsComments, main code

# How it works
## Global structure
This works wit comment blocks > Each comment blocks will produce a documentation block.
A comment block start with /** and end with */ (like jsdoc comments).
In each block tags are added to specify the type of content for the documentation.

\* as this "tool" doesn't take into account the code itself, the comment blocks can be written where ever you want. However it is a good practice to put for each step definition the block above.
In that way it is easy to follow change made on the code and to update the comment accordingly.

## Blocks
There is 2 types of blocks 
* Folder blocks : use to define the folder that will belong to the file (contains folder name tag)
* Step definition blocks : use to define the documentation that describe a step definition (contains stepdef tag)


## Tags
## Tags type
### Simple tag
These tag only necessite to put the tag name followed by text 
ex : description / folder name 

### Complexe tag
These tag necessite to complete the tag with some variable after it
ex : param / todo
If the variable are not correctly set an error will appear on the console. However if the param is not set it will take the value none and all the text will go in the content.

# Tags
## Tags
### Folder tags
@folderName (Simple tag)
> Create a folder for the file
> @folderName name of the folder 

@memberof (Simple tag)
> Add the comment block to the folder 
> @memberof name of an existing folder in the file
\* if the folder name doesn't exist it will be treated as a generic tag 

### Code tags
@stepdef (Simple tag)
> will be used as a title of the comment block
> usually it is a copy of the step definition text

@param (complexe tag)
> will be used to describe the parameter used in the step definition 
> It is composed of 2 parameters :
param type : after the tag and between {}
param name : 1st word after the param type
> example : @param {string} name it will be used to pass the name of the user to ...


### Description tags
descr (Simple tag)
see (Simple tag)

### Other tags
todo 


#Example : 
/code






