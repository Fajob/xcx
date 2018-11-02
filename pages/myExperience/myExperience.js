// pages/myExperience/myExperience.js
const app = getApp();
let videoCtx = null;
var creditInfo = []
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expTypes: ['我的体验','我的参与'],
    id: 0,
    display: 'none',
    display1: 'block',
    has_new_comments: 0,
    pictureUrl: app.globalData.pictureUrl,
    requestUrl: app.globalData.requestUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    videoCtx = wx.createVideoContext('playVideo', this)
  }, 
  // 打开视频播放页
  play: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    this.setData({
      showurl: src,
      display: 'block',
      display1: 'none',
    })
    videoCtx.play();
  },
  // 关闭视频播放页
  hide: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    this.setData({
      display: 'none',
      display1: 'block',
    })
    videoCtx.pause();
    videoCtx.seek(0);
  },
  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var src1 = event.currentTarget.dataset.src1;//获取data-src
    var srcList = []
    if (src) {
      srcList[0] = this.data.requestUrl + src
    }
    if (src1) {
      srcList[1] = this.data.requestUrl + src1
    }
    var imgList = event.currentTarget.dataset.list//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: srcList // 需要预览的图片http链接列表
    })
  },
  // 体验详情
  goto: function (event) {
    var url = event.currentTarget.dataset.url
    var expid = event.currentTarget.dataset.expid
    wx.navigateTo({
      url: url,
    })
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=read_comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        exp_id: expid
      },
      success: res => {
        this.onShow()
      }
    })
  },
  toggle: function (e) {
    creditInfo = []
    page = 1
    this.setData({
      has_new_comments: 0
    })
    var ids = e.currentTarget.id;
    if(ids == 0){
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get_own',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          p: 1
        },
        success: res => {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
            creditInfos[i].time
              = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
            creditInfos[i].exp_module = '../experienceDetail/experienceDetail?select=' + creditInfos[i].exp_module + '&userExpDetail=' + JSON.stringify(creditInfos[i]);
            if (creditInfos[i].has_new_comment == 1) {
              this.setData({
                has_new_comments: 1
              })
            }
            if (creditInfos[i].img1 != '' || creditInfos[i].img2 != '' || creditInfos[i].img3 != '' || creditInfos[i].img4 != '' || creditInfos[i].img5 != null || creditInfos[i].img6 != null) {
              creditInfos[i].hasImg = true
            }
          }
          creditInfo = creditInfos
          this.setData({
            myExp: creditInfos,
            desc: res.data.desc
          })
        }
      })
    }else if(ids == 1){
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get_join',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          p: 1
        },
        success: res => {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
            creditInfos[i].time
              = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
            creditInfos[i].exp_module = '../experienceDetail/experienceDetail?select=' + creditInfos[i].exp_module + '&userExpDetail=' + JSON.stringify(creditInfos[i]);
            if (creditInfos[i].img1 != '' || creditInfos[i].img2 != '' || creditInfos[i].img3 != '' || creditInfos[i].img4 != '' || creditInfos[i].img5 != null || creditInfos[i].img6 != null) {
              creditInfos[i].hasImg = true
            }
          }
          creditInfo = creditInfos
          this.setData({
            myJoin: creditInfos
          })
        }
      })
    }
    this.setData({
      id: ids
    });
  },
  // 点赞
  like: function (e) {
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
          this.onShow()
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get_own',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: 1
      },
      success: res => {
        this.setData({
          has_new_comments: 0
        })
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].time
            = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
          creditInfos[i].exp_module = '../experienceDetail/experienceDetail?select=' + creditInfos[i].exp_module + '&userExpDetail=' + JSON.stringify(creditInfos[i]);
          if(creditInfos[i].has_new_comment == 1){
            this.setData({
              has_new_comments: 1
            })
          }
          if (creditInfos[i].img1 != '' || creditInfos[i].img2 != '' || creditInfos[i].img3 != '' || creditInfos[i].img4 != '' || creditInfos[i].img5 != null || creditInfos[i].img6 != null) {
            creditInfos[i].hasImg = true
          }
        }
        creditInfo = creditInfos
        this.setData({
          myExp: creditInfos,
          desc: res.data.desc
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    creditInfo = []
    page = 1
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page += 1
    if (this.data.id == 0) {
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get_own',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          p: page
        },
        success: res => {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
            creditInfos[i].time
              = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
            creditInfos[i].exp_module = '../experienceDetail/experienceDetail?select=' + creditInfos[i].exp_module + '&userExpDetail=' + JSON.stringify(creditInfos[i]);
            if (creditInfos[i].has_new_comment == 1) {
              this.setData({
                has_new_comments: 1
              })
            }
            if (creditInfos[i].img1 != '' || creditInfos[i].img2 != '' || creditInfos[i].img3 != '' || creditInfos[i].img4 != '' || creditInfos[i].img5 != null || creditInfos[i].img6 != null) {
              creditInfos[i].hasImg = true
            }
            creditInfo.push(creditInfos[i])
          }
          this.setData({
            myExp: creditInfo,
            desc: res.data.desc
          })
        }
      })
    } else if (this.data.id == 1) {
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=get_join',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          p: page
        },
        success: res => {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
            creditInfos[i].time
              = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
            creditInfos[i].exp_module = '../experienceDetail/experienceDetail?select=' + creditInfos[i].exp_module + '&userExpDetail=' + JSON.stringify(creditInfos[i]);
            if (creditInfos[i].img1 != '' || creditInfos[i].img2 != '' || creditInfos[i].img3 != '' || creditInfos[i].img4 != '' || creditInfos[i].img5 != null || creditInfos[i].img6 != null) {
              creditInfos[i].hasImg = true
            }
            creditInfo.push(creditInfos[i])
          }
          this.setData({
            myJoin: creditInfo
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})