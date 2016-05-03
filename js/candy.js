$(function() {

//===== マスタ情報 =====
  // ペットjsonパス
  var jsonPetDataUrl = "../data/pets.json";
  // 取得した全ペット情報
  var summonPets = [];
  // 取得した全キャンディ情報
  var candies = [];
  // カテゴリ情報
  var category = ["parfait","roll","cookie","pancake","lemonsoda","crepe","lollipop","sand","gummy"];
  // カテゴリ毎設置上限
  var maxCategoryCandy = [2,2,3,2,1,1,4,5,20];


//===== 各種状態 =====
  // キャンディボックスの状態
  var candyCell = [];
  // セットされたキャンディのリスト
  var candyList = [];
  // セットされたキャンディのカテゴリ毎個数
  var countCategoryCandy = [];
  
  // アクティブなペット
  var petId;
  // アクティブなキャンディ
  var candyId;


//===== 関数定義(常時展開) =====

  /**
   * ペーパーキューブの設定
   */
  var setPaperCube = function(){
    // ペーパーセルの解除
    $("li.tile.paper").each(function(){
      $(this).removeClass("paper");
    });
    // ペーパーセルのセット
    var paper = summonPets[petId].paper.split(",")
    for(var i = 0; i < paper.length; i++){
      $("li.tile#tile" + paper[i]).addClass("paper");
      $("li.cell#cell" + paper[i]).addClass("paper");
    };
    // 全データ初期化
    candyList = [];
    for(var i = 1; i <= 8; i++){
      var col = [];
      for(var j = 1; j <= 8; j++){
        col[i] = 0;
      }
      candyCell[i] = col;
    }
    // ペーパーデータ登録
    for(var k = 0; k < paper.length; k++){
      var i = Math.floor(new Number(paper[k])/10);
      var j = new Number(paper[k]) - i*10;
      candyCell[i][j] = -1;
    };
  }

  /**
   * キャンディのセット
   */
  var putCandy = function(i,j){
      //キャンディ情報取得
    var candy = candies[candyId];

    //== 状態判定 ==
    // ペーパーキューブ
    for(var r = i; r < i+new Number(candy.height); r++){
      for(var c = j; c < j+new Number(candy.width); c++){
        if(candyCell[r][c] < 0){
          return;
        }
      }
    }
    // 設置数上限
    if(countCategoryCandy[candy.category] == maxCategoryCandy[candy.category]){
      return;
    }
    // パフェ重複
    if(category[candy.category] == "parfait"){
      for(var k = 0; k < candyList.length; k++){
        if(candyList[k].id == candy.id){
          return;
        }
      }
    }
    

    // キャンディ除去
    for(var r = i; r < i+new Number(candy.height); r++){
      for(var c = j; c < j+new Number(candy.width); c++){
        // 該当するキャンディの要素順を取得
        var candyListIter = getPutCandy(r,c);
        if(candyListIter >= 0){
          candyList.splice(candyListIter,1);
        }
      }
    }
    
    // セット
    for(var r = i; r < i+new Number(candy.height); r++){
      for(var c = j; c < j+new Number(candy.width); c++){
        candyCell[r][c] = candyId;
      }
    }
    candyList[candyList.length] = {"id":candyId, "row":i, "col":j};
  }



  /**
   * キャンディボックスの再描写
   */
  var showBox = function(){
    // 設定
    var padding = 3;
    var cellsize = 50;
    var margin = 47;

    // キャンディの描写
    $("div.candybox div.candy").remove();
    for(var i = 0; i < candyList.length; i++){
      var candyPos = candyList[i];
      var candy = candies[candyPos.id];
      var $candy = $('<div>').addClass("candy");
      $candy.css("top", new Number(candyPos.row) * cellsize - margin + padding);
      $candy.css("left", new Number(candyPos.col) * cellsize - margin  + padding);
      $candy.css("height", new Number(candy.height) * cellsize - padding*2);
      $candy.css("width", new Number(candy.width) * cellsize - padding*2);
      $candy.addClass(category[candy.category]);
      $("div.candybox").append($candy);
    }
    
    // カウンタの再計算
    for(var i = 0; i < category.length; i++){
      countCategoryCandy[i] = 0;
    }
    for(var i = 0; i < candyList.length; i++){
      var candyPos = candyList[i];
      var candy = candies[candyPos.id];
      countCategoryCandy[candy.category]++;
    }
    console.log(countCategoryCandy);
  }



//===== 関数定義(初回のみ) =====

  /**
   * キャンディボックスの作成
   * 階層：タイル＜キャンディ＜判定セル
   */
  var makeDefaultCandyBox = function(){
    $("ul#candytile li").remove();
    $("ul#candycell li").remove();
    var bgcolorFlg = true;
    for(var i = 1; i <= 8; i++){
      for(var j = 1; j <= 8; j++){
        $("ul#candytile").append($('<li>').addClass("tile").attr("id","tile" + i + j).addClass(bgcolorFlg ? "" : "colored"));
        bgcolorFlg = !bgcolorFlg;
        $("ul#candycell").append($('<li>').addClass("cell").attr("id","cell" + i + j));
      }
      bgcolorFlg = !bgcolorFlg;
    }
  }

  /**
   * セレクトボックスの設定
   */
  var setSelectPet = function(){
      $('#selectpet').ddslick({
        data: summonPets,
        width: 200,
        imagePosition: "left",
        onSelected: function (data) {
          petId = data.selectedData.id | 0;
          setPaperCube();
          showBox();
        }
      });
//    for (var i = 0; i < summonPets.length; i++){
//      $("select#selectpet").append($('<option>').html(summonPets[i].name).val(i));
//    }
  }
  
  /**
   * ペットの情報を取得する。
   */
  var setPet = function(){
    summonPets = [
    {"id":"0",text:"ワンダ","paper":"11,14,15,16,18,32,38,42,57,61,67,81,83,84,85,88",imageSrc:"../img/candy/pet0.png",value:0},
    {"id":"1",text:"トリム","paper":"11,16,17,18,27,48,56,61,65,66,67,71,72,76,81,84",imageSrc:"../img/candy/pet0.png",value:1},
    {"id":"2",text:"サリィ","paper":"11,12,14,15,17,18,32,37,63,66,74,75,81,82,87,88",imageSrc:"../img/candy/pet0.png",value:2},
    {"id":"3",text:"マロン","paper":"14,15,18,22,27,28,32,48,51,67,71,72,77,81,84,85",imageSrc:"../img/candy/pet0.png",value:3},
    {"id":"4",text:"メロン","paper":"11,12,14,22,26,27,41,48,51,58,72,73,77,85,87,88",imageSrc:"../img/candy/pet0.png",value:4},
    {"id":"5",text:"ラッピー","paper":"12,17,22,27,42,47,51,53,56,58,62,67,74,75,84,85",imageSrc:"../img/candy/pet0.png",value:5},
    {"id":"6",text:"ヴィオラ","paper":"12,13,15,22,27,32,38,48,51,61,67,72,77,84,86,87",imageSrc:"../img/candy/pet0.png",value:6}
    ];
//    $.ajaxSetup({ async: false });
//    $.getJSON(jsonPetDataUrl,function(json) {
//      summonPets = json.pets;
//    });
    setSelectPet();
    setPaperCube();
  }

  /**
   * キャンディリストの設定
   */
  var setCandyList = function(){
    for (var i = 0; i < candies.length; i++){
     $("ul#candylist").append($('<li>').html(candies[i].name).val(i).attr("title",candies[i].title));
    }
    $("ul#candylist li[value=" + candyId + "]").addClass("active");
  }

  /**
   * キャンディの情報を取得する。
   */
  var setCandy = function(){
    candies = [
    {"id":"0","width":"2","height":"2","category":"0","name":"ブラストパフェ","title":"フォトンブラストゲージに応じてペットの攻撃威力が変動する。"},
    {"id":"1","width":"2","height":"2","category":"1","name":"ぎりぎりロール","title":"ペットがHP低下時にダメージを受けるとまれにHPが回復する。"},
    {"id":"2","width":"2","height":"2","category":"2","name":"スタミナクッキー","title":"ペットのHPが100上昇。"},
    {"id":"3","width":"2","height":"2","category":"3","name":"1段パンケーキ","title":"ペットの属性値が10上昇する。"},
    {"id":"4","width":"1","height":"1","category":"4","name":"ほのおのラムネ","title":"ペットの攻撃属性を炎属性に変更する。"},
    {"id":"5","width":"2","height":"2","category":"5","name":"リッチなクレープ","title":"出現するメセタの金額が5%増加する。"},
    {"id":"6","width":"1","height":"4","category":"6","name":"スピリタアメ","title":"PPが5上昇。"},
    {"id":"7","width":"2","height":"1","category":"7","name":"ボディサンド","title":"ペットの打撃防御が100上昇。"},
    {"id":"8","width":"4","height":"1","category":"6","name":"アビリティアメ","title":"ペットの全ての能力が5上昇。"},
    {"id":"9","width":"1","height":"1","category":"8","name":"スタミナグミ","title":"ペットのHPが10上昇。"}
    ];
    setCandyList();
  }

  /**
   * セルに登録されているキャンディがある場合、その要素順を返す。
   * なければ-1を返す。
   **/
  var getPutCandy = function(i,j){
    for(var k = 0; k < candyList.length; k++){
      var candyPos = candyList[k];
      var candy = candies[candyPos.id];
      for(var ii = new Number(candyPos.row); ii < new Number(candyPos.row)+new Number(candy.height); ii++){
        if(ii != i){
          continue;
        }
        for(var jj = new Number(candyPos.col); jj < new Number(candyPos.col)+new Number(candy.width); jj++){
          if(jj != j){
            continue;
          }
          return k;
        }
      }
    }
    return -1;
  }


//===== 初回実行時 =====

  // デフォルト値
  petId = 0;
  candyId = 0;

  // キャンディボックスの設定
  makeDefaultCandyBox();

  // ペットの設定
  setPet();

  // キャンディの設定
  setCandy();
  
  // キャンディ変更監視
  $(document).on("click","ul#candylist li",function(){
    candyId = $(this).val();
    $("ul#candylist li.active").removeClass("active");
    $(this).addClass("active");
  });

  // キャンディボックス左クリック監視
  $(document).on("click","ul#candycell li",function(){
    // セル取得
    var num = $(this).attr("id").replace("cell","");
    var i = Math.floor(new Number(num)/10);
    var j = new Number(num) - i*10;
    putCandy(i,j);
    showBox();
  });

  // キャンディボックス右クリック監視
  $(document).on("contextmenu","ul#candycell li",function(){
      // セル取得
    var num = $(this).attr("id").replace("cell","");
    var i = Math.floor(new Number(num)/10);
    var j = new Number(num) - i*10;
    // 該当するキャンディの要素順を取得
    var candyListIter = getPutCandy(i,j);
    if(candyListIter < 0){
      return;
    }
    candyList.splice(candyListIter,1);
    showBox();
    return false;
  });
});

