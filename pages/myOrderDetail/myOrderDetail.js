// pages/myOrderDetail/myOrderDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headInfo1: '',
    headInfo2: '',
    headImg: '',
    applyType: 0,
    timeType: '',
    btnType: '',
    unitPrice: 888,
    num: 2,
    totalPrice: '',
    refund: '',
    items: [{
        name: 'wepay',
        value: '微信支付',
        src: app.globalData.pictureUrl + 'wepay.png',
        checked: 'true'
      },
      {
        name: 'friendpay',
        value: '找微信好友代付',
        src: app.globalData.pictureUrl + 'friendpay.png'
      },
    ],
    isContact: 'none',
    pictureUrl: app.globalData.pictureUrl,
    requestUrl: app.globalData.requestUrl
  },
  copyExpNum: function (e) {
    var self = this;
    var expNum = self.data.orderDetail.express_num
    expNum = expNum.split(')')[1]
    wx.setClipboardData({
      data: expNum,
      success: function (res) {
        
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
    var totalPrice = this.data.unitPrice * this.data.num
    this.setData({
      totalPrice: totalPrice
    })
    // 订单详情
    if (options.order_detail) {
      var orderDetail = JSON.parse(options.order_detail)
      if (orderDetail.express_num) {
        var express_num = orderDetail.express_num
        express_num = express_num.split(':')
        switch (express_num[0]) {
          case 'shentong':
            express_num[0] = '申通'
            break;
          case 'shunfeng':
            express_num[0] = '顺丰'
            break;
          case 'yuantong':
            express_num[0] = '圆通速递'
            break;
          case 'yunda':
            express_num[0] = '韵达快运'
            break;
          case 'zhongtong':
            express_num[0] = '中通速递'
            break;
          default:
            break;
        }
        orderDetail.express_num = '(' + express_num[0] + ')' + express_num[1]
      }
      this.setData({
        orderDetail: orderDetail
      })
    }
    if (options.orderType == 0) {
      this.setData({
        headInfo1: '等待买家付款',
        headInfo2: '逾期未付款，订单将自动取消',
        headImg: app.globalData.pictureUrl + 'wallet.png',
        // addressType:'0',
        btnType: '1',
        refund: '0'
      })
    } else if (options.orderType == 1) {
      this.setData({
        headInfo1: '买家已付款',
        headInfo2: '等待商家发货',
        headImg: app.globalData.pictureUrl + 'car.png',
        applyType: '1',
        timeType: '1',
        btnType: '2',
        refund: '0'
      })
    } else if (options.orderType == 2) {
      this.setData({
        headInfo1: '商家已发货',
        headInfo2: '还剩14天自动确认',
        headImg: app.globalData.pictureUrl + 'delivered.png',
        applyType: '1',
        timeType: '2',
        btnType: '3',
        refund: '0'
      })
    } else if (options.orderType == 3) {
      this.setData({
        headInfo1: '交易完成',
        headImg: app.globalData.pictureUrl + 'evaluated.png',
        applyType: '2',
        timeType: '3',
        btnType: '4',
        refund: '0'
      })
    } else if (options.orderType == 4) {
      this.setData({
        headInfo1: '等待商家确认',
        headInfo2: '还剩6天22时42分自动确认',
        applyType: '2',
        timeType: '3',
        btnType: '4',
        refund: '1'
      })
      wx.setNavigationBarTitle({
        title: '订单详情',
      })
    }
  },
  // 拨打电话
  call: function() {
    wx.showModal({
      title: '请拨打以下电话',
      content: '0755-28462725',
    })
  },
  applyRefund: function() {
    wx.showModal({
      title: '',
      content: '请联系在线客服',
    })
  },
  makeComment: function(e) {
    wx.navigateTo({
      url: '../comment/comment',
    })
  },
  checkLogistics: function(e) {
    wx.navigateTo({
      url: '../logistics/logistics',
    })
  },
  goPay: function(e) {
    wx.navigateTo({
      url: '../myOrderSettlement/myOrderSettlement',
    })
  },
  contactRemind: function(e) {
    this.setData({
      isContact: ''
    })
  },
  close: function(e) {
    this.setData({
      isContact: 'none'
    })
  },
  oneMore: function() {
    wx.switchTab({
      url: '/pages/properties/properties',
    })
  },
  confirmReceive: function(e) {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=order&act=confirm_receive',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        order_id: e.currentTarget.dataset.orderid
      },
      success: res => {
        if (res.data.status) {
          wx.redirectTo({
            url: '/pages/myOrder/myOrder?order_type=4',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 取消订单
  cancel_order: function(e) {
    wx.showModal({
      title: '取消订单提醒',
      content: '您确认要取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.requestUrl + 'api/?ctl=order&act=cancel_order',
            header: app.globalData.header,
            data: {
              user_id: app.globalData.openid,
              order_id: e.currentTarget.dataset.orderid
            },
            success: res => {
              if (res.data.status) {
                wx.showToast({
                  title: res.data.msg,
                  success: res => {
                    wx.redirectTo({
                      url: '/pages/myOrder/myOrder?order_type=1',
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            },
            fail: function() {
              wx.showToast({
                title: '服务器返回一个错误',
                icon: 'none'
              })
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