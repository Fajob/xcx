// pages/commentList/commentList.js
const app = getApp()
var creditInfo = []
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: app.globalData.requestUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = []//获取data-list
    if (event.currentTarget.dataset.img1) {
      imgList.push(this.data.requestUrl+event.currentTarget.dataset.img1)
    }
    if (event.currentTarget.dataset.img2) {
      imgList.push(this.data.requestUrl+event.currentTarget.dataset.img2)
    }
    if (event.currentTarget.dataset.img3) {
      imgList.push(this.data.requestUrl+event.currentTarget.dataset.img3)
    }
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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
      url: app.globalData.requestUrl + 'api/index.php?ctl=order&act=get_comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        deal_id: 60,
        p: 1
      },
      success: res => {
        if (res.data.status) {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].time
            = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
          }
          creditInfo = creditInfos
          this.setData({
            comments: creditInfos
          })
        } else {
          console.log(res.data.msg)
        }
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
    creditInfo = []
    page = 1
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
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=order&act=get_comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        deal_id: 60,
        p: page
      },
      success: res => {
        if (res.data.status) {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].time
            = time.formatTimeTwo(creditInfos[i].time, "Y/M/D h:m");
            creditInfo.push(creditInfos[i])
          }
          this.setData({
            comments: creditInfo
          })
        } else {
          console.log(res.data.msg)
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})