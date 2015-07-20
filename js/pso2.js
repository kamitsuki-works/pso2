$(function() {
  var jsonDataUrl = "./data/arkuma.json";
  var arkumaWord;
  setWord = function($target){
    var l = arkumaWord.length;
    var r = Math.floor(Math.random()*l)
    $($target).text(arkumaWord[r].text);
  };

  var successFunc = function(json) {
    console.info(json);
    console.info(json.word);
    console.info(json.word.length);
    console.info(json.word[0]);
    arkumaWord = json.word;
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
