// pages/uploadExperience/uploadExperience.js
const app = getApp();
var i = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: true,
    select1: false,
    pictureUrl: app.globalData.pictureUrl,
    pictures: [],
    photos: [],
    has: 0,
    video: '',
    video1: '',
    exp_module: 1,
    percent: 0,
    inPercent: false,
    imgs: ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'],
    tfp: ['', '', '', '', '', ''],
    tfpv: ''
  },
  select: function(e) {
    this.setData({
      select: true,
      select1: false
    })
  },
  select1: function(e) {
    this.setData({
      select1: true,
      select: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  chooseImageTap: function(e) {
    let index = e.currentTarget.dataset.index
    let src = e.currentTarget.dataset.src
    let num = e.currentTarget.dataset.num
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album', index, src, num)
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera', index, src, num)
          }
        }
      }
    })
  },
  chooseWxImage: function(type, index, src, num) {
    var tfps = this.data.tfp
    let _this = this;
    let count = 1;
    let has = this.data.has
    if (has == 0) {
      if (index == 1) {
        count = 6
      } else if (index == 2) {
        count = 3
      }
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        tfps[num] = res.tempFilePaths[0]
        if (has == 0) {
          if (index == 1) {
            var pictures = _this.data.pictures
            pictures[num] = res.tempFilePaths
            _this.setData({
              pictures: pictures
            })
          } else if (index == 2) {
            var photos = _this.data.photos
            photos[num] = res.tempFilePaths
            _this.setData({
              photos: photos
            })
          }
          _this.setData({
            has: 1
          })
        } else {
          if (index == 1) {
            var pictures = _this.data.pictures
            pictures[num] = res.tempFilePaths
            _this.setData({
              pictures: pictures
            })
          } else if (index == 2) {
            var photos = _this.data.photos
            photos[num] = res.tempFilePaths
            _this.setData({
              photos: photos
            })
          }
        }
        _this.setData({
          tfp: tfps
        })
      }
    })
  },
  chooseVideoTap: function(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    if (index == 1) {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        success: function(res) {
          that.setData({
            video: res.tempFilePath,
            tfpv: res.tempFilePath
          })
        }
      })
    } else if (index == 2) {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        success: function(res) {
          that.setData({
            video1: res.tempFilePath,
            tfpv: res.tempFilePath
          })
        }
      })
    }
  },
  formSubmit: function(e) {
    wx.showLoading({
      title: '正在上传',
    })
    var uploadWordsStatus
    var uploadPicturesStatus
    var uploadVideoStatus
    var exp_id
    var imgs = this.data.imgs
    var tfp = this.data.tfp
    var tfpv = this.data.tfpv
    var that = this
    wx.request({
      url: app.globalData.requestUrl + 'api/index.php?ctl=experience&act=add', //上传文字
      header: app.globalData.header,
      data: {
        user_id: app.globalData.openid,
        exp_module: this.data.exp_module,
        title: e.detail.value.title,
        txt1: e.detail.value.txt1,
        txt2: e.detail.value.txt2,
        txt3: e.detail.value.txt3,
        txt4: e.detail.value.txt4
      },
      success: res => {
        uploadWordsStatus = res.data.status
        exp_id = res.data.exp_id
        if (uploadWordsStatus) {
          if (tfpv != '') {
            wx.uploadFile({
              url: app.globalData.requestUrl + 'api/index.php?ctl=image&act=exp_video&user_id=' + app.globalData.openid + '&id=' + exp_id + '&type=video1', //上传视频
              filePath: tfpv,
              header: {
                'content-type': 'multipart/form-data',
                'cookie': wx.getStorageSync("sessionid")
              },
              name: 'file',
              success: res => {
                uploadVideoStatus = JSON.parse(res.data)
                uploadVideoStatus = uploadVideoStatus.status
                if (uploadVideoStatus) {
                  if (tfp[0] == '' && tfp[1] == '' && tfp[2] == '' && tfp[3] == '' && tfp[4] == '' && tfp[5] == '') { //不上传图片
                    uploadPicturesStatus = true
                    wx.hideLoading()
                    wx.showToast({
                      title: '上传成功',
                      icon: 'success'
                    })
                    // wx.navigateBack({
                    //   delta: 1
                    // })
                    wx.redirectTo({
                      url: '/pages/myExperience/myExperience',
                    })
                  } else {
                    that.uploadP(exp_id)
                  }
                } else {
                  wx.hideLoading()
                  // 视频上传失败
                  wx.showToast({
                    title: '上传失败',
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
            uploadVideoStatus = true
            if (tfp[0] == '' && tfp[1] == '' && tfp[2] == '' && tfp[3] == '' && tfp[4] == '' && tfp[5] == '') { //不上传图片
              uploadPicturesStatus = true
              wx.hideLoading()
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              })
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.redirectTo({
                url: '/pages/myExperience/myExperience',
              })
            } else {
              that.uploadP(exp_id)
            }
          }
        } else {
          wx.hideLoading()
          // 文字上传失败
          wx.showToast({
            title: '上传失败',
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
  uploadP: function(exp_id) {
    var imgs = this.data.imgs
    var tfp = this.data.tfp
    var that = this
    if (tfp[i] != '') {
      wx.uploadFile({
        url: app.globalData.requestUrl + 'api/index.php?ctl=image&act=exp_image&user_id=' + app.globalData.openid + '&id=' + exp_id + '&type=' + imgs[i], //上传图片
        filePath: tfp[i],
        header: {
          'content-type': 'multipart/form-data',
          'cookie': wx.getStorageSync("sessionid")
        },
        name: 'file',
        success: function(res) {

        },
        complete: function(res) {
          i++
          if (i == tfp.length) {
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })
            // wx.navigateBack({
            //   delta: 1
            // })
            wx.redirectTo({
              url: '/pages/myExperience/myExperience',
            })
          } else if (i < tfp.length) {
            that.uploadP(exp_id)
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
      i++
      if (i == tfp.length) {
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        })
        // wx.navigateBack({
        //   delta: 1
        // })
        wx.redirectTo({
          url: '/pages/myExperience/myExperience',
        })
      } else if (i < tfp.length) {
        that.uploadP(exp_id)
      }
    }
  },
  radioChange: function(e) {
    this.setData({
      exp_module: e.detail.value
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
    i = 0;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    i = 0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    i = 0;
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