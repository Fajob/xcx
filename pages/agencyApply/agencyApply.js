// pages/agencyApply/agencyApply.js
const app = getApp()
var tfp = new Array(2)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgTop: {
      'src': '',
      'display': 'none'
    },
    imgBottom: {
      'src': '',
      'display': 'none'
    },
    topShow: '',
    bottomShow: '',
    isApply: '0',
    pictureUrl: app.globalData.pictureUrl,
    imgs: ['id_img1', 'id_img2']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.proxy == 1) {
      this.setData({
        isApply: '1'
      })
    }
  },
  chooseImageTap: function(e) {
    let index = e.currentTarget.dataset.index
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album', index)
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera', index)
          }
        }
      }
    })
  },
  chooseWxImage: function(type, index) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        if (index == 1) {
          tfp[0] = res.tempFilePaths[0]
          var imgTop = _this.data.imgTop
          imgTop.src = res.tempFilePaths[0]
          imgTop.display = ''
          _this.setData({
            imgTop: imgTop,
            topShow: 'none'
          })
        }
        if (index == 2) {
          tfp[1] = res.tempFilePaths[0]
          var imgBottom = _this.data.imgBottom
          imgBottom.src = res.tempFilePaths[0]
          imgBottom.display = ''
          _this.setData({
            imgBottom: imgBottom,
            bottomShow: 'none'
          })
        }
      }
    })
  },
  // 提交申请
  apply: function(e) {
    if (e.detail.value.realname == '' || e.detail.value.job == '' || tfp[0] == undefined || tfp[1] == undefined) {
      wx.showToast({
        title: '请输入职业、真实姓名、照片',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: app.globalData.requestUrl + 'api/index.php?ctl=proxy&act=request',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.openid,
          jobs: e.detail.value.job,
          real_name: e.detail.value.realname,
        },
        success: res => {
          if (res.data.status) {
            var imgs = this.data.imgs
            for (var i = 0; i < tfp.length; i++) {
              wx.uploadFile({
                url: app.globalData.requestUrl + 'api/index.php?ctl=image&act=proxy_idcard',
                filePath: tfp[i],
                name: 'file',
                header: {
                  'content-type': 'multipart/form-data',
                  'cookie': wx.getStorageSync("sessionid")
                },
                formData: {
                  'user_id': app.globalData.openid,
                  'type': imgs[i]
                },
                success: res => {
                  var res = JSON.parse(res.data)
                  if (!res.status) {
                    wx.showToast({
                      title: res.msg,
                      icon: 'none'
                    })
                    return
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
            wx.redirectTo({
              url: '../agency/agency?from=apply',
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