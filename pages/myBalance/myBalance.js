// pages/myBalance/myBalance.js
const app = getApp();
var id;
var s_id;
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
  onShow: function () {
    id = app.globalData.id
    s_id = app.globalData.s_id
    // 获取余额信息
    wx.request({
      url: app.globalData.requestUrl + 'api/?ctl=user&act=my_yue',
      data: {
        user_id: id,
        s_id: s_id
      },
      success: res => {
        this.setData({
          yue: res.data.data.yue,
          suoding_yue: res.data.data.suoding_yue,
          url: '../withdrawCash/withdrawCash?yue=' + res.data.data.yue
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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