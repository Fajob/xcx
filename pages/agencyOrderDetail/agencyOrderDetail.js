// pages/agencyOrderDetail/agencyOrderDetail.js
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
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    if (options.agencyOrderDetail) {
      var time = require('../../utils/util.js');
      var creditInfos = JSON.parse(options.agencyOrderDetail)
      creditInfos.time = time.formatTimeTwo(creditInfos.time, "Y-M-D h:m:s");
      var package_sn = creditInfos.package_sn
      package_sn = package_sn.split(':')
      switch (package_sn[0]) {
        case 'shentong':
          package_sn[0] = '申通'
          break;
        case 'shunfeng':
          package_sn[0] = '顺丰'
          break;
        case 'yuantong':
          package_sn[0] = '圆通速递'
          break;
        case 'yunda':
          package_sn[0] = '韵达快运'
          break;
        case 'zhongtong':
          package_sn[0] = '中通速递'
          break;
        default:
          break;
      }
      creditInfos.package_sn = '('+package_sn[0]+')'+package_sn[1]
      this.setData({
        agencyOrderDetail: creditInfos
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