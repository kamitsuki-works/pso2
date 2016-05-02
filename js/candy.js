$(function() {

  var jsonPetDataUrl = "../data/pets.json";
  var summonPets;

  // ペットの情報を取得する。
  $.getJSON(jsonPetDataUrl,function(json) {
    summonPets = json.pets;
    console.log(summonPets[0].name);
    console.log(summonPets[0].paper);
    console.log(summonPets[0]);

    $("div.hoge").text(summonPets[0].name);
    return;
  });

//===== 初回実行時 =====
//  setCandyBox();

});

