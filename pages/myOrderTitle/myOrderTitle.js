// pages/myOrderTitle/myOrderTitle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: [
      'active','','','',''
    ],
    orderTypes:[
      '全部','待付款','待发货','待收货','待评价'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  toggle: function (e) {
    console.log(e);
    var status = this.data.status;
  }
})