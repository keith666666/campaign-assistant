// miniprogram/pages/merchant/campaign/analytics/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campaignId: null,
    campaignName: null,
    total: 0,
    listData: [],
    groupedData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let { campaignId, campaignName } = options;
    // console.log(campaignId, campaignName);
    // todo: remove it
    let campaignId = '00e70074-f4dd-40ad-9d12-90f38056e6c6';
    let campaignName = '小程序云开发极限编程';
    this.setData({ campaignId, campaignName });
    wx.showLoading({
      title: '加载中',
    });

    // // todo: remove it
    // let result = { "total": 10, "listData": [{ "_id": "ca2e6eb55dc30f3e02a1e8a35630066c", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573064510063-gkm1vdm79rh", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "customerId": "4a741dc95dc2b2df027b910809d73769", "created": "2019-11-06T12:43:42.000Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "23db0a155dc30fdf02a3063039140369", "customerId": "4a741dc95dc2b2df027b910809d73769", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573064671534-tibb0uvbg2a", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "created": "2019-11-06T19:44:03.000Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "83cc88815dc2e686029faeda610bfacf", "customerId": "4a741dc95dc2b2df027b910809d73769", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573054085950-d0ribyfx0g", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "created": "2019-11-06T20:38:40.128Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "23db0a155dc310fb02a3194b7bd1e962", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "customerId": "4a741dc95dc2b2df027b910809d73769", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573064955391-hzshcihbrd", "created": "2019-11-06T20:47:56.330Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "ca40fca95dc315d702a6e39051cfb302", "customerId": "4a741dc95dc2b2df027b910809d73769", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573066199021-bof5xn9c1zn", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "created": "2019-11-06T20:47:56.330Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "4a741dc95dc316b602a2f1e660c1181c", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573066421803-bnetxbh30do", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "customerId": "4a741dc95dc2b2df027b910809d73769", "created": "2019-11-06T20:47:56.330Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "83cc88815dc316f302a6dd2b3e80d94a", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "customerId": "4a741dc95dc2b2df027b910809d73769", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573066482620-7f558chgxgx", "created": "2019-11-06T20:47:56.330Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "4a741dc95dc3170502a2f7151dd7e80b", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573066500855-ki1oqra4ec", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "customerId": "4a741dc95dc2b2df027b910809d73769", "created": "2019-11-06T20:47:56.330Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "23db0a155dc3177302a386fa6c8a5669", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573066610770-ozklymbf2e", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU", "customerId": "4a741dc95dc2b2df027b910809d73769", "created": "2019-11-06T20:47:56.330Z", "customer": { "_id": "4a741dc95dc2b2df027b910809d73769", "info": {}, "created": "2019-11-06T11:47:43.708Z", "_openid": "o3g-25A675LW6uzZUkUV75bZvlVU" } }, { "_id": "83cc88815dc31e2b02a7555b628d2ad3", "_openid": "o3g-25Cky5TouL9y8ZRYx6XcbSGQ", "customerId": "ca2e6eb55dc2afc90278cdca6d202645", "campaignId": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "resultId": "1573068330507-ws19x9uilb", "created": "2019-11-06T20:47:56.330Z", "customer": { "_id": "ca2e6eb55dc2afc90278cdca6d202645", "info": {}, "created": "2019-11-06T11:34:33.391Z", "_openid": "o3g-25Cky5TouL9y8ZRYx6XcbSGQ" } }], "groupedData": [{ "_id": "2019-11-06 20", "num": 1 }, { "_id": "2019-11-07 03", "num": 1 }, { "_id": "2019-11-07 04", "num": 8 }] };
    // let { total, listData, groupedData } = result;
    // this.setData({
    //   total, listData, groupedData
    // });
    // wx.hideLoading()

    // return;
    let self = this;
    wx.cloud.callFunction({
      name: 'analytics',
      data: {
        campaignId
      },
      success: res => {
        wx.hideLoading();
        console.log('get analytics success');
        console.log(res.result);
        let { total, listData, groupedData } = res.result;
        self.setData({
          total, listData, groupedData
        });
        console.log(JSON.stringify(res.result));
      },
      fail: err => {
        wx.hideLoading();
        console.log(err);
      },
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