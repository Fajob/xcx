// pages/experienceDetail/experienceDetail.js
const app = getApp();
let videoCtx = null;
var creditInfo = []
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: '',
    pictureUrl: app.globalData.pictureUrl,
    display: 'none',
    reply: 0,
    requestUrl: app.globalData.requestUrl,
    preimg_video: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.userExpDetail) {
      this.setData({
        userExpDetail: JSON.parse(options.userExpDetail)
      })
    }
    videoCtx = wx.createVideoContext('playVideo', this)
  },
  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var srcList = []
    if (this.data.userExpDetail.img1){
      srcList.push(this.data.requestUrl + this.data.userExpDetail.img1)
    }
    if (this.data.userExpDetail.img2) {
      srcList.push(this.data.requestUrl + this.data.userExpDetail.img2)
    }
    if (this.data.userExpDetail.img3) {
      srcList.push(this.data.requestUrl + this.data.userExpDetail.img3)
    }
    if (this.data.userExpDetail.img4) {
      srcList.push(this.data.requestUrl + this.data.userExpDetail.img4)
    }
    if (this.data.userExpDetail.img5) {
      srcList.push(this.data.requestUrl + this.data.userExpDetail.img5)
    }
    if (this.data.userExpDetail.img6) {
      srcList.push(this.data.requestUrl + this.data.userExpDetail.img6)
    }
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: srcList // 需要预览的图片http链接列表
    })
  },
  // 打开视频播放页
  play: function(e) {
    this.setData({
      preimg_video: false,
      showUrl: e.currentTarget.dataset.video
    })
  },
  // 视频播放完毕
  showPreimg: function(){
    this.setData({
      preimg_video: true,
    })
  },
  // 关闭视频播放页
  hide: function(e) {
    this.setData({
      display: 'none',
    })
    videoCtx.pause();
    videoCtx.seek(0);
  },
  // 发表评论
  send: function(e) {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        exp_id: this.data.userExpDetail.id,
        p_id: 0,
        contents: e.detail.value.sendComment,
      },
      success: res => {
        if (res.data.status) {
          this.setData({
            val: ''
          })
          this.onShow()
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '服务器返回一个错误',
          icon: 'none',
        })
      }
    })
  },
  // 获取评论对象
  getPlaceholder: function(e) {
    this.setData({
      reply: 1,
      replyPlaceholder: '回复 ' + e.currentTarget.dataset.nick,
      replyCommentId: e.currentTarget.dataset.commentid
    })
  },
  // 取消回复
  replyCancel: function() {
    this.setData({
      reply: 0,
      vals: ''
    })
  },
  // 发送回复
  replySend: function(e) {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        exp_id: this.data.userExpDetail.id,
        p_id: this.data.replyCommentId,
        contents: e.detail.value.sendComment,
      },
      success: res => {
        if (res.data.status) {
          this.setData({
            vals: ''
          })
          this.onShow()
          this.setData({
            reply: 0
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '服务器返回一个错误',
          icon: 'none',
        })
      }
    })
  },
  getReply: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    // 获取帖子评论
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get_comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        exp_id: that.data.userExpDetail.id,
        p: 1
      },
      success: res => {
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        var com = new Array()
        for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
        }
        for (var i = 0; i < res.data.data.length; i++) {
          var comments = new Array()
          if (creditInfos[i].p_id == 0) {
            comments.push(creditInfos[i])
            for (var j = 0; j < res.data.data.length; j++) {
              if (creditInfos[i].id == creditInfos[j].p_id) {
                comments.push(creditInfos[j])
              }
            }
          }
          if (comments.length != 0) {
            com.push(comments)
          }
        }
        creditInfo = com
        this.setData({
          comments: com
        })
      }
    })
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
    page = 1
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    page += 1
    var that = this
    // 获取更多帖子评论
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get_comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        exp_id: that.data.userExpDetail.id,
        p: page
      },
      success: res => {
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        var com = new Array()
        for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
        }
        for (var i = 0; i < res.data.data.length; i++) {
          var comments = new Array()
          if (creditInfos[i].p_id == 0) {
            comments.push(creditInfos[i])
            for (var j = 0; j < res.data.data.length; j++) {
              if (creditInfos[i].id == creditInfos[j].p_id) {
                comments.push(creditInfos[j])
              }
            }
          }
          if (comments.length != 0) {
            com.push(comments)
          }
          creditInfo.push(com[i])
        }
        this.setData({
          comments: creditInfo
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})