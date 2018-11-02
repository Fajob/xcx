// pages/addAddress/addAddress.js
const app = getApp()
var _type
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: ['选择省', '市', '区'],
        color: 'gray',
        pictureUrl: app.globalData.pictureUrl,
        id: "",
        s_id: "",
        checked: 'true',
        is_default: 0
    },

    change: function(e) {
        var is_default = e.currentTarget.dataset.is_default
        if (is_default == 0) {
            this.setData({
                is_default: 1
            })
        } else {
            this.setData({
                is_default: 0
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.edit == 1) {
            wx.setNavigationBarTitle({
                title: '编辑地址',
            })
        } else {
            wx.setNavigationBarTitle({
                title: '添加地址',
            })
        }
        if(options.type){
            _type = options.type
        }
        this.setData({
            id: app.globalData.openid,
            s_id: app.globalData.s_id
        })
        // 获取key为"editAddress"的storage
        function getUrl() {
            var page = getCurrentPages() //获取加载页面
            var pageObj = pages[pages.length - 1] //获取当前页面对象
            var options = pageObj.options //获取当前页面携带的参数
            return options
        }
        this.setData({
            form: options.edit
        })
        if (options.edit == 1) { //如果options.edit为1，证明为编辑页面，取storage里面的值，否则为添加页面，不取值
            wx.getStorage({
                key: "editAddress",
                success: res => {
                    var address = res.data.address
                    address = address.split(',')
                    this.setData({
                        color: 'black',
                        obj: res.data,
                        region: address,
                        is_default: res.data.is_default
                    })
                }
            })
        }

    },
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value,
            color: 'black'
        })
    },

    addSubmit: function(e) {
        var _form = e.currentTarget.dataset.form
        var is_default = e.detail.value.is_default
        if (_form == 0) {
            if (e.detail.value.user_name == "" || e.detail.value.user_phone == "" || e.detail.value.address == "" || e.detail.value.address1 == "") {
                wx.showToast({
                    title: '请补全地址信息',
                    icon: "none",
                    duration: 1500
                })
                return;
            } else {
                wx.request({
                    url: app.globalData.requestUrl + 'api/?ctl=user&act=add_address',
                    data: e.detail.value,
                    success: res => {
                        wx.showToast({
                            title: '添加成功',
                            icon: "success",
                            duration: 2000
                        })
                    }
                })
            }

        } else {
            wx.request({
                url: app.globalData.requestUrl + 'api/?ctl=user&act=update_address',
                data: e.detail.value,
                success: res => {
                    wx.showToast({
                        title: '更新成功',
                        icon: "success",
                        duration: 2000
                    })
                }
            })
        }
        if (_type == 3 && is_default == 1){
            wx.navigateBack({
               delta:2
            })
        }else{
            wx.navigateBack()
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