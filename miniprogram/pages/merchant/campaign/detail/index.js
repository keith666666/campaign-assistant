// miniprogram/pages/merchant/campaign/detail/index.js

let authHelper = require('../../../../helpers/auth-helper');
let dbHelper = require('../../../../helpers/db-helper');

function showToast(message) {
  wx.showToast({
    icon: 'none',
    title: message
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campaign: {
      name: null,
      targetText: null,
      conditions: [
        {
          type: 'location',
          data: {

          }
        }
      ],
      result: {
        type: 'coupon',
        data: {
          discount: null
        }
      },
      enabled: false
    },
    mode: 'create',//create or edit
    campaignIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { mode, index } = options;
    if (mode === 'edit') {
      let eventChannel = this.getOpenerEventChannel();
      // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      let self = this;
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        console.log('acceptDataFromOpenerPage');
        console.log(data);
        self.setData({
          campaign: data,
          mode: 'edit',
          campaignIndex: index
        });
      });
    }
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
  onSelectLocation() {
    console.log('onSelectLocation')
    let self = this;
    wx.chooseLocation({
      success: (res) => {
        console.log('onSelectLocation success');
        let { name, latitude, longitude } = res;
        let campaign = self.data.campaign;
        let condition = campaign.conditions[0];
        condition.data.name = name;
        condition.data.centerPoint = {
          coordinates: [longitude, latitude],
          type: 'Point'
        }
        self.setData({
          campaign
        });
      },
      fail() {
        authHelper.authorize('scope.userLocation', '授权申请', '该权限用于打开地图选择位置', (err, res) => {
          if (err) throw err;
          wx.chooseLocation({
            success(res) {
              console.log('onSelectLocation success');
              console.log(res);
              let { name, latitude, longitude } = res;
              let campaign = self.data.campaign;
              let condition = campaign.conditions[0];
              condition.data.name = name;
              condition.data.centerPoint = {
                coordinates: [longitude, latitude],
                type: 'Point'
              }
              self.setData({
                campaign
              });
            }
          });
        });
      }
    });
  },
  onSwitchChange(event) {
    let { value } = event.detail;
    this.data.campaign.enabled = value;
  },
  onTextInput(event) {
    let { currentTarget: { dataset: { key } }, detail: { value } } = event;
    let campaign = this.data.campaign;
    switch (key) {
      case 'name': {
        campaign.name = value;
        break;
      }
      case 'targetText': {
        campaign.targetText = value;
        break;
      }
      case 'radius': {
        campaign.conditions[0].data.radius = value;
        break;
      }
      case 'discount': {
        campaign.result.data.discount = value;
        break;
      }
    }
  },
  onSave() {
    console.log('onSave')
    let { mode, campaign, campaignIndex } = this.data;
    let { name, targetText, conditions, result } = campaign;
    name = name ? name.trim() : null;
    if (!name) {
      showToast('无效的活动名称');
      return;
    }
    targetText = targetText ? targetText.trim() : null;

    if (!targetText) {
      showToast('无效的触发文字');
      return;
    }
    let condition = conditions[0];
    let radius = Number(condition.data.radius);
    if (isNaN(condition.data.radius)) {
      showToast('无效的距离');
      return;
    }
    condition.data.radius = radius;
    let discount = Number(result.data.discount);
    if (isNaN(discount) || discount < 0 || discount > 10) {
      showToast('无效的折扣力度');
      return;
    }
    result.data.discount = discount;
    console.log(JSON.stringify(campaign));
    let self = this;
    if (mode === 'create') {
      dbHelper.promisedCreateCampaign(campaign).then(campaignId => {
        showToast('创建成功');
        let eventChannel = self.getOpenerEventChannel();
        campaign._id = campaignId;
        eventChannel.emit('acceptDataFromOpenedPage', {
          mode: 'create',
          campaign
        });
        wx.navigateBack();
      }).catch(err => {
        console.log(err);
        showToast('触发文字已存在,请更换');
      });
    } else {
      // edit mode
      dbHelper.promisedUpdateCampaign(campaign).then(res => {
        showToast('更新成功');
        let eventChannel = self.getOpenerEventChannel();
        eventChannel.emit('acceptDataFromOpenedPage', {
          mode: 'update',
          campaignIndex,
          campaign
        });
        wx.navigateBack();
      }).catch(err => {
        console.log(err);
        showToast('更新失败');
      });
    }
  },
  onDelete() {
    let self = this;
    wx.showModal({
      title: '删除提示',
      content: '确定删除吗?',
      success(res) {
        if (res.confirm) {
          let { campaign, campaignIndex } = self.data;
          dbHelper.promisedDeleteCampaign(campaign).then(res => {
            if (res === 1) {
              showToast('删除成功');
              let eventChannel = self.getOpenerEventChannel();
              eventChannel.emit('acceptDataFromOpenedPage', {
                mode: 'delete',
                campaignIndex,
              });
              wx.navigateBack();
            } else {
              showToast('删除失败');
            }
          }).catch(err => {
            console.log(err);
            showToast('删除失败');
          });
        }
      }
    });
  }
})