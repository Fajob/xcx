// pages/agencyApplication/agencyApplication.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '0',
    properties: ['枕头','药包'],
    requestUrl: app.globalData.requestUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我要进货',
    })
  },
  // 选择产品
  toggle: function (e) {
    let ids = e.currentTarget.id
    this.setData({
      id: ids
    })
  },
  // 立即下单
  goPay: function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
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
    // 获取套餐信息
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=get_meal',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid
      },
      success: res => {
        var creditInfos = res.data.data
        for(var i=0;i<res.data.data.length;i++){
          creditInfos[i].totalZ = creditInfos[i].deal_detail.z_current_price*creditInfos[i].buy_count*creditInfos[i].meal_discount/10
          creditInfos[i].totalY = (creditInfos[i].deal_detail.current_price - creditInfos[i].deal_detail.z_current_price) * creditInfos[i].buy_count * creditInfos[i].meal_discount / 10
          creditInfos[i].useful_credits = res.data.user_info.jifen
          creditInfos[i].useful_left = res.data.user_info.yue
          creditInfos[i].url = '/pages/myOrderSettlement/myOrderSettlement?orderType=5&id=' + creditInfos[i].type + '&dealDetail=' + JSON.stringify(creditInfos[i])
        }
        this.setData({
          mealList: creditInfos,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})