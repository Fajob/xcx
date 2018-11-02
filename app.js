//app.js
var get_sessionid
App({
  onLaunch: function(options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    nameSrc: null,
    id: null,
    s_id: null,
    openid: null,
    share_userId: null,
    canGetUserInfo: false,
    code: 0,
    header: {},
    pictureUrl: 'https://sgc.runde.pro/public/img/xcx/',
    requestUrl: 'https://sgc.runde.pro/',
    requestPicture: 'https://sgc.runde.pro'
  },
  onShow: function(){
    // session过期，重新获取session
    var that = this
    get_sessionid = setInterval(function () {
      wx.request({
        url: that.globalData.requestUrl + 'api/index.php?ctl=user&act=do_login',
        data: {
          user_id: that.globalData.openid
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          //设置cookie
          var header = res.header["Set-Cookie"]
          header = header.split(';')
          header = header[0]
          var sId = header.split('=')
          sId = sId[1]
          that.globalData.s_id = sId
          wx.setStorageSync("sessionid", header)
          header = {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': wx.getStorageSync("sessionid") //读取cookie
          };
          that.globalData.header = header
        }
      })
    }, 10*60*1000)
  },
  onHide: function(){
    clearInterval(get_sessionid)
  }
})