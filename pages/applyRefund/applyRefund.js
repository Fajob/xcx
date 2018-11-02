// pages/applyRefund/applyRefund.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [
      {img:'',display:'none'},
      { img: '', display: 'none' },
      { img: '', display: 'none' }
    ],
    show: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  chooseImageTap: function() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function(type) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        var imgs =_this.data.imgs
        if (imgs[0].img == '') {
          imgs[0].img = res.tempFilePaths[0]
          imgs[0].display = 'inline-block'
        } else if (imgs[1].img == ''){
          imgs[1].img = res.tempFilePaths[0]
          imgs[1].display = 'inline-block'
        } else if (imgs[2].img == '') {
          imgs[2].img = res.tempFilePaths[0]
          imgs[2].display = 'inline-block'
        }
        if (imgs[0].img != '' && imgs[1].img != '' && imgs[2].img != '') {
          _this.setData({
            show: 'none'
          })
        }
        _this.setData({
          imgs: imgs
        })
      }
    })
  },
  delImg: function(e){
    var index = e.currentTarget.dataset.index
    var imgs = this.data.imgs
    imgs[index].img = ''
    imgs[index].display = 'none'
    this.setData({
      imgs: imgs,
      show: ''
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