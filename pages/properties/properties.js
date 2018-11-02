// pages/properties/properties.js
const app = getApp();
let videoCtx = null;
var pid
var imgs = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_image: 'block',
    currentSwiper: '1',
    totalSwiper: '3',
    imgUrls: [
      app.globalData.pictureUrl + 'swiper3.png?' + Math.random() / 9999,
      app.globalData.pictureUrl + 'swiper4.png?' + Math.random() / 9999,
      app.globalData.pictureUrl + 'swiper5.jpg?' + Math.random() / 9999
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    ctx: [
      '枕头+药包', '药包'
    ],
    pid: 60,
    id: 0,
    masklayer: '0',
    itemNum: 1,
    url: '',
    tempFilePaths: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentId: 0,
    item: {
      'src': app.globalData.pictureUrl + 'video.mp4?' + Math.random() / 9999,
      'poster': 'http://sgc.quanx.cc/public/img/xcx/swiper1.png'
    },
    display: true,
    pictureUrl: app.globalData.pictureUrl,
    requestUrl: app.globalData.requestUrl,
    random: Math.random()/9999 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.hideShareMenu()
    videoCtx = wx.createVideoContext('playVideo', this)
    wx.setNavigationBarTitle({
      title: '产品介绍',
    })
    var itemNum = this.data.itemNum
    pid = this.data.pid
    this.setData({
      url: '../myOrderSettlement/myOrderSettlement?num=' + itemNum + '&pid=' + pid+'&id='+this.data.id
    })
  },
  // 播放视频
  play: function(e) {
    this.setData({
      display: false,
      showUrl: e.currentTarget.dataset.video
    })
  },
  // 视频播放完毕
  showPreimg: function(){
    this.setData({
      display: true,
    })
  },
  // 隐藏视频播放页
  hide: function(e) {
    this.setData({
      display: 'none',
    })
    videoCtx.pause();
    videoCtx.seek(0);
  },
  // 选择产品
  choose: function(e) {
    var ids = e.currentTarget.id;
    this.setData({
      id: ids,
      url: '../myOrderSettlement/myOrderSettlement?num=' + this.data.itemNum + '&pid=' + this.data.pid + '&id=' + ids
    });
  },
  // 弹出购买框
  buy: function() {
    this.setData({
      masklayer: '1'
    })
  },
  // 关闭
  close: function() {
    this.setData({
      masklayer: '0',
      id: 0,
      itemNum: 1,
      url: '../myOrderSettlement/myOrderSettlement?num=' + 1 + '&pid=' + this.data.pid + '&id=' + 0
    })
  },
  // 减少购买数量
  reduce: function(e) {
    var itemNum1 = this.data.itemNum;
    if (itemNum1 > 1) {
      itemNum1--;
      this.setData({
        itemNum: itemNum1,
        url: '../myOrderSettlement/myOrderSettlement?num=' + itemNum1 + '&pid=' + pid + '&id=' + this.data.id
      })
    } else {
      return;
    }
  },
  // 增加购买数量
  add: function(e) {
    var itemNum2 = this.data.itemNum;
    itemNum2++;
    this.setData({
      itemNum: itemNum2,
      url: '../myOrderSettlement/myOrderSettlement?num=' + itemNum2 + '&pid=' + pid + '&id=' + this.data.id
    })
  },
  // 切换轮播图
  change: function(e) {
    this.setData({
      currentSwiper: ++e.detail.current
    });
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
    // 获取产品信息
    wx.request({
      url: app.globalData.requestUrl + 'api/?ctl=product&act=product_info',
      data: {
        user_id: app.globalData.id,
        s_id: app.globalData.s_id,
        pid: 60
      },
      success: res => {
        if (res.data.status == true) {
          var yCurPrice = res.data.data.current_price - res.data.data.z_current_price
          this.setData({
            yCurPrice: yCurPrice,
            curPrice: res.data.data.current_price,
            saleAmount: res.data.data.sale_amount,
            brief: res.data.data.brief,
            stock: res.data.data.stock,
            show_media: res.data.show_media,
            media_url: res.data.media_url
          })
        }
      }
    })
    // 获取用户评价
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=order&act=get_comment',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        deal_id: 60,
        p: 1
      },
      success: res => {
        if (res.data.status && res.data.data.length) {
          var time = require('../../utils/util.js');
          var creditInfos = res.data.data
          creditInfos[0].time = time.formatTimeTwo(creditInfos[0].time, "Y/M/D h:m");
          this.setData({
            comment: creditInfos[0]
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      masklayer: 0,
      id: 0,
      itemNum: 1,
      url: '../myOrderSettlement/myOrderSettlement?num=' + 1 + '&pid=' + this.data.pid + '&id=' + 0
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
    return {
      path: '/pages/index/index?openId=' + app.globalData.openid,
    }
  }
})