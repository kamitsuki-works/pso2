$(function() {

  var jsonPetDataUrl = "../data/pets.json";
  var summonPets;

  // ペットの情報を取得する。
  $.getJSON(jsonPetDataUrl,function(json) {
    summonPets = json.pets;
    $("div.hoge").text(summonPets[0].name);
    return;
  });






//===== 初回実行時 =====
//  setCandyBox();

});
