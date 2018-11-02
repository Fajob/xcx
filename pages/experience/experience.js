// pages/experience/experience.js
const app = getApp()
let videoCtx = [];
var page = 1
var creditInfo = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display: 'none',
    display1: 'block',
    pictureUrl: app.globalData.pictureUrl,
    requestUrl: app.globalData.requestUrl,
    userExp: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    preimg_video: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.hideShareMenu()
  },
  // 点赞
  like: function(e) {
    var i = e.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=rate',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        exp_id: i
      },
      success: res => {
        if (res.data.status == true) {
          this.getUserExp()
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        }
      },
      fail: function() {
        wx.showToast({
          icon: 'none',
          title: '服务器返回一个错误',
        })
      }
    })
  },
  // 播放视频
  play: function (e) {
    var preimg_video = e.currentTarget.dataset.id
    this.setData({
      preimg_video: preimg_video,
      showUrl: e.currentTarget.dataset.video
    })
  },
  // 视频播放结束后
  showPreimg: function(){
    this.setData({
      preimg_video: -1
    })
  },
  // 关闭视频播放页
  hide: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    this.setData({
      display: 'none',
      display1: 'block',
    })
    videoCtx.pause();
    videoCtx.seek(0);
  },
  //图片点击事件
  imgYu: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var src1 = event.currentTarget.dataset.src1; //获取data-src
    var srcList = []
    if (src) {
      srcList[0] = this.data.requestUrl + src
    }
    if (src1) {
      srcList[1] = this.data.requestUrl + src1
    }
    var imgList = event.currentTarget.dataset.list //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: srcList // 需要预览的图片http链接列表
    })
  },
  // 跳转页面
  goto: function(event) {
    var url = event.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 获取用户体验
  getUserExp: function() {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: 1
      },
      success: res => {
        if (res.data.status) {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
            creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
            creditInfos[i].exp_module = '../experienceDetail/experienceDetail?select=' + creditInfos[i].exp_module + '&userExpDetail=' + JSON.stringify(creditInfos[i]);
            if (creditInfos[i].img1 != '' || creditInfos[i].img2 != '' || creditInfos[i].img3 != '' || creditInfos[i].img4 != '' || creditInfos[i].img5 != null || creditInfos[i].img6 != null) {
              creditInfos[i].hasImg = true
            }
          }
          creditInfo = creditInfos
          this.setData({
            userExp: creditInfos
          })
          wx.stopPullDownRefresh()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '服务器返回一个错误',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserExp()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    creditInfo = []
    page = 1
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    creditInfo = []
    page = 1
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    page += 1
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: page
      },
      success: res => {
        if(res.data.status){
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
          creditInfos[i].exp_module = '../experienceDetail/experienceDetail?select=' + creditInfos[i].exp_module + '&userExpDetail=' + JSON.stringify(creditInfos[i]);
          if (creditInfos[i].img1 != '' || creditInfos[i].img2 != '' || creditInfos[i].img3 != '' || creditInfos[i].img4 != '' || creditInfos[i].img5 != null || creditInfos[i].img6 != null) {
            creditInfos[i].hasImg = true
          }
          creditInfo.push(creditInfos[i])
        }
        this.setData({
          userExp: creditInfo
        })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function(){
        wx.showToast({
          title: '服务器返回一个错误',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    var that = this
    var index = e.target.dataset.share
    return {
      path: '/pages/index/index?openId=' + app.globalData.openid,
      success: function(res) {
        wx.request({
          url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=share',
          header: app.globalData.header,
          data: {
            user_id: app.globalData.openid,
            exp_id: index
          },
          success: res => {
            that.getUserExp()
          }
        })
      }
    }
  }
})