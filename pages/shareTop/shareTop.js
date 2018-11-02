// pages/shareTop/shareTop.js
const app = getApp();
var creditInfo = []
var page
var tops = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictureUrl: app.globalData.pictureUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    // 获取排行榜
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=zhitui_list',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: 1
      },
      success: res => {
        var list = res.data.data
        this.setData({
          desc: res.data.desc
        })
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].nick.length > 2) {
              list[i].nick = list[i].nick.substring(0, 1) + '*' + list[i].nick.substr(list[i].nick.length - 1, 1)
            }
            if (list[0].rank == 1) {
              tops.push(list[i])
            }
          }
          creditInfo = list
          this.setData({
            ranks: list,
            tops: tops,
            myRank: res.data,
            topNum: list[0].num
          })
          var newTops = this.data.tops
          if (newTops.length >= 2) {
            for (var i = 0; i < newTops.length; i++) {
              if (i != 0) {
                newTops[i].nick = '、' + newTops[i].nick
              }
            }
            this.setData({
              tops: newTops
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
    var creditInfo = []
    var page
    var tops = []
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
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=zhitui_list',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: page
      },
      success: res => {
        var list = res.data.data
        this.setData({
          desc: res.data.desc
        })
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].nick.length > 2) {
              list[i].nick = list[i].nick.substring(0, 1) + '*' + list[i].nick.substr(list[i].nick.length - 1, 1)
            }
            if (list[0].rank == 1) {
              tops.push(list[i])
            }
            creditInfo.push(list[i])
          }
          creditInfo = list
          this.setData({
            ranks: creditInfo,
            tops: tops
          })
          var newTops = this.data.tops
          if (newTops.length >= 2) {
            for (var i = 0; i < newTops.length; i++) {
              if (i != 0) {
                newTops[i].nick = '、' + newTops[i].nick
              }
            }
            this.setData({
              newTops: newTops
            })
          }
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})