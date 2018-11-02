// pages/myOrderSettlement/myOrderSettlement.js
const app = getApp()
let option
var needPay; //所需付款金额
var pay1 = 0;
var pay2 = 0;
var pay3 = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        name: 'wepay',
        value: '微信支付',
        src: app.globalData.pictureUrl + 'wepay.png'
      },
      // { name: 'friendpay', value: '找微信好友代付', src: app.globalData.pictureUrl +'friendpay.png' },
    ],
    items1: [{
        name: 'credit',
        value: '现金红包',
        src: app.globalData.pictureUrl + 'shoppingCredits.png',
        discountName: '可用红包：',
        discount: 0
      },
      {
        name: 'left',
        value: '我的余额',
        src: app.globalData.pictureUrl + 'sharingRewards.png',
        discountName: '可用余额：',
        discount: 0
      },
    ],
    buyNum: '',
    orderType: '',
    id: '',
    pictureUrl: app.globalData.pictureUrl,
    requestPicture: app.globalData.requestPicture,
    requestUrl: app.globalData.requestUrl,
    confirm: false,
    payType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    option = options
    if (option.order_id) {
      // 待付款订单信息
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=order&act=get_order',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          order_id: option.order_id
        },
        success: res => {
          if (res.data.status) {
            needPay = res.data.order_data.total_price
            if (res.data.order_data.sub_id == 3) {
              this.setData({
                id: 0
              })
            } else {
              this.setData({
                id: 1
              })
            }
            var userInfo = {
              'data': {
                'yue': '',
                'jifen': ''
              }
            }
            var totalPrice = res.data.order_data.total_price - parseFloat(res.data.order_data.user_jifen) + parseFloat(res.data.order_data.user_yue) + parseFloat(res.data.order_data.wx_payamount)
            userInfo.data.yue = res.data.user_info.yue
            userInfo.data.jifen = res.data.user_info.jifen
            var productInfo = res.data.deal_info
            productInfo.y_current_price = productInfo.current_price - productInfo.z_current_price
            this.setData({
              addressInfo: res.data.address_detail,
              productInfo: productInfo,
              buyNum: res.data.order_data.amount,
              totalPrice: totalPrice,
              userInfo: userInfo,
              orderType: option.orderType,
              order_data: res.data.order_data
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
    // 获取购买套餐信息-代理
    if (options.dealDetail) {
      var items1 = this.data.items1
      this.setData({
        dealDetail: JSON.parse(options.dealDetail)
      })
      items1[0].discount = this.data.dealDetail.useful_credits
      items1[1].discount = this.data.dealDetail.useful_left
      this.setData({
        items1: items1
      })
      if (this.data.dealDetail.type == 1) {
        needPay = this.data.dealDetail.totalZ
      } else if (this.data.dealDetail.type == 2) {
        needPay = this.data.dealDetail.totalY
      }
    }
    // 购买枕头或药包-代理
    if (options.orderType) {
      this.setData({
        orderType: options.orderType
      })
    }
    // 购买枕头或药包-个人
    if (options.id) {
      if (options.id == 0) {
        this.setData({
          sub_id: 3
        })
      } else if (options.id == 1) {
        this.setData({
          sub_id: 2
        })
      }
      this.setData({
        id: options.id
      })
    }
  },
  // 更换地址-个人
  changeAddress: function(e) {
    wx.navigateTo({
      url: '../address/address?type=3',
    })
  },
  // 付款-个人
  payNow: function() {
    var item = this.data.items1
    if (this.data.addressInfo.address_id == undefined) {
      wx.showToast({
        title: '请输入有效的地址信息',
        icon: 'none'
      })
    } else {
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=pay&act=get_package',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          pid: option.pid,
          amount: option.num,
          address_id: this.data.addressInfo.address_id,
          total_fee: pay3,
          buy_type: 1,
          sub_id: this.data.sub_id
        },
        success: res => {
          var out_trade_no = res.data.out_trade_no
          if (pay3 == '0.00') {
            wx.request({
              url: app.globalData.requestUrl + 'api/?ctl=order&act=add_order',
              header: app.globalData.header,
              data: {
                user_id: app.globalData.openid,
                s_id: app.globalData.s_id,
                pid: option.pid,
                amount: option.num,
                address_id: this.data.addressInfo.address_id,
                pay_price: pay3,
                user_jifen: pay1,
                user_yue: pay2,
                out_trade_no: out_trade_no
              },
              success: res => {
                if (res.data.status) {
                  wx.redirectTo({
                    url: '/pages/myOrder/myOrder?order_type=2&from=1&msg=' + res.data.msg,
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/myOrder/myOrder?order_type=1&from=1&msg=' + res.data.msg,
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
          } else {
            var res = res.data;
            if (res.return_code == 'SUCCESS' && res.result_code == 'SUCCESS') {
              wx.requestPayment({
                timeStamp: res.timeStamp,
                nonceStr: res.nonce_str,
                package: 'prepay_id=' + res.prepay_id,
                signType: 'MD5',
                paySign: res.paySign,
                success: res => {
                  wx.request({
                    url: app.globalData.requestUrl + 'api/?ctl=order&act=add_order',
                    header: app.globalData.header,
                    data: {
                      user_id: app.globalData.openid,
                      s_id: app.globalData.s_id,
                      pid: option.pid,
                      amount: option.num,
                      address_id: this.data.addressInfo.address_id,
                      pay_price: pay3,
                      user_jifen: pay1,
                      user_yue: pay2,
                      out_trade_no: out_trade_no
                    },
                    success: res => {
                      if (res.data.status) {
                        wx.redirectTo({
                          url: '/pages/myOrder/myOrder?order_type=2&from=1&msg=' + res.data.msg,
                        })
                      } else {
                        wx.redirectTo({
                          url: '/pages/myOrder/myOrder?order_type=1&from=1&msg=' + res.data.msg,
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
                fail: res => {
                  wx.redirectTo({
                    url: '/pages/myOrder/myOrder?order_type=1&from=1&msg=支付失败',
                  })
                }
              })
            }
          }
        }
      })
    }
  },
  // 确认付款-代理
  payNow5: function(e) {
    var payType = this.data.payType
    if (payType == 0) {
      wx.showToast({
        title: '请至少选择一种付款方式',
        icon: 'none'
      })
    } else if (payType == 1) {
      wx.showToast({
        title: '红包不足，请添加其它付款方式',
        icon: 'none'
      })
    } else if (payType == 2) {
      wx.showToast({
        title: '余额不足，请添加其它付款方式',
        icon: 'none'
      })
    } else if (payType == 3) {
      wx.showToast({
        title: '红包、余额不足，请添加其它付款方式',
        icon: 'none'
      })
    } else if (payType == 4) {
      pay1 = parseFloat(pay1).toFixed(2)
      pay2 = parseFloat(pay2).toFixed(2)
      pay3 = parseFloat(pay3).toFixed(2)
      this.setData({
        confirm: true,
        pay1: pay1,
        pay2: pay2,
        pay3: pay3
      })
    }
    this.setData({
      payType: payType
    })
  },
  // 付款-代理
  pay5: function(e) {
    if (this.data.orderType != 5) {
      if (this.data.orderType == 6) {
        // 待付款订单处理
        wx.request({
          url: app.globalData.requestUrl + 'api/index.php?ctl=pay&act=get_package',
          header: app.globalData.header,
          data: {
            user_id: app.globalData.openid,
            pid: this.data.order_data.deal_id,
            amount: this.data.order_data.amount,
            address_id: this.data.order_data.address_id,
            total_fee: pay3,
            buy_type: 1,
            sub_id: this.data.order_data.sub_id,
            order_sn: this.data.order_data.order_sn
          },
          success: res => {
            var out_trade_no = res.data.out_trade_no
            if (pay3 == '0.00') {
              wx.request({
                url: app.globalData.requestUrl + 'api/?ctl=order&act=add_order',
                header: app.globalData.header,
                data: {
                  user_id: app.globalData.openid,
                  s_id: app.globalData.s_id,
                  pid: this.data.order_data.deal_id,
                  amount: this.data.order_data.amount,
                  address_id: this.data.addressInfo.address_id,
                  pay_price: pay3,
                  user_jifen: pay1,
                  user_yue: pay2,
                  out_trade_no: this.data.order_data.order_sn
                },
                success: res => {
                  if (res.data.status) {
                    wx.redirectTo({
                      url: '/pages/myOrder/myOrder?order_type=2&from=1&msg=' + res.data.msg,
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
            } else {
              var res = res.data;
              if (res.return_code == 'SUCCESS' && res.result_code == 'SUCCESS') {
                wx.requestPayment({
                  timeStamp: res.timeStamp,
                  nonceStr: res.nonce_str,
                  package: 'prepay_id=' + res.prepay_id,
                  signType: 'MD5',
                  paySign: res.paySign,
                  success: res => {
                    wx.request({
                      url: app.globalData.requestUrl + 'api/?ctl=order&act=add_order',
                      header: app.globalData.header,
                      data: {
                        user_id: app.globalData.openid,
                        s_id: app.globalData.s_id,
                        pid: this.data.order_data.deal_id,
                        amount: this.data.order_data.amount,
                        address_id: this.data.addressInfo.address_id,
                        pay_price: pay3,
                        user_jifen: pay1,
                        user_yue: pay2,
                        out_trade_no: this.data.order_data.order_sn
                      },
                      success: res => {
                        if (res.data.status) {
                          wx.redirectTo({
                            url: '/pages/myOrder/myOrder?order_type=2&from=1&msg=' + res.data.msg,
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
                  fail: res => {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none'
                    })
                  }
                })
              }
            }
          }
        })
      } else {
        this.payNow()
      }
    } else {
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=pay&act=get_package',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          total_fee: pay3,
          buy_type: 2
        },
        success: res => {
          var out_trade_no = res.data.out_trade_no
          if (pay3 == '0.00') {
            wx.request({
              url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=proxy_buy',
              header: app.globalData.header,
              data: {
                user_id: app.globalData.openid,
                t_id: this.data.dealDetail.id,
                pay1: pay1,
                pay2: pay2,
                pay3: pay3,
                pay4: 0,
                out_trade_no: out_trade_no
              },
              success: res => {
                if (res.data.status) {
                  wx.showToast({
                    title: res.data.msg,
                  })
                  wx.navigateBack({
                    delta: 2
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    success: res => {
                      wx.navigateBack({
                        delta: 2
                      })
                    }
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
          } else {
            var res = res.data;
            if (res.return_code == 'SUCCESS' && res.result_code == 'SUCCESS') {
              wx.requestPayment({
                timeStamp: res.timeStamp,
                nonceStr: res.nonce_str,
                package: 'prepay_id=' + res.prepay_id,
                signType: 'MD5',
                paySign: res.paySign,
                success: res => {
                  wx.request({
                    url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=proxy_buy',
                    header: app.globalData.header,
                    data: {
                      user_id: app.globalData.openid,
                      t_id: this.data.dealDetail.id,
                      pay1: pay1,
                      pay2: pay2,
                      pay3: pay3,
                      pay4: 0,
                      out_trade_no: out_trade_no
                    },
                    success: res => {
                      if (res.data.status) {
                        wx.navigateBack({
                          delta: 2
                        })
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none',
                          success: res => {
                            wx.navigateBack({
                              delta: 2
                            })
                          }
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
                fail: res => {
                  wx.showToast({
                    title: '进货失败',
                    success: res => {
                      wx.navigateBack({
                        delta: 2
                      })
                    }
                  })
                }
              })
            }
          }
        }
      })
    }
  },
  // 关闭确认付款层
  close: function() {
    this.setData({
      confirm: false
    })
  },
  // 选择付款方式-个人
  isChoosed: function(e) {
    var payType = this.data.payType
    var val = e.detail.value
    var dealDetail = app.globalData.userInfo.data
    if (val.length == 0) {
      payType = 0
    } else if (val.length == 1) {
      if (val[0] == 'credit') {
        if (dealDetail.jifen < needPay) {
          payType = 1 //积分不足
        } else {
          payType = 4 //可支付
          pay1 = needPay
          pay2 = 0
          pay3 = 0
        }
      } else if (val[0] == 'left') {
        if (dealDetail.yue < needPay) {
          payType = 2 //余额不足
        } else {
          payType = 4 //可支付
          pay1 = 0
          pay2 = needPay
          pay3 = 0
        }
      } else if (val[0] == 'wepay') {
        payType = 4 //可支付
        pay1 = 0
        pay2 = 0
        pay3 = needPay
      }
    } else if (val.length == 2) {
      if ((val[0] == 'credit' && val[1] == 'left') || (val[0] == 'left' && val[1] == 'credit')) {
        var credits_left = parseFloat(dealDetail.jifen) + parseFloat(dealDetail.yue)
        if (credits_left < needPay) {
          payType = 3 //积分余额不足
        } else {
          payType = 4 //可支付
          if (dealDetail.jifen > needPay) {
            pay1 = needPay
            pay2 = 0
            pay3 = 0
          } else {
            pay1 = dealDetail.jifen
            pay2 = needPay - dealDetail.jifen
            pay3 = 0
          }
        }
      } else {
        payType = 4 //可支付
        if (val[0] == 'credit' || val[1] == 'credit') {
          if (dealDetail.jifen > needPay) {
            pay1 = needPay
            pay2 = 0
            pay3 = 0
          } else {
            pay1 = dealDetail.jifen
            pay2 = 0
            pay3 = needPay - dealDetail.jifen
          }
        } else {
          if (dealDetail.yue > needPay) {
            pay1 = 0
            pay2 = needPay
            pay3 = 0
          } else {
            pay1 = 0
            pay2 = dealDetail.yue
            pay3 = needPay - dealDetail.yue
          }
        }
      }
    } else if (val.length == 3) {
      payType = 4 //可支付
      if (dealDetail.jifen > needPay) {
        pay1 = needPay
        pay2 = 0
        pay3 = 0
      } else {
        if (dealDetail.yue > (needPay - dealDetail.jifen)) {
          pay1 = dealDetail.jifen
          pay2 = needPay - dealDetail.jifen
          pay3 = 0
        } else {
          pay1 = dealDetail.jifen
          pay2 = dealDetail.yue
          pay3 = needPay - dealDetail.jifen - dealDetail.yue
        }
      }
    }
    this.setData({
      payType: payType
    })
  },
  // 选择付款方式-代理
  isChoosed5: function(e) {
    var payType = this.data.payType
    var val = e.detail.value
    var dealDetail = this.data.dealDetail
    if (val.length == 0) {
      payType = 0
    } else if (val.length == 1) {
      if (val[0] == 'credit') {
        if (dealDetail.useful_credits < needPay) {
          payType = 1 //积分不足
        } else {
          payType = 4 //可支付
          pay1 = needPay
          pay2 = 0
          pay3 = 0
        }
      } else if (val[0] == 'left') {
        if (dealDetail.useful_left < needPay) {
          payType = 2 //余额不足
        } else {
          payType = 4 //可支付
          pay1 = 0
          pay2 = needPay
          pay3 = 0
        }
      } else if (val[0] == 'wepay') {
        payType = 4 //可支付
        pay1 = 0
        pay2 = 0
        pay3 = needPay
      }
    } else if (val.length == 2) {
      if ((val[0] == 'credit' && val[1] == 'left') || (val[0] == 'left' && val[1] == 'credit')) {
        var credits_left = parseFloat(dealDetail.useful_credits) + parseFloat(dealDetail.useful_left)
        if (credits_left < needPay) {
          payType = 3 //积分余额不足
        } else {
          payType = 4 //可支付
          if (dealDetail.useful_credits > needPay) {
            pay1 = needPay
            pay2 = 0
            pay3 = 0
          } else {
            pay1 = dealDetail.useful_credits
            pay2 = needPay - dealDetail.useful_credits
            pay3 = 0
          }
        }
      } else {
        payType = 4 //可支付
        if (val[0] == 'credit' || val[1] == 'credit') {
          if (dealDetail.useful_credits > needPay) {
            pay1 = needPay
            pay2 = 0
            pay3 = 0
          } else {
            pay1 = dealDetail.useful_credits
            pay2 = 0
            pay3 = needPay - dealDetail.useful_credits
          }
        } else {
          if (dealDetail.useful_left > needPay) {
            pay1 = 0
            pay2 = needPay
            pay3 = 0
          } else {
            pay1 = 0
            pay2 = dealDetail.useful_left
            pay3 = needPay - dealDetail.useful_left
          }
        }
      }
    } else if (val.length == 3) {
      payType = 4 //可支付
      if (dealDetail.useful_credits > needPay) {
        pay1 = needPay
        pay2 = 0
        pay3 = 0
      } else {
        if (dealDetail.useful_left > (needPay - dealDetail.useful_credits)) {
          pay1 = dealDetail.useful_credits
          pay2 = needPay - dealDetail.useful_credits
          pay3 = 0
        } else {
          pay1 = dealDetail.useful_credits
          pay2 = dealDetail.useful_left
          pay3 = needPay - dealDetail.useful_credits - dealDetail.useful_left
        }
      }
    }
    this.setData({
      payType: payType
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
    // 获取购买产品信息-个人
    if (option.num && option.pid) {
      this.setData({
        buyNum: option.num
      })
      this.setData({
        userInfo: app.globalData.userInfo
      })
      wx.request({
        url: app.globalData.requestUrl + 'api/?ctl=order&act=deal_fororder',
        data: {
          user_id: app.globalData.openid,
          s_id: app.globalData.s_id,
          pid: option.pid
        },
        success: res => {
          var totalPrice
          var productInfo = res.data.data.product_info
          productInfo.y_current_price = productInfo.current_price - productInfo.z_current_price
          if (this.data.id == 0) {
            totalPrice = res.data.data.product_info.current_price * option.num
          } else {
            totalPrice = productInfo.y_current_price * option.num
          }
          needPay = totalPrice
          var item = this.data.items1
          item[0].discount = res.data.data.user_info.jifen
          item[1].discount = res.data.data.user_info.yue
          this.setData({
            items1: item,
            addressInfo: res.data.data.address_info,
            productInfo: productInfo,
            totalPrice: totalPrice
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      confirm: false
    })
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