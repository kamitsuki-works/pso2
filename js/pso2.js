$(function() {
  var jsonDataUrl = "./data/arkuma.json";
  var arkumaWord;
  var successFunc = function(json) {
    arkumaWord = json.word;
  };
  $.getJSON(jsonDataUrl,function(json) {
    successFunc(json);
    return;
  });
  var setWord = function($target){
    var l = arkumaWord.length;
    var r = Math.floor(Math.random()*l)
    $($target).text(arkumaWord[r].text);
  };

  $("html").contextMenu('rmenu',{
    menuStyle: {
      border: '0',
    },
    itemStyle: {
    },
    itemHoverStyle: {
      border: '1px solid #fff',
      background: '#fff'
    },
    shadow:false
  });
  $("div.arkuma").hover(
    function () {
      setWord("div.Gchat");
      $("div.Gchat").animate( {opacity: 'toggle' }, 100 );
    },
    function () {
      $("div.Gchat").animate( {opacity: 'toggle' }, 100 );
    }
  );

  $("ul.characters li.c01").on('click',function(){
    $("img.name02").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name03").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name04").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.gengetsu").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.artemis").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.mugetsu").css("transition","0.4s").css("opacity","0").css("right","-300px");
    setTimeout(function(){
      $("img.name01").css("transition","0.4s").css("opacity","1").css("left","0");
      $("img.moonlight").css("transition","0.4s").css("opacity","1").css("right","-10px");
    },300)
  })

  $("ul.characters li.c02").on('click',function(){
    $("img.name01").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name03").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name04").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.moonlight").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.artemis").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.mugetsu").css("transition","0.4s").css("opacity","0").css("right","-300px");
    setTimeout(function(){
      $("img.name02").css("transition","0.4s").css("opacity","1").css("left","0");
      $("img.gengetsu").css("transition","0.4s").css("opacity","1").css("right","40px");
    },300)
  })

  $("ul.characters li.c03").on('click',function(){
    $("img.name01").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name02").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name04").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.moonlight").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.gengetsu").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.mugetsu").css("transition","0.4s").css("opacity","0").css("right","-300px");
    setTimeout(function(){
      $("img.name03").css("transition","0.4s").css("opacity","1").css("left","0");
      $("img.artemis").css("transition","0.4s").css("opacity","1").css("right","40px");
    },300)
  })

  $("ul.characters li.c04").on('click',function(){
    $("img.name01").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name02").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.name03").css("transition","0.4s").css("opacity","0").css("left","-300px");
    $("img.moonlight").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.gengetsu").css("transition","0.4s").css("opacity","0").css("right","-300px");
    $("img.artemis").css("transition","0.4s").css("opacity","0").css("right","-300px");
    setTimeout(function(){
      $("img.name04").css("transition","0.4s").css("opacity","1").css("left","0");
      $("img.mugetsu").css("transition","0.4s").css("opacity","1").css("right","20px");
    },300)
  })


});
