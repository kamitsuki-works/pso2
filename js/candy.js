$(function() {

  var jsonPetDataUrl = "../data/pets.json";
  var summonPets;

  // �y�b�g�̏����擾����B
  $.getJSON(jsonPetDataUrl,function(json) {
    summonPets = json.pets;
    return;
  });

  $("div.hoge").text(summonPets[0].name);






  var setWord = function($target){
    var l = arkumaWord.length;
    var r = Math.floor(Math.random()*l)
    $($target).text(arkumaWord[r].text);
  };


  $("div.arkuma").hover(
    function () {
      setWord("div.Gchat");
      $("div.Gchat").animate( {opacity: 'toggle' }, 100 );
    },
    function () {
      $("div.Gchat").animate( {opacity: 'toggle' }, 100 );
    }
  );

//===== ������s�� =====
  setCandyBox();

});
