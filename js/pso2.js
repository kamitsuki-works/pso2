$(function() {
  var jsonDataUrl = "./data/arkuma.json";
  var arkumaWord;
  setWord = function($target){
    $($target).text(json.arkuma-word[r].text);
    var l = json.arkumaWord.length;
    var r = Math.floor(Math.random()*l)
  };

  var successFunc = function(json) {
    arkumaWord = json.arkuma-word;
  };
  $.getJSON(jsonDataUrl,function(json) {
    successFunc(json);
    return;
  });
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
 });
