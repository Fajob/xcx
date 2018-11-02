// pages/agency/agency.js
const app = getApp()
var creditInfo = []
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    process: '申请代理',
    url: '../agencyApply/agencyApply'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.from == 'apply') {
      wx.showToast({
        title: '申请成功',
        icon: 'success'
      })
    }
  },
  // 库存
  stocks: function() {
    wx.navigateTo({
      url: '/pages/stocks/stocks',
    })
  },
  // 订单详情
  orderDetail: function(e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  // 订单发货
  orderShip: function(e) {
    wx.navigateTo({
      url: '../agencyAddress/agencyAddress',
    })
  },
  // 申请代理
  applyAgency: function(e) {
    let that = this
    wx.navigateTo({
      url: that.data.url,
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
    // 获取订单发货信息
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=get_package_list',
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
            creditInfos[i].agencyOrder_detail = '../agencyOrderDetail/agencyOrderDetail?agencyOrderDetail=' + JSON.stringify(creditInfos[i]);
            creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time, "Y/M/D");
            creditInfos[i].a_num = parseInt(creditInfos[i].z_num) + parseInt(creditInfos[i].y_num)
          }
          creditInfo = creditInfos
          this.setData({
            userInfo: res.data.user_info,
            agencyOrder: creditInfos
          })
          if (res.data.user_info.proxy == 0) {
            this.setData({
              process: '成为商户',
              url: '../agencyApply/agencyApply?proxy=0'
            })
          } else if (res.data.user_info.proxy == 1) {
            this.setData({
              process: '审核中',
              url: '../agencyApply/agencyApply?proxy=1'
            })
          } else if (res.data.user_info.proxy == 2) {
            this.setData({
              url: '../agencyApply/agencyApply?proxy=0'
            })
          } else if (res.data.user_info.proxy == 3) {
            this.setData({
              process: '我要进货',
              url: '../agencyApplication/agencyApplication'
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    creditInfo = []
    page = 1
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
    page += 1
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=get_package_list',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: page
      },
      success: res => {
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].agencyOrder_detail = '../agencyOrderDetail/agencyOrderDetail?agencyOrderDetail=' + JSON.stringify(creditInfos[i]);
          creditInfos[i].time = time.formatTimeTwo(creditInfos[i].time, "Y/M/D");
          creditInfos[i].a_num = parseInt(creditInfos[i].z_num) + parseInt(creditInfos[i].y_num)
          creditInfo.push(creditInfos[i])
        }
        this.setData({
          agencyOrder: creditInfo
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})