(function($){
$('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.designing-content UL.design-nav LI A.one.processSliderLinkX SPAN.navIndex').trigger('click');
setTimeout(function(){ $('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container DIV.takeover-content DIV.processSlider-wrapper.clearfix UL.processSlider NAV.processSlider-btns SPAN.processSlider-btn.processSlider-btnNext').trigger('click');
 } ,1638);
setTimeout(function(){ $('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container A.takeover-closeButton').trigger('click');
 } ,2583);
setTimeout(function(){
	//Add your verification code here

	if (parseFloat($('HTML BODY DIV.main ARTICLE DIV#designing.designing DIV.designing-content-wrap DIV.takeover-container .takeover-content').css("opacity")) < 1){
		console.log("No Regression");
	}else{
		console.log("Regression!");
	}
},2583);
})(jQuery);
