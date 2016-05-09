$(function() {

//===== マスタ情報 =====
  // jsonパス
  var jsonCandyDataUrl = "../data/candy.json";
  // 取得した全ペット情報
  var summonPets = [];
  // 取得した全キャンディ情報
  var candies = [];
  // カテゴリ情報
  var category = ["parfait","roll","cookie","pancake","lemonsoda","crepe","lollipop","sand","gummy"];
  var categoryName = ["パフェ","ロール","クッキー","ケーキ","ラムネ","クレープ","アメ","サンド","グミ"];
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

  // パラメータ入力
  var param;

//===== 関数定義(常時展開) =====

  /**
   * ペーパーキューブの設定
   */
  var setPaperCube = function(){
    // ペーパーセルの解除
    $("li.tile.paper").removeClass("paper");
    $("li.cell.paper").removeClass("paper");
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
    for(var r = i; r < i+new Number(candy.height); r++){
      // 枠外
      if(r<1 || 8<r){
        return;
      }
      for(var c = j; c < j+new Number(candy.width); c++){
        // 枠外
        if(c<1 || 8<c){
          return;
        }
        // ペーパーキューブ
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
    for(var i = 0; i < category.length; i++){
      $("div.candyname."+category[i] + " > .right").html(countCategoryCandy[i] +" / "+maxCategoryCandy[i]);
    }
    
    // セット済みキャンディリストの描写
    var setCandyIdList = []
    for(var i = 0; i < candies.length; i++){
      setCandyIdList[candies[i].id] = 0;
    }
    for(var i = 0; i < candyList.length; i++){
      var candyPos = candyList[i];
      setCandyIdList[candyPos.id]++;
    }
    $("ul.settingcandy").html("");
    for(var i = 0; i < candies.length; i++){
      var id = $($("ul.candylist li")[i]).val();
      if(setCandyIdList[id] > 0){
        var $setting = $("<li>").html(candies[id].name);
        $setting.append($("<span>").addClass("right").html("×" +setCandyIdList[id]))
        $("ul.settingcandy").append($setting);
      }
    }
    
    // URLの表示
    var url = window.location.protocol+window.location.hostname+window.location.pathname;
    var param = "?" + petId;
    for(var i = 0; i < candyList.length; i++){
      param += candyList[i].id<10 ? "0"+candyList[i].id : candyList[i].id;
      param += candyList[i].row;
      param += candyList[i].col;
    }
    $("input.url").val(url+param);
  }

  /**
   * パラメータのキャンディセット
   */
  var setParamCandies = function(){
    if(param.length < 5){
      return;
    }

    for(var i = 0; i <= (param.length-1)/4 -1; i++){
      var id = Number(param[i*4+1]+param[i*4+2]);
      var x = Number(param[i*4+3]);
      var y = Number(param[i*4+4]);
      if(id >= 0 && 0<x && x<9 && 0<y && y<9){
        candyId = id;
        putCandy(x,y);
      }
    }
    candyId = 1;
    showBox();
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
        defaultSelectedIndex:petId,
        onSelected: function (data) {
          petId = data.selectedData.id | 0;
          setPaperCube();
          showBox();
        }
      });
  }

  /**
   * キャンディリストの設定
   */
  var setCandyList = function(){
    for (var i = 0; i < category.length; i++){
      // キャンディリスト枠
      var $candyset = $('<div>').addClass("candyset").addClass(category[i]);
      $candyset.append($('<div>').addClass("candyset-header").html(categoryName[i]));
      $candyset.append($('<ul>').addClass("candylist").attr("id",category[i]+"list"));
      $("div.candysetlist").append($candyset);
      // キャンディカウント
      var $candyname = $('<div>').addClass("candyname").addClass(category[i]).html(categoryName[i]);
      $candyname.append($('<span>').addClass("right").html("0 / " + maxCategoryCandy[i]));
      $("div.candycount").append($candyname);
      
    }
    
    // キャンディのセット
    for (var i = 0; i < candies.length; i++){
     var $li = $('<li>').html(candies[i].name).val(candies[i].id).attr("title",candies[i].title);
     $li.append( $('<span>').html(candies[i].width +"×"+ candies[i].height).addClass("right"));
     $("ul.candylist#" + category[candies[i].category] + "list").append($li);
    }
    $("ul.candylist li[value=" + candyId + "]").addClass("active");
  }

  /**
   * ペットとキャンディの情報を取得する。
   */
  var setCandy = function(){

    $.ajax({
      url:jsonCandyDataUrl,
      type:"get",
      dataType:"json",
      success:function(response){
        summonPets = response.pets;
        candies = response.candy;
        setSelectPet();
        setPaperCube();
        setCandyList();
        setParamCandies();
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
        alert("データの読み込みに失敗しました！");
      }
    });
/*
        candies = [
  {"id":"0","width":"2","height":"2","category":"0","name":"ブラストパフェ","title":"フォトンブラストゲージに応じてペットの攻撃威力が変動する。"},
  {"id":"1","width":"2","height":"2","category":"0","name":"メガトンパフェ","title":"ペットが強敵に与えるダメージが上昇する。"},
  {"id":"2","width":"2","height":"2","category":"0","name":"ひっさつパフェ","title":"ペットの攻撃のクリティカル時のダメージが上昇する。"},
  {"id":"3","width":"2","height":"2","category":"0","name":"ぴったりパフェ","title":"ペットが弱点属性で攻撃した時のダメージが上昇。"},
  {"id":"4","width":"2","height":"2","category":"0","name":"がむしゃらパフェ","title":"ペットPA使用時にPP消費量が増加し威力が上昇。"},
  {"id":"5","width":"2","height":"2","category":"0","name":"はりきりパフェ","title":"ペットの通常攻撃のダメージが上昇する。"},
  {"id":"6","width":"2","height":"2","category":"1","name":"ぎりぎりロール","title":"ペットがHP低下時にダメージを受けるとまれにHPが回復する。"},
  {"id":"7","width":"2","height":"2","category":"1","name":"ふんばりロール","title":"ペットのHPが半分以下になった時、一定時間被ダメージが減少する。"},
  {"id":"8","width":"2","height":"2","category":"1","name":"おうえんロール","title":"シフタでのシンパシー発動時、ペットの攻撃力、防御力、クリティカル率が強化される。"},
  {"id":"9","width":"2","height":"2","category":"1","name":"むてきロール","title":"フォトンブラストゲージが満タンで一定時間ペットが無敵になる。"},
  {"id":"10","width":"2","height":"2","category":"1","name":"しっかりロール","title":"ペットが戦闘不能から復帰するまでの時間が短縮される。"},
  {"id":"11","width":"2","height":"2","category":"1","name":"へんかんロール","title":"ペットの各防御力の一部を対応する攻撃力に変換する。"},
  {"id":"12","width":"2","height":"2","category":"1","name":"みがわりロール","title":"アルターエゴ発動時、消費PPが減少する。"},
  {"id":"13","width":"2","height":"2","category":"1","name":"つよがりロール","title":"ペットが強敵から受けるダメージが減少する。"},
  {"id":"14","width":"2","height":"2","category":"2","name":"スタミナクッキー","title":"ペットのHPが100上昇。"},
  {"id":"15","width":"2","height":"2","category":"2","name":"スピリタクッキー","title":"PPが5上昇。"},
  {"id":"16","width":"2","height":"2","category":"2","name":"パワークッキー","title":"ペットの打撃力が35上昇。"},
  {"id":"17","width":"2","height":"2","category":"2","name":"シュートクッキー","title":"ペットの射撃力が35上昇。"},
  {"id":"18","width":"2","height":"2","category":"2","name":"テクニクッキー","title":"ペットの法撃力が35上昇。"},
  {"id":"19","width":"2","height":"2","category":"2","name":"アームクッキー","title":"ペットの技量が40上昇。"},
  {"id":"20","width":"2","height":"2","category":"3","name":"1段パンケーキ","title":"ペットの属性値が10上昇する。"},
  {"id":"21","width":"2","height":"2","category":"3","name":"2段パンケーキ","title":"ペットの属性値が20上昇する。"},
  {"id":"22","width":"2","height":"2","category":"3","name":"3段パンケーキ","title":"ペットの属性値が30上昇する。"},
  {"id":"23","width":"1","height":"1","category":"4","name":"ほのおのラムネ","title":"ペットの攻撃属性を炎属性に変更する。"},
  {"id":"24","width":"1","height":"1","category":"4","name":"こおりのラムネ","title":"ペットの攻撃属性を氷属性に変更する。"},
  {"id":"25","width":"1","height":"1","category":"4","name":"かみなりのラムネ","title":"ペットの攻撃属性を雷属性に変更する。"},
  {"id":"26","width":"1","height":"1","category":"4","name":"かぜのラムネ","title":"ペットの攻撃属性を風属性に変更する。"},
  {"id":"27","width":"1","height":"1","category":"4","name":"ひかりのラムネ","title":"ペットの攻撃属性を光属性に変更する。"},
  {"id":"28","width":"1","height":"1","category":"4","name":"やみのラムネ","title":"ペットの攻撃属性を闇属性に変更する。"},
  {"id":"29","width":"2","height":"2","category":"5","name":"リッチなクレープ","title":"出現するメセタの金額が5%増加する。"},
  {"id":"30","width":"2","height":"2","category":"5","name":"おとなのクレープ","title":"獲得経験値が5%増加。"},
  {"id":"31","width":"2","height":"2","category":"5","name":"ラッキークレープ","title":"レアドロップ倍率が5%増加。"},
  {"id":"32","width":"1","height":"4","category":"6","name":"スピリタアメ","title":"PPが5上昇。"},
  {"id":"33","width":"4","height":"1","category":"6","name":"ブロウレジストアメ","title":"ペットの打撃耐性が5%上昇。。"},
  {"id":"34","width":"4","height":"1","category":"6","name":"ショットレジストアメ","title":"ペットの射撃耐性が5%上昇。"},
  {"id":"35","width":"4","height":"1","category":"6","name":"マインドレジストアメ","title":"ペットの法撃耐性が5%上昇。"},
  {"id":"36","width":"4","height":"1","category":"6","name":"アビリティアメ","title":"ペットの全ての能力が5上昇。"},
  {"id":"37","width":"2","height":"1","category":"7","name":"ボディサンド","title":"ペットの打撃防御が100上昇。"},
  {"id":"38","width":"2","height":"1","category":"7","name":"リアクトサンド","title":"ペットの射撃防御が100上昇。"},
  {"id":"39","width":"2","height":"1","category":"7","name":"マインドサンド","title":"ペットの法撃防御が100上昇。"},
  {"id":"40","width":"1","height":"1","category":"8","name":"スタミナグミ","title":"ペットのHPが10上昇。"}
];
   summonPets = [{"id":"0","text":"ワンダ","paper":"11,14,15,16,18,32,38,42,57,61,67,81,83,84,85,88","imageSrc":"../img/candy/pet0.png","value":0},
    {"id":"1","text":"トリム","paper":"11,16,17,18,27,48,56,61,65,66,67,71,72,76,81,84","imageSrc":"../img/candy/pet1.png","value":1},
    {"id":"2","text":"サリィ","paper":"11,12,14,15,17,18,32,37,63,66,74,75,81,82,87,88","imageSrc":"../img/candy/pet2.png","value":2},
    {"id":"3","text":"マロン","paper":"14,15,18,22,27,28,32,48,51,67,71,72,77,81,84,85","imageSrc":"../img/candy/pet3.png","value":3},
    {"id":"4","text":"メロン","paper":"11,12,14,22,26,27,41,48,51,58,72,73,77,85,87,88","imageSrc":"../img/candy/pet4.png","value":4},
    {"id":"5","text":"ラッピー","paper":"12,17,22,27,42,47,51,53,56,58,62,67,74,75,84,85","imageSrc":"../img/candy/pet5.png","value":5},
    {"id":"6","text":"ヴィオラ","paper":"12,13,15,22,27,32,38,48,51,61,67,72,77,84,86,87","imageSrc":"../img/candy/pet6.png","value":6}];
        setSelectPet();
        setPaperCube();
        setCandyList();
        setParamCandies();
*/
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

  // パラメータ取得
  param = location.search.substring(1);

  // デフォルト値
  petId = (param.length>0 && Number(param[0])>0) ? Number(param[0]) : 0;
  candyId = 0;

  // キャンディボックスの設定
  makeDefaultCandyBox();

  // ペットとキャンディの設定
  setCandy();
  
  // キャンディ変更監視
  $(document).on("click","ul.candylist li",function(){
    candyId = $(this).val();
    $("ul.candylist li.active").removeClass("active");
    $(this).addClass("active");
  });
  $(document).on("click","div.candyset-header",function(){
    $(this).parent("div.candyset").find("ul.candylist").slideToggle();
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

