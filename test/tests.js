test( "sibling selector", function() {
    expect(2);
    QUnit.stop();
  feta.start();
  $("#siblingTest ul li").eq(1).trigger("click");
  feta.stop(function(results){
    ok( results.events.length === 1, "Correct number of events." );
    $("#siblingTest ul li").eq(0).click(function(){
        ok(false,"should not fire this");
    });
    $("#siblingTest ul li").eq(2).click(function(){
        ok(false,"should not fire this");
    });
    $("#siblingTest ul li").eq(1).click(function(){
        ok(true,"should fire this");
    });
    eval(results.JS);
    QUnit.start();
  });
});