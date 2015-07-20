$(function() {
  // var jsonDataUrl = "./data/arkuma.json";
  // var arkumaWord;
  // var successFunc = function(json) {
  //   arkumaWord = json.word;
  // };
  // $.getJSON(jsonDataUrl,function(json) {
  //   successFunc(json);
  //   return;
  // });
  // var setWord = function($target){
  //   var l = arkumaWord.length;
  //   var r = Math.floor(Math.random()*l)
  //   $($target).text(arkumaWord[r].text);
  // };

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
      // setWord("div.Gchat");
      $("div.Gchat").animate( {opacity: 'toggle' }, 100 );
    },
    function () {
      $("div.Gchat").animate( {opacity: 'toggle' }, 100 );
    }
  );
});
