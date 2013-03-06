# feta.js
========

Automated regression testing

## Requirements

Feta uses any existing jQuery instance it finds, or loads it's own.  This shouldn't conflict with your code, but it may.


## Install

Enable 'developer mode' in Chrome extensions and click 'load unpacked extension'.  Select the `dist` directory to load the extension.


## Usage

### Automated Test Creation

1. Open devtools and click on the Feta tab
2. Click `Start Recording`
3. Work through typical behaviours on the site
4. Click `Stop Recording` to stop capturing events and create the output script (it will prompt you for a filename and then download automatically)
5. Validations can be added to this file, or it can be incorporated into an automated test suite


### Regression Testing

-Click `Load Script` to load and play a test script

OR

-Run `phantomjs feta/lib/phantom.js <url>`


### Todo
 
-improve reporting of regression, make regression report available
-sidebar needs to be expandable
-when 'run test' is clicked the button should change to disabled and update when test is completed 
-capture more events, and different types  
-maybe have test manifest to load multiple tests  

