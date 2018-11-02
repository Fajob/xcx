// pages/stocks/stocks.js
const app = getApp()
var creditInfo = []
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=get_order',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: 1
      },
      success: res => {
        this.setData({
          z_total_num: res.data.z_total_num,
          y_total_num: res.data.y_total_num,
          z_left_num: res.data.user_info.z_num,
          y_left_num: res.data.user_info.y_num
        })
        var creditInfos = res.data.data
        var time = require('../../utils/util.js')
        for(var i=0;i<creditInfos.length;i++){
          creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time,'Y/M/D')
        }
        creditInfo = creditInfos
        this.setData({
          order_detail: creditInfos
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
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=get_order',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: page
      },
      success: res => {
        var creditInfos = res.data.data
        var time = require('../../utils/util.js')
        for (var i = 0; i < creditInfos.length; i++) {
          creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time, 'Y/M/D')
          creditInfo.push(creditInfos[i])
        }
        this.setData({
          order_detail: creditInfo
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})