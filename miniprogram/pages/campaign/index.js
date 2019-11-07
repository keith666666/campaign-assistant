const app = getApp()

const db = wx.cloud.database()
const _ = db.command
const campaignCustomerLink = db.collection('campaign-customer-link')
const campaign = db.collection('campaign')

const campaignHeler = require('../../controllers/campaign-controller');
let timeHelper = require('../../helpers/time-helper');

Page({

  data: {
    campaignCustomerLinks: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goInfo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/campaignInfo/index?id=' + id
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
    let self = this;
    campaignHeler.getCampaignCustomerLinksForCustomer((err, campaignCustomerLinks) => {
      if (err) {
        console.log(err);
      } else {
        console.log(JSON.stringify(campaignCustomerLinks));
        campaignCustomerLinks.forEach(item => {
          item.formattedCreated = timeHelper.formatTime2(new Date(item.created));
        });
        self.setData({
          campaignCustomerLinks
        });
      }
    });
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
  onItemTap(event) {
    console.log(event);
    let { currentTarget: { dataset: { index } } } = event;
    let link = this.data.campaignCustomerLinks[index];
    let linkJson = JSON.stringify(link);
    wx.navigateTo({
      url: '/pages/campaignInfo/index?link=' + linkJson
    });
  }
})