// pages/detail/detail.js
const app = getApp();
var id;
var s_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = app.globalData.id
    s_id = app.globalData.s_id
    // 获取余额明细
    wx.request({
      url: app.globalData.requestUrl + 'api/?ctl=user&act=yue_mingxi',
      data: {
        user_id: id,
        s_id: s_id
      },
      success: res => {
        var time = require('../../utils/util.js');
        var withInfos = res.data.data;
        for (var i = 0; i < res.data.data.length; i++) {
          withInfos[i].date = time.formatTimeTwo(withInfos[i].date, "Y-M-D h:m:s");
        }
        this.setData({
          withInfo: withInfos
        })
      }
    })
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