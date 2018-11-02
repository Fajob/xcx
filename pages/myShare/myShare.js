// pages/myShare/myShare.js
const app = getApp();
var creditInfo = []
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictureUrl: app.globalData.pictureUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=my_zhitui',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: 1
      },
      success: res => {
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        if (res.data.data) {
          for (var i = 0; i < res.data.data.length; i++) {
            creditInfos[i].c_time = time.formatTimeTwo(creditInfos[i].c_time, "Y/M/D h:m");
          }
          creditInfo = creditInfos
          this.setData({
            shareList: creditInfos,
            total_count: res.data.total_count
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var creditInfo = []
    var page = 1
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    page += 1
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=my_zhitui',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: page
      },
      success: res => {
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        for (var i = 0; i < res.data.data.length; i++) {
          creditInfos.data[i].c_time = time.formatTimeTwo(creditInfos.data[i].c_time, "Y/M/D h:m");
          creditInfo.push(creditInfos[i])
        }
        this.setData({
          shareList: creditInfo
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})