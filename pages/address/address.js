// pages/address/address.js
const app = getApp()
var id;
var s_id;
var _type = 4;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictureUrl: app.globalData.pictureUrl,
    src: 'uncheck.png',
    isDefault: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = app.globalData.openid
    s_id = app.globalData.s_id
    wx.setNavigationBarTitle({
      title: '收货地址',
    })
    if (options.type) {
      _type = options.type
    }
  },
  // 设置默认
  defaultAddress: function(e) {
    var obj = e.currentTarget.dataset;
    if (obj.default == 1) {
      return false;
    } else {
      wx.request({
        url: app.globalData.requestUrl + "api/?ctl=user&act=update_address",
        data: {
          user_id: id,
          s_id: s_id,
          address_id: obj.id,
          address: obj.address,
          address1: obj.adds,
          user_name: obj.name,
          user_phone: obj.phone,
          is_default: 1
        },
        success: res => {
          if (_type == 3) {
            wx.navigateBack()
          } else {
            this.onShow();
          }
        }
      })
    }
  },
  // 添加地址
  editAddress: function(e) {
    var obj = e.currentTarget.dataset;
    wx.setStorage({
      key: "editAddress",
      data: {
        user_id: id,
        s_id: s_id,
        address_id: obj.id,
        address: obj.address,
        address1: obj.adds,
        user_name: obj.name,
        user_phone: obj.phone,
        is_default: obj.defaults
      },
      success: res => {
        if (_type == 3) {
          wx.navigateTo({
            url: '../addAddress/addAddress?edit=1&type=3',
          })
        } else {
          wx.navigateTo({
            url: '../addAddress/addAddress?edit=1',
          })
        }
      }
    })
  },
  // 删除地址
  delAddress: function(e) {
    var obj = e.currentTarget.dataset;
    wx.showModal({
      title: "",
      content: "确认删除？",
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.requestUrl + "api/?ctl=user&act=del_address",
            data: {
              user_id: id,
              s_id: s_id,
              address_id: obj.adds_id
            },
            success: res => {
              wx.showToast({
                title: '删除成功',
                icon: "success",
                duration: 1500
              })
              this.onShow();
            }
          })
        }
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
    //获取收货地址列表
    wx.request({
      url: app.globalData.requestUrl + "api/?ctl=user&act=user_address",
      data: {
        user_id: app.globalData.openid,
        s_id: app.globalData.s_id
      },
      success: res => {
        this.setData({
          addressList: res.data.data,
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