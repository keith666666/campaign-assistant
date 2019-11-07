//index.js
const app = getApp()
let indexController = require('../../controllers/index-controller');
const timeHelpe = require('../../helpers/time-helper.js')

const localLongitude = 116.45120239257812
const localLatitude = 39.91256332397461

const db = wx.cloud.database()
const _ = db.command
const campaignCustomerLink = db.collection('campaign-customer-link')
const campaign = db.collection('campaign')

// wx.showShareMenu({
//   withShareTicket: true
// })

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    latitude: 39.91256332397461,
    longitude: 116.45120239257812,

    markers: [{
      id: 0,
      latitude: 39.91256332397461,
      longitude: 116.45120239257812,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    circles: [{
      latitude: localLatitude,
      longitude: localLongitude,
      radius: 500,
      fillColor: '#0000001c'
    }]
    // controls: [{
    //   id: 1,
    //   iconPath: '../../image/location.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    indexController.login('customer', (err, user) => {
      if (err) console.log(err);
      else {
        app.globalData.customer = user;
        console.log('user', user);
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy

        console.log('location info', res)

        this.setData({
          latitude,
          longitude
        })
        app.globalData.longitude = longitude;
        app.globalData.latitude = latitude;
      }
    })
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },

  onShow: function () {
    // wx.getShareInfo({
    //   shareTicket: 'fenxiang',
    //   timeout: 1000,
    //   success: function(res) {
    //     console.log(res)
    //   },
    //   fail: function() {},
    // })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },

  onShareAppMessage: function () {
    console.log('分享成功')
  },

  goMerchant: function () {
    wx.navigateTo({
      url: '/pages/merchant/index/index',
    })
  },

  handleOcr: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        wx.showLoading({
          title: '扫描识别中',
        });

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2)}`;
        const fileExtension = filePath.split('.').pop() || '.png';
        const customerId = app.globalData.customer ? app.globalData.customer._id : 'all'
        const cloudPath = `customers/${customerId}/${filename}.${fileExtension}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: async res => {
            console.log('[上传文件] 成功：', res)

            const ocrRes = await wx.cloud.callFunction({
              name: 'ocrPrintedText',
              data: {
                fileID: res.fileID
              }
            })

            // 识别成功
            if (ocrRes.result && ocrRes.result.length) {
              const resFirst = ocrRes.result[0]
              const campaignId = resFirst._id
              const locationCondition = resFirst.conditions.find(item => item.type === 'location')

              const centerLng = locationCondition.data.centerPoint.coordinates[0]
              const centerLat = locationCondition.data.centerPoint.coordinates[1]
              const centerRadius = locationCondition.data.centerPoint.radius

              const distance = this.getDistance(
                this.data.latitude,
                this.data.longitude,
                centerLat,
                centerLng
              )

              if (distance * 1000 > centerRadius) {
                wx.hideLoading();
                wx.showToast({
                  title: '请到指定地点扫描打卡',
                })
                return
              }


              const resultId = `${Date.now()}-${Math.random().toString(36).substr(2)}`

              const ifExits = await campaignCustomerLink.where({
                campaignId,
                customerId
              }).get()

              if (ifExits.data && ifExits.data.length) {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '您已经打卡，无需再打卡。',
                })
                return
              }

              campaignCustomerLink.add({
                data: {
                  customerId,
                  campaignId,
                  resultId,
                  created: db.serverDate()
                },
                success: async (res) => {
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '打卡成功，已发放优惠券',
                  })

                  // 活动参加人数加1
                  await wx.cloud.callFunction({
                    name: 'joinedNumberInc',
                    data: {
                      campaignId
                    }
                  })
                },
                fail: err => {
                  wx.hideLoading()
                  console.error(err);
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '打卡失败，请到指定区域范围内打卡，并扫描带有活动关键字的图片。',
              })
            }


          },
          fail: e => {
            wx.hideLoading();
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '识别失败',
            })
          },
          complete: () => {
            // wx.hideLoading()
          }
        })
      }
    })
  },

  getDistance(lat1, lng1, lat2, lng2) {
    const radLat1 = lat1 * Math.PI / 180.0;
    const radLat2 = lat2 * Math.PI / 180.0;
    const a = radLat1 - radLat2;
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }

})
