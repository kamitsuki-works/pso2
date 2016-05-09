$(function() {

//===== マスタ情報 =====
  // ペットjsonパス
  var jsonPetDataUrl = "../data/pets.json";
  // 取得した全ペット情報
  var summonPets = [];
  // キャンディjsonパス
  var jsonCandyDataUrl = "../data/candy.json";
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
  }
  
  /**
   * ペットの情報を取得する。
   */
  var setPet = function(){
    $.ajax({
      url:jsonPetDataUrl,
      type:"get",
      dataType:"json",
      success:function(response){
        summonPets = response.pets;
        setSelectPet();
        setPaperCube();
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
        alert("データの読み込みに失敗しました！");
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
   * キャンディの情報を取得する。
   */
  var setCandy = function(){
    $.ajax({
      url:jsonCandyDataUrl,
      type:"get",
      dataType:"json",
      success:function(response){
        candies = response.candy;
        setCandyList();
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
        alert("データの読み込みに失敗しました！");
      }
    });
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

