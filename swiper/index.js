function Swiper(options, wrap) {
  this.wrap = wrap;
  this.contentList = options.contentList || [];
  this.autoChangeTime = options.autoChangeTime || 5000;
  this.type = options.type || "fade";
  this.isAuto = options.isAuto == undefined ? true : !!options.isAuto;
  this.showChangeBtn = options.showChangeBtn || "always";
  this.showSpots = options.showSpots == undefined ? true : !!options.showSpots;
  this.spotSize = options.spotSize || 5;
  this.spotPosition = options.spotPosition || "center";
  this.spotColor = options.spotColor || "red";
  this.width = options.width || $(wrap).width();
  this.height = options.height || $(wrap).height();
  this.len = this.contentList.length;
  this.nowIndex = 0;
  this.timer = null;
  this.lock = false;
}
Swiper.prototype.init = function () {
  this.createElement();
  this.initStyle();
  this.bindEvent();
  if (this.isAuto) {
    this.autoChange();
  }
};
Swiper.prototype.createElement = function () {
  var swiperWrapper = $('<div class="my-swiper-wrapper"></div>');
  var siwperItems = $('<ul class="my-swiper-items"></ul>');
  var leftBtn = $(
    '<div class="my-swiper-btn my-swiper-lbtn"><i class="iconfont">&#xe628;</i></div>'
  );
  var rightBtn = $(
    '<div class="my-swiper-btn my-swiper-rbtn"><i class="iconfont">&#xe625;</i></div>'
  );
  var spotsWrapper = $('<div class="my-swiper-spots"></div>');
  for (var i = 0; i < this.len; i++) {
    $('<li class="my-swiper-item"></li>')
      .html(this.contentList[i])
      .appendTo(siwperItems);
    $("<span></span>").appendTo(spotsWrapper);
  }
  if (this.type === "animate") {
    siwperItems.append(
      $('<li class="my-swiper-item"></li>').html(
        $(this.contentList[0]).clone(true)
      )
    );
  }
  switch (this.showChangeBtn) {
    case "hide":
      leftBtn.hide();
      rightBtn.hide();
      break;
    case "hover":
      leftBtn.hide();
      rightBtn.hide();
      swiperWrapper.hover(function () {
        leftBtn.show();
        rightBtn.show();
      }, function () {
        leftBtn.hide();
        rightBtn.hide();
      })
      break;
    default:
      break;
  }
  if (!this.showSpots) {
    spotsWrapper.hide()
  }
  swiperWrapper
    .append(siwperItems)
    .append(leftBtn)
    .append(rightBtn)
    .append(spotsWrapper)
    .appendTo(this.wrap)
    .addClass("my-swiper-wrapper_" + this.type);
};
Swiper.prototype.initStyle = function () {
  $(this.wrap)
    .find(".my-swiper-items")
    .css({
      width: this.type === "animate" ? this.width * (this.len + 1) : this.width,
      height: this.height,
    })
    .find(".my-swiper-item")
    .css({
      width: this.width,
      height: this.height,
    });
  if (this.type === "fade") {
    $(this.wrap).find(".my-swiper-item").eq(this.nowIndex).show();
  } else {
    $(this.wrap)
      .find(".my-swiper-items")
      .css({
        left: -this.nowIndex * this.width,
      });
  }

  $(this.wrap)
    .find(".my-swiper-spots ")
    .css({
      textAlign: this.spotPosition,
      display: this.showSpots ? 'block' : 'none',
    })
    .find("span")
    .css({
      width: this.spotSize,
      height: this.spotSize,
    })
    .eq(this.nowIndex % this.len)
    .css({
      backgroundColor: this.spotColor,
    });
};

Swiper.prototype.bindEvent = function () {
  var self = this;
  $(this.wrap)
    .find(".my-swiper-lbtn")
    .click(function () {
      if (self.lock) {
        return;
      }
      self.lock = true;
      if (self.type == "fade") {
        if (self.nowIndex === 0) {
          self.nowIndex = self.len - 1;
        } else {
          self.nowIndex--;
        }
        self.change();
      } else {
        if (self.nowIndex === 0) {
          $(self.wrap)
            .find(".my-swiper-items")
            .css({
              left: -self.len * self.width,
            });
          self.nowIndex = self.len - 1;
        } else {
          self.nowIndex--;
        }
        self.change();
      }
    });
  $(this.wrap)
    .find(".my-swiper-rbtn")
    .click(function () {
      if (self.lock) {
        return;
      }
      self.lock = true;
      if (self.type === "fade") {
        if (self.nowIndex === self.len - 1) {
          self.nowIndex = 0;
        } else {
          self.nowIndex++;
        }
        self.change();
      } else {
        if (self.nowIndex === self.len) {
          $(self.wrap).find(".my-swiper-items").css({
            left: 0,
          });
          self.nowIndex = 1;
        } else {
          self.nowIndex++;
        }
        self.change();
      }
    });
  $(this.wrap).find('.my-swiper-spots').on('mouseenter', 'span', function () {
    if (self.lock) {
      return;
    }
    self.lock = true;
    var index = $(this).index();
    self.nowIndex = index;
    self.change();
  });
  $(this.wrap).mouseenter(function () {
    clearInterval(self.timer);
  }).mouseleave(function () {
    if (self.isAuto) {
      self.autoChange();
    }
  })
};

// 切换图片效果
Swiper.prototype.change = function () {
  var self = this;
  if (this.type === "fade") {
    $(this.wrap).find(".my-swiper-item").fadeOut().eq(this.nowIndex).fadeIn(function () {
      self.lock = false;
    });
  } else {
    $(this.wrap)
      .find(".my-swiper-items")
      .animate({
        left: -this.nowIndex * this.width,
      }, function () {
        self.lock = false;
      });
  }
  $(this.wrap)
    .find(".my-swiper-spots > span")
    .css({
      backgroundColor: "rgba(255,255,255,.4)",
    })
    .eq(this.nowIndex % this.len)
    .css({
      backgroundColor: this.spotColor,
    });
};

// 自动轮播
Swiper.prototype.autoChange = function () {
  var self = this;
  clearInterval(this.timer);
  this.timer = setInterval(function () {
    $(self.wrap)
      .find(".my-swiper-rbtn").trigger('click');
  }, this.autoChangeTime)
}

// 给jq的实例对象扩展swiper方法用来添加轮播图
$.fn.extend({
  swiper: function (options) {
    // 存储当前轮播图的所有数据
    var obj = new Swiper(options, this);
    obj.init();
  },
});
