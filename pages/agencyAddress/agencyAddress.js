// pages/agencyAddress/agencyAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    array: ['请选择', '枕头', '药包'],
    region: ['选择省', '市', '区'],
    color: 'gray',
    arrayColor: 'gray',
    pictureUrl: app.globalData.pictureUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '订单发货',
    })
  },
  // 更换所在地区
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value,
      color: 'black'
    })
  },
  // 提交发货
  ship: function(e) {
    var address = this.data.region[0] + this.data.region[1] + this.data.region[2]
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=send_package',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        z_num: e.detail.value.z_num,
        y_num: e.detail.value.y_num,
        address: address,
        address_1: e.detail.value.address_1,
        reciver_name: e.detail.value.rName,
        reciver_mobile: e.detail.value.rMobile
      },
      success: res => {
        if (res.data.status) {
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
        } else {
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