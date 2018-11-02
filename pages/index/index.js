//index.js
//获取应用实例
const app = getApp()
var gonggao = []
var num = 1
var option
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    sharingRewards: '0.00',
    shoppingCredits: 0,
    isAward: 'none',
    isAward1: 'none',
    pictureUrl: app.globalData.pictureUrl,
    canIUse: wx.canIUse('official-account'),
    followgzh: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    //获取分享数据
    option = options
    // 查看是否授权
    var that = this
    if (!app.globalData.canGetUserInfo) {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            // 用户已授权过
            wx.getUserInfo({
              success: function(res) {
                //从数据库获取用户信息
                var userInfo = JSON.parse(res.rawData)
                that.setData({
                  userInfo: userInfo
                })
                app.globalData.nameSrc = userInfo
                wx.request({
                  url: app.globalData.requestUrl + 'api/index.php?ctl=product&act=return_openid',
                  data: {
                    code: app.globalData.code,
                    nick: userInfo.nickName,
                    imgUrl: userInfo.avatarUrl,
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: res => {
                    app.globalData.id = res.data.id
                    //设置cookie
                    var header = res.header["Set-Cookie"]
                    header = header.split(';')
                    header = header[0]
                    wx.setStorageSync("sessionid", header)
                    header = {
                      'content-type': 'application/x-www-form-urlencoded',
                      'cookie': wx.getStorageSync("sessionid") //读取cookie
                    };
                    app.globalData.header = header
                    //从数据库获取用户信息
                    app.globalData.openid = res.data.openid
                    app.globalData.s_id = res.data.s_id
                    wx.request({
                      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=my',
                      data: {
                        user_id: res.data.openid,
                        s_id: res.data.s_id
                      },
                      header: {
                        "content-type": "application/json",
                        'cookie': wx.getStorageSync("sessionid")
                      },
                      success: res => {
                        app.globalData.userInfo = res.data;
                        that.setData({
                          obj: res.data.data
                        })
                        if (res.data.data.can_choujiang) {
                          that.setData({
                            isAward: ''
                          })
                        }
                        app.globalData.canGetUserInfo = true
                      }
                    });
                    // 获取公告
                    wx.request({
                      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=gonggao',
                      header: header,
                      data: {
                        user_id: res.data.openid
                      },
                      success: res => {
                        if (res.data.status) {
                          gonggao = res.data.data
                          if (gonggao.length == 0) {
                            that.setData({
                              hasGonggao: false
                            })
                          } else {
                            num = gonggao.length
                            for (var i = 0; i < gonggao.length; i++) {
                              if (gonggao[i].user_name.length > 2) {
                                gonggao[i].user_name = gonggao[i].user_name.substring(0, 1) + '*' + gonggao[i].user_name.substr(gonggao[i].user_name.length - 1, 1)
                              }
                            }
                            that.setData({
                              hasGonggao: true,
                              gonggao: gonggao
                            })
                          }
                        } else {
                          console.log(res.data.msg)
                        }
                      }
                    })
                    // 是否由分享进入小程序
                    if (app.globalData.share_userId) {
                      wx.request({
                        url: app.globalData.requestUrl + 'api/index.php?ctl=product&act=report',
                        header: header,
                        data: {
                          user_id: res.data.openid,
                          p_id: app.globalData.share_userId
                        },
                        success: res => {

                        }
                      })
                    } else {
                      wx.request({
                        url: app.globalData.requestUrl + 'api/index.php?ctl=product&act=report',
                        header: header,
                        data: {
                          user_id: res.data.openid,
                          p_id: '0'
                        },
                        success: res => {

                        }
                      })
                    }
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback(res)
                    }
                  }
                });
              }
            })
          } else {
            //用户未授权过
            wx.redirectTo({
              url: '../auth/auth?openId=' + option.openId
            })
          }
        }
      })
    }
  },
  // 关注公众号
  followGzh: function(){
    this.setData({
      followgzh: ''
    })
  },
  closeGzh: function(e){
    this.setData({
      followgzh: 'none'
    })
  },
  // 不参与抽奖
  close: function(e) {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=choujiang',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        status: 0
      },
      success: res => {
        if (res.data.status) {
          this.setData({
            isAward: 'none'
          })
        } else {
          console.log(res.data.msg)
        }
      }
    })
  },
  closed: function() {
    this.setData({
      isAward1: 'none'
    })
  },
  // 参与抽奖
  lottery: function() {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=choujiang',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid
      },
      success: res => {
        if (res.data.status) {
          this.setData({
            isAward: 'none',
            isAward1: '',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onUnload: function() {
   
  },

  onHide: function() {
    
  },

  onShow: function() {
    var that = this
    that.setData({
      userInfo: app.globalData.nameSrc,
      followgzh: 'none'
    })
    if (app.globalData.canGetUserInfo) {
      // 获取公告
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=gonggao',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid
        },
        success: res => {
          if (res.data.status) {
            gonggao = res.data.data
            if (gonggao.length == 0) {
              that.setData({
                hasGonggao: false
              })
            } else {
              num = gonggao.length
              for (var i = 0; i < gonggao.length; i++) {
                if (gonggao[i].user_name.length > 2) {
                  gonggao[i].user_name = gonggao[i].user_name.substring(0, 1) + '*' + gonggao[i].user_name.substr(gonggao[i].user_name.length - 1, 1)
                }
              }
              that.setData({
                hasGonggao: true,
                gonggao: gonggao
              })
            }
          } else {
            console.log(res.data.msg)
          }
        }
      })
      // 获取我的页面信息
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=my',
        data: {
          user_id: app.globalData.openid,
          s_id: app.globalData.s_id
        },
        header: {
          "content-type": "application/json"
        },
        success: res => {
          app.globalData.userInfo = res.data;
          that.setData({
            obj: res.data.data
          })
          // 是否显示抽奖页
          if (that.data.obj.can_choujiang) {
            that.setData({
              isAward: ''
            })
          }
        }
      })
    }
  }
})