$(function() {

  var jsonPetDataUrl = "../data/pets.json";
  var summonPets;

  // �y�b�g�̏����擾����B
  $.getJSON(jsonPetDataUrl,function(json) {
    summonPets = json.pets;
    $("div.hoge").text(summonPets[0].name);
    return;
  });






//===== ������s�� =====
//  setCandyBox();

});
