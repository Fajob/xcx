// pages/withdrawCash/withdrapCash.js
const app = getApp()
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
    if (options.yue) {
      this.setData({
        yue: options.yue
      })
    }
  },
  withdrawCash: function(e) {
    var cash = e.detail.value.cash
    var status = cash % 100
    if (e.detail.value.cash && status == 0 && cash < this.data.yue && cash > 0) {
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=user&act=do_tixian',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          cash: e.detail.value.cash
        },
        success: res => {
          if (res.data.status) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000
            })
            wx.redirectTo({
              url: '/pages/withdrawDetail/withdrawDetail',
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
        fali: res => {
          wx.showToast({
            title: '服务器返回一个错误',
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的提现金额',
        icon: 'none'
      })
    }
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