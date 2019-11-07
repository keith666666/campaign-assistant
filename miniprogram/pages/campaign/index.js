const app = getApp()

const db = wx.cloud.database()
const _ = db.command
const campaignCustomerLink = db.collection('campaign-customer-link')
const campaign = db.collection('campaign')

Page({

  data: {
    campaigns: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const _openid = app.globalData.customer._openid
    const campaigns = await wx.cloud.callFunction({
      name: 'getCampaigns',
      data: {
        _openid
      }
    })

    this.setData({
      campaigns: campaigns.result.data
    })

    console.log(campaigns)
  },

  goInfo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/campaignInfo/index?id='+id
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