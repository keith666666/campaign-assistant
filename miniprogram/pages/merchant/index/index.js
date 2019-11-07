// miniprogram/pages/merchant/index/index.js
const app = getApp()
let indexController = require('../../../controllers/index-controller');
let campaignController = require('../../../controllers/campaign-controller');

function navigateToDetailPage(self, mode, index) {
  wx.navigateTo({
    url: `../campaign/detail/index?mode=${mode}&index=${index}`,
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      acceptDataFromOpenedPage: function (data) {
        let { mode, campaign, campaignIndex } = data;
        let { campaigns } = self.data;
        console.log('acceptDataFromOpenedPage')
        console.log(data)
        switch (mode) {
          case 'create': {
            campaigns.push(campaign);
            break;
          }
          case 'update': {
            campaigns[campaignIndex] = campaign;
            break;
          }
          case 'delete': {
            campaigns.splice(campaignIndex, 1);
            break;
          }
        }
        self.setData({ campaigns });
      },
    },
    success: function (res) {
      // 通过eventChannel向被打开页面传送数据
      if (index > -1) {
        let campaign = self.data.campaigns[index];
        res.eventChannel.emit('acceptDataFromOpenerPage', campaign)
      }
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    campaigns: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    indexController.login('merchant', (err, user) => {
      if (err) console.log(err);
      else {
        app.globalData.merchant = user;
        console.log(user);
        // todo: remove it
        // let campaigns = [{ "_id": "00e70074-f4dd-40ad-9d12-90f38056e6c6", "_openid": "o3g-25Cky5TouL9y8ZRYx6XcbSGQ", "conditions": [{ "data": { "endTime": "2019-11-07T10:40:12.000Z", "startTime": "2019-11-05T16:00:00.000Z" }, "type": "time" }, { "data": { "centerPoint": { "type": "Point", "coordinates": [116.45120239257812, 39.91256332397461] }, "name": "嘉里大酒店", "radius": 2000 }, "type": "location" }], "created": "2019-11-06T09:36:00.000Z", "joinedNumber": 3, "name": "小程序云开发极限编程", "result": { "data": { "discount": 10 }, "type": "coupon" }, "targetText": "小程序云开发" }, { "_id": "ca40fca95dc311d302a6a08b76f2f4c5", "_openid": "o3g-25Cky5TouL9y8ZRYx6XcbSGQ", "conditions": [{ "data": { "radius": 2 }, "type": "location" }], "created": "2019-11-06T18:32:51.543Z", "enabled": true, "joinedNumber": 0, "name": "test", "result": { "data": { "discount": 2 }, "type": "coupon" }, "targetText": "2" }, { "_id": "ca40fca95dc3129f02a6ae5f0aee12a6", "_openid": "o3g-25Cky5TouL9y8ZRYx6XcbSGQ", "conditions": [{ "data": { "centerPoint": { "type": "Point", "coordinates": [116.44165, 39.92229] }, "name": "朝外MEN写字中心A座", "radius": 3 }, "type": "location" }], "created": "2019-11-06T18:36:15.338Z", "enabled": true, "joinedNumber": 0, "name": "31", "result": { "data": { "discount": 3 }, "type": "coupon" }, "targetText": "31" }];
        // self.setData({
        //   campaigns
        // });
        // return;
        campaignController.getCampaigns((err, campaigns) => {
          if (err) console.log(err);
          else {
            console.log(JSON.stringify(campaigns));
            self.setData({
              campaigns
            });
          }
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

  },
  onAnalytics(event) {
    let { currentTarget: { dataset: { index } } } = event;
    let campaign = this.data.campaigns[index];
    wx.navigateTo({
      url: `../campaign/analytics/index?campaignId=${campaign._id}&&campaignName=${campaign.name}`
    });
  },
  onEdit(event) {
    let { currentTarget: { dataset: { index } } } = event;
    navigateToDetailPage(this, 'edit', index);
  },
  onCreate(event) {
    navigateToDetailPage(this, 'create');
  }
})