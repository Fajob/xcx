//index.js
//获取应用实例
const app = getApp()
var page = 1
var creditInfo = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    orderTypes: [
      '全部', '待付款', '待发货', '待收货', '待评价'
    ],
    requestPicture: app.globalData.requestPicture
  },

  // 确认收货
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
      },
      fail: function() {
        wx.showToast({
          title: '服务器返回一个错误',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      // 订单状态
      if (options.order_type) {
        this.setData({
          id: options.order_type,
          order_status: options.order_type
        })
      }
      // 判断从何处进入订单页
      if (options.from == 1) {
        wx.showToast({
          title: options.msg,
          icon: 'success'
        })
      } else if (options.from == 2) {
        wx.showToast({
          title: '评价成功',
          icon: 'success'
        })
      }
    }
    this.toggle() //打开哪种状态订单
  },
  // 物流信息
  checkLogistics: function(e) {
    wx.navigateTo({
      url: '../logistics/logistics',
    })
  },
  // 未付款订单
  goPay: function(e) {
    wx.navigateTo({
      url: '../myOrderSettlement/myOrderSettlement?orderType=6&order_id=' + e.currentTarget.dataset.orderid,
    })
  },
  // 待评价订单
  makeComment: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
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
                    if (getCurrentPages().length != 0) {
                      //刷新当前页面的数据
                      getCurrentPages()[getCurrentPages().length - 1].onLoad()
                    }
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
  // 获取订单详情URL
  getUrl: function(res) {
    var time = require('../../utils/util.js');
    var creditInfos = res.data.order_list
    var comment = res.data.order_list
    for (var i = 0; i < res.data.order_list.length; i++) {
      if (creditInfos[i].create_time) {
        creditInfos[i].create_time = time.formatTimeTwo(creditInfos[i].create_time, "Y/M/D h:m:s");
      }
      if (creditInfos[i].receive_time) {
        creditInfos[i].receive_time = time.formatTimeTwo(creditInfos[i].receive_time, "Y/M/D h:m:s");
      }
      if (creditInfos[i].end_time) {
        creditInfos[i].end_time = time.formatTimeTwo(creditInfos[i].end_time, "Y/M/D h:m:s");
      }
      creditInfos[i].real_pay = parseFloat(creditInfos[i].user_jifen) + parseFloat(creditInfos[i].user_yue) + parseFloat(creditInfos[i].wx_payamount)
      creditInfos[i].per_price = creditInfos[i].total_price / creditInfos[i].amount
      creditInfos[i].orderDetail_url = '../myOrderDetail/myOrderDetail?orderType=' + creditInfos[i].order_status + '&order_detail=' + JSON.stringify(creditInfos[i]);
      comment[i].comment_url = '../comment/comment?img=' + creditInfos[i].img + '&brief=' + creditInfos[i].brief + '&deal_name=' + creditInfos[i].deal_name + '&id=' + creditInfos[i].id;
    }
    creditInfo = creditInfos
    this.setData({
      orderList: creditInfos
    })
  },
  // 个人中心->我的订单
  // 打开哪种订单状态
  toggle: function(e) {
    page = 1
    creditInfo = []
    if (e) {
      var ids = e.currentTarget.id;
      this.setData({
        id: ids,
        order_status: ids
      });
    }
    if (this.data.id == 0) {
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=xcx_order',
        data: {
          user_id: app.globalData.id,
          s_id: app.globalData.s_id,
          p: 1
        },
        success: res => {
          this.getUrl(res)
        },
      })
    } else if (this.data.id == 1) {
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=xcx_order',
        data: {
          user_id: app.globalData.id,
          s_id: app.globalData.s_id,
          order_status: 0,
          p: 1
        },
        success: res => {
          this.getUrl(res)
        },
      })
    } else if (this.data.id == 2) {
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=xcx_order',
        data: {
          user_id: app.globalData.id,
          s_id: app.globalData.s_id,
          order_status: 1,
          p: 1
        },
        success: res => {
          this.getUrl(res)
        },
      })
    } else if (this.data.id == 3) {
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=xcx_order',
        data: {
          user_id: app.globalData.id,
          s_id: app.globalData.s_id,
          order_status: 2,
          p: 1
        },
        success: res => {
          this.getUrl(res)
        },
      })
    } else if (this.data.id == 4) {
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=xcx_order',
        data: {
          user_id: app.globalData.id,
          s_id: app.globalData.s_id,
          order_status: 3,
          p: 1
        },
        success: res => {
          this.getUrl(res)
        },
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    page++
    if (this.data.order_status == 0) {
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=xcx_order',
        data: {
          user_id: app.globalData.id,
          s_id: app.globalData.s_id,
          p: page
        },
        success: res => {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.order_list
          var comment = res.data.order_list
          for (var i = 0; i < res.data.order_list.length; i++) {
            if (creditInfos[i].create_time) {
              creditInfos[i].create_time = time.formatTimeTwo(creditInfos[i].create_time, "Y/M/D h:m:s");
            }
            if (creditInfos[i].receive_time) {
              creditInfos[i].receive_time = time.formatTimeTwo(creditInfos[i].receive_time, "Y/M/D h:m:s");
            }
            if (creditInfos[i].end_time) {
              creditInfos[i].end_time = time.formatTimeTwo(creditInfos[i].end_time, "Y/M/D h:m:s");
            }
            creditInfos[i].real_pay = parseFloat(creditInfos[i].user_jifen) + parseFloat(creditInfos[i].user_yue) + parseFloat(creditInfos[i].wx_payamount)
            creditInfos[i].per_price = creditInfos[i].total_price / creditInfos[i].amount
            creditInfos[i].orderDetail_url = '../myOrderDetail/myOrderDetail?orderType=' + creditInfos[i].order_status + '&order_detail=' + JSON.stringify(creditInfos[i]);
            comment[i].comment_url = '../comment/comment?img=' + creditInfos[i].img + '&brief=' + creditInfos[i].brief + '&deal_name=' + creditInfos[i].deal_name + '&id=' + creditInfos[i].id;
            creditInfo.push(creditInfos[i])
          }
          this.setData({
            orderList: creditInfo
          })
        },
      })
    } else {
      var order_status = this.data.order_status
      order_status -=1
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=xcx_order',
        data: {
          user_id: app.globalData.id,
          s_id: app.globalData.s_id,
          order_status: order_status,
          p: page
        },
        success: res => {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.order_list
          var comment = res.data.order_list
          for (var i = 0; i < res.data.order_list.length; i++) {
            if (creditInfos[i].create_time) {
              creditInfos[i].create_time = time.formatTimeTwo(creditInfos[i].create_time, "Y/M/D h:m:s");
            }
            if (creditInfos[i].receive_time) {
              creditInfos[i].receive_time = time.formatTimeTwo(creditInfos[i].receive_time, "Y/M/D h:m:s");
            }
            if (creditInfos[i].end_time) {
              creditInfos[i].end_time = time.formatTimeTwo(creditInfos[i].end_time, "Y/M/D h:m:s");
            }
            creditInfos[i].real_pay = parseFloat(creditInfos[i].user_jifen) + parseFloat(creditInfos[i].user_yue) + parseFloat(creditInfos[i].wx_payamount)
            creditInfos[i].per_price = creditInfos[i].total_price / creditInfos[i].amount
            creditInfos[i].orderDetail_url = '../myOrderDetail/myOrderDetail?orderType=' + creditInfos[i].order_status + '&order_detail=' + JSON.stringify(creditInfos[i]);
            comment[i].comment_url = '../comment/comment?img=' + creditInfos[i].img + '&brief=' + creditInfos[i].brief + '&deal_name=' + creditInfos[i].deal_name + '&id=' + creditInfos[i].id;
            creditInfo.push(creditInfos[i])
          }
          this.setData({
            orderList: creditInfo
          })
        },
      })
    }
  }
})