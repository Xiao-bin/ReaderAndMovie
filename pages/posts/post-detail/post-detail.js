
var postsData = require('../../../data/data.js')
var app = getApp();
Page({
  data: {
    isPlayMusic: false
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var postId = options.id;
    this.setData({
      postId: postId,
      post_datail: postsData.postList[postId],
    })
    if (app.globalData.g_musicPostId === postId && app.globalData.g_isPlayMusic) {
      this.setData({
        isPlayMusic: true
      })
    }
    this.setCollected(postId);
    this.setMusicMonitor();
  },
  //收藏控制
  setCollected: function (postId) {
    var that = this;
    var postsCollected = wx.getStorageSync("posts_Collected");
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      that.setData({
        collected: postCollected
      })
    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_Collected', postsCollected);
    }
  },
  //总音乐开关的控制
  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
       // 若打开多个post-detail页面后，每个页面不会关闭，只会隐藏。则通过页面栈拿到
      if (currentPage.data.postId === that.data.postId) {
        // 当前页面的postid，只处理当前页面的音乐播放。
        if (app.globalData.g_musicPostId == that.data.postId) {
                   // 播放当前页面音乐才改变图标
          that.setData({
            isPlayMusic: true
          })
        }
      }
      app.globalData.g_isPlayMusic = true;
    });
    wx.onBackgroundAudioPause(function () {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.postId === that.data.postId) {
        if (app.globalData.g_musicPostId == that.data.postId) {
          that.setData({
            isPlayMusic: false
          })
        }
      }
      app.globalData.g_isPlayMusic = false;
    })
    wx.onBackgroundAudioStop(function () {
      app.globalData.g_isPlayMusic = false;
      that.setData({
        isPlayMusic: false
      })
    })
  },

  onCollectionTap: function (event) {
    // this.getStorageSync();
    this.getStorage();
  },

  //异步
  getStorage: function () {
    var that = this;
    wx.getStorage({
      key: 'posts_Collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.postId];
        postCollected = !postCollected;
        postsCollected[that.data.postId] = postCollected;
        // that.showModal(postsCollected, postCollected);
        that.showToast(postsCollected, postCollected);
      }
    })
  },
  //同步
  getStorageSync: function () {
    var postsCollected = wx.getStorageSync("posts_Collected");
    var postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;
    // this.showModal(postsCollected, postCollected);
    this.showToast(postsCollected, postCollected);
  },



  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏文章?" : "取消收藏文章？",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确定",
      confirmColor: "#000",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("posts_Collected", postsCollected);
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync("posts_Collected", postsCollected);
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },

  onShareTap: function () {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#333",
      success: function (res) {
        //res.cancel 点击取消按钮
        //res.tapIndex itemList的下标
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "用户是否点击取消按钮" + res.cancel + "现在没有分享功能"
        })
      }
    })
  },

  onMusicTap: function (event) {
    var postId = this.data.postId;
    var postData = postsData.postList[postId];
    var isPlayMusic = this.data.isPlayMusic;
    if (isPlayMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayMusic: false
      });
      app.globalData.g_isPlayMusic = false;
    }

    else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayMusic: true
      });
      app.globalData.g_musicPostId = this.data.postId;
      app.globalData.g_isPlayMusic = true;
    }
  },



  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})