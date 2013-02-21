# feta.js
========

Automated regression testing

## Requirements

Feta is dependent on jQuery for event triggering. 

## Usage

### Automated Test Creation

1. Load `feta` through devtools using the command: `s = document.createElement('script');  s.src = 'http://localhost:3000/lib/feta.js'; document.body.appendChild(s);`
2. Run `feta.start();`
3. Work through typical behaviours on the site
4. Run `feta.stop()` to stop capturing events and create the output script (it will appear in your devtools scripts tab as "feta_output.js")
5. Validations can be added to this file, or it can be incorporated into an automated test suite

### Regression Testing

-Load your test script through devtools using the command: `s = document.createElement('script');  s.src = 'http://localhost:3000/feta_output.js'; document.body.appendChild(s);`

OR

-Run `phantomjs feta/lib/phantom.js <url>`

### Todo

-for getSelector, we need to evaluate siblings where there is nothing to distinguish them (i.e. a list of LI's)
-capture more events, and different types
-clean up feta.js

