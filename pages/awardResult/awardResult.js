// pages/awardResult/awardResult.js
const app = getApp()
var page = 1
var creditInfo = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '抽奖结果',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=reward_list',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: 1
      },
      success: res => {
        if(res.data.status){
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
            creditInfos[i].time
              = time.formatTimeTwo(creditInfos[i].time, "Y/M/D");
          }
          this.setData({
            results: creditInfos
          })
        }else{
          console.log(res.data.msg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    creditInfo = []
    page = 1
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page += 1
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=user&act=reward_list',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        p: page
      },
      success: res => {
        var time = require('../../utils/util.js');
        var creditInfos = res.data.data
        for (var i = 0; i < res.data.data.length; i++) {
          creditInfos[i].time
            = time.formatTimeTwo(creditInfos[i].time, "Y/M/D");
          creditInfo.push(creditInfos[i])
        }
        this.setData({
          results: creditInfo
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})