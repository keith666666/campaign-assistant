// miniprogram/pages/campaign/campaignInfo/index.js
const app = getApp()

const db = wx.cloud.database()
const _ = db.command
const campaign = db.collection('campaign')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campaignInfo: {},
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const campaignItem = await campaign.doc(options.id).get()
    console.log(campaignItem)

    this.setData({
      campaignInfo: campaignItem.data,
      address: campaignItem.data.conditions.find(item => item.type === 'location').data.name
    })

    console.log(this.campaignInfo)
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
    let { name, joinedNumber, result: { data: { discount } } } = this.data.campaignInfo;
    let discountText = 10 - discount;
    let title = `${name}活动邀请您来领取${discountText}折折扣`;
    return {
      title,
      path: '/pages/index/index'
    }
  }
});