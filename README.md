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


# Folders
* Input will contain the files to go accross to create the documentation
* Output will contains for each file the comment tags extract.
* src/ressources
  * interface for the object used
  * command to extract and parse the data
* extractJsComments, main code

# Tags

### Folder tags


### Code tags
Step def
param


### Description tags
descr
see

### Other tags
todo 








