(function() {
  $(function() {
    var check, data, dice, isDouble, isStraight, lose, simulating, v, vsdata, win;
    vsdata = [
      {
        name: 'モア',
        dice: 1
      }, {
        name: 'ジェネ',
        dice: 2
      }, {
        name: 'アネット',
        dice: 3
      }, {
        name: 'ブルーノ',
        dice: 3
      }, {
        name: 'セラフィ',
        dice: 3
      }
    ];
    dice = function(n) {
      var d, i, j, ref;
      d = [];
      for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        d.push([1, 2, 3, 4, 5, 6][Math.floor(Math.random() * 6)]);
      }
      return d;
    };
    check = function(e, p) {
      var esum, i, j, psum;
      esum = e.reduce(function(a, b) {
        return a + b;
      });
      psum = p.reduce(function(a, b) {
        return a + b;
      });
      for (i = j = 1; j <= 6; i = ++j) {
        if (e.length === 3 && e.every(function(n) {
          return n === i;
        })) {
          esum = i * 100;
        }
        if (p.every(function(n) {
          return n === i;
        })) {
          psum = i * 100;
        }
      }
      if (psum < esum) {
        return 0;
      }
      if (psum === esum) {
        return check(dice(e.length), dice(p.length));
      }
      if (psum >= 100) {
        v.winf++;
        return 11;
      }
      if (isStraight(p)) {
        v.wins++;
        return 4;
      }
      if (isDouble(p)) {
        v.wind++;
        return 3;
      }
      v.winn++;
      return 2;
    };
    isStraight = function(p) {
      var ary, fi, i, j;
      ary = [];
      for (i = j = 1; j <= 6; i = ++j) {
        ary.push(p.includes(i));
      }
      while (!ary[0]) {
        ary.shift();
      }
      fi = ary.indexOf(false);
      return fi === -1 || fi > 2;
    };
    isDouble = function(p) {
      if (p[0] === p[1]) {
        return true;
      }
      if (p[0] === p[2]) {
        return true;
      }
      return p[1] === p[2];
    };
    win = function(num) {
      if (num === 0) {
        v.win0++;
      }
      if (num === 1) {
        v.win1++;
      }
      if (num === 2) {
        v.win2++;
      }
      if (num === 3) {
        v.win3++;
      }
      if (num === 4) {
        v.win4++;
      }
    };
    lose = function(num) {
      if (num === 0) {
        v.lose0++;
      }
      if (num === 1) {
        v.lose1++;
      }
      if (num === 2) {
        v.lose2++;
      }
      if (num === 3) {
        v.lose3++;
      }
      if (num === 4) {
        v.lose4++;
      }
      v.count++;
    };
    data = function() {
      return {
        count: 0,
        now: 0,
        win0: 0,
        win1: 0,
        win2: 0,
        win3: 0,
        win4: 0,
        lose0: 0,
        lose1: 0,
        lose2: 0,
        lose3: 0,
        lose4: 0,
        winf: 0,
        wins: 0,
        wind: 0,
        winn: 0,
        share_base: "https://twitter.com/share?url=https%3A%2F%2Fgoo.gl%2Fvv8279&related=&hashtags=フォトンダイスシミュレータ%2CPSO2es&text="
      };
    };
    v = new Vue({
      el: '#result',
      data: data,
      computed: {
        share: function() {
          if (this.count === 0) {
            return this.share_base;
          } else {
            return this.share_base + this.now + "LCに到達するまで" + Math.ceil(this.count / 3) + "日かかりました。";
          }
        }
      }
    });
    simulating = false;
    $(document).on('change', '#refund', function() {
      $('#vs').prop('disabled', $(this).val() === "1" ? false : true);
      return $('#lc').prop('disabled', $(this).val() === "2" ? false : true);
    });
    $(document).on('click', '#descbtn', function() {
      return $('#description').slideToggle();
    });
    return $(document).on('click', '.start', function() {
      var blc, lc, mag, mvs, now, output, target, vs, vs_cnt;
      $('.input').removeClass('err');
      now = new Number($('#now').val());
      target = new Number($('#target').val());
      blc = new Number($('#lc').val());
      mvs = 4;
      if (isNaN(now)) {
        $('.input.now').addClass('err');
      }
      if (isNaN(target)) {
        $('.input.target').addClass('err');
      }
      if ($('#refund').val() === "1") {
        mvs = new Number($('#vs').val());
        if (!(0 <= mvs && mvs <= 4)) {
          mvs = 4;
        }
      }
      if ($('#refund').val() === "2") {
        if (isNaN(blc)) {
          $('.input.lc').addClass('err');
        }
      } else {
        blc = target;
      }
      if (isNaN(now) || isNaN(target) || isNaN(blc)) {
        return;
      }
      v.count = 0;
      v.now = now;
      v.win0 = 0;
      v.win1 = 0;
      v.win2 = 0;
      v.win3 = 0;
      v.win4 = 0;
      v.lose0 = 0;
      v.lose1 = 0;
      v.lose2 = 0;
      v.lose3 = 0;
      v.lose4 = 0;
      v.winf = 0;
      v.wins = 0;
      v.wind = 0;
      v.winn = 0;
      vs_cnt = 0;
      lc = 0;
      output = $('#clog').prop('checked');
      while (v.now < target && v.count < 9999) {
        vs = vsdata[vs_cnt];
        var dt = new Date();
        var apd = []
        if(dt.getMonth() === 3 && dt.getDate() === 1){
          apd.push(6);
          apd.push(6);
          apd.push(6);
        } else {
          apd = dice(3);
        }
        mag = check(dice(vs.dice), apd);
        if (mag === 0) {
          if (output) {
            console.log(vs.name + "に負けました。");
          }
          lose(vs_cnt);
          lc = 0;
          vs_cnt = 0;
          continue;
        }
        win(vs_cnt);
        if (vs_cnt === 0) {
          lc = 100 * (mag - 1);
        } else {
          lc *= mag;
        }
        if (output) {
          console.log(vs.name + "に勝ちました。獲得LC:" + lc);
        }
        if (v.now + lc >= target || lc >= blc || vs_cnt >= mvs) {
          v.now += lc;
          if (output) {
            console.log("獲得LCを清算します。現在LC：" + v.now + "(+" + lc + ")");
          }
          vs_cnt = 0;
          v.count++;
          continue;
        }
        vs_cnt++;
      }
    });
  });

}).call(this);
