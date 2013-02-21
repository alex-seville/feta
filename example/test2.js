(function($){
function regression(){
var regressions=[];
return {
add: function(item){
item = item || '';
regressions.push(item);
},
checkIfRegressed: function(cb){
var res = regressions.length > 0;
if (cb){
cb(res,regressions);
}else{
if (res ){
console.log('FETA:Regression!');
}else{
console.log('FETA:No Regression.');
}
}
}
};
}
var r = new regression();
$('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.designing-content UL.design-nav LI A.one.processSliderLinkX SPAN.slideshow-highlight').trigger('click');
//add any verification code here
//use `r.add()` 
setTimeout(function(){ $('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container DIV.takeover-content DIV.processSlider-wrapper.clearfix UL.processSlider NAV.processSlider-btns SPAN.processSlider-btn.processSlider-btnNext.s-disabled').trigger('click');
//add any verification code here
//use `r.add()` 
 } ,2919);
setTimeout(function(){ $('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container DIV.takeover-content DIV.processSlider-wrapper.clearfix UL.processSlider NAV.processSlider-btns SPAN.processSlider-btn.processSlider-btnNext.s-disabled').trigger('click');
//add any verification code here
//use `r.add()` 
 } ,4022);
setTimeout(function(){ $('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container DIV.takeover-content DIV.processSlider-wrapper.clearfix UL.processSlider NAV.processSlider-btns SPAN.processSlider-btn.processSlider-btnNext.s-disabled').trigger('click');
//add any verification code here
//use `r.add()` 
 } ,5455);
setTimeout(function(){ $('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container DIV.takeover-content DIV.processSlider-wrapper.clearfix UL.processSlider NAV.processSlider-btns SPAN.processSlider-btn.processSlider-btnNext.s-disabled').trigger('click');
//add any verification code here
//use `r.add()` 
 } ,6278);
setTimeout(function(){ $('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container A.takeover-closeButton').trigger('click');
//add any verification code here
//use `r.add()` 
 } ,7934);
setTimeout(function(){ 
var opacNum = parseFloat($('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container .takeover-content').css("opacity"));
    if (opacNum == 1){
       r.add();
    }
r.checkIfRegressed();
},8034);
})(jQuery);