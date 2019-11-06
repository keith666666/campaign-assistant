// miniprogram/pages/merchant/campaign/list/index.js
let campaignController = require('../../../../controllers/campaign-controller');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campaigns: [
      // {
      //     name: 'test',
      //     targetText: '小程序',
      //     conditions: [],
      //     result: []
      //   }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    campaignController.getCampaigns((err, data) => {
      if (err) console.log(err);
      else {
        // app.globalData.merchant = user;
        self.setData({
          campaigns: data
        });
      }
    });
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