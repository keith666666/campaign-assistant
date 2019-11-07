'use strict';
let dbHelper = require('../helpers/db-helper');

let app = getApp();

function getCampaigns(cb) {
  let openId = app.globalData.merchant._openid;
  dbHelper.promisedGetCampaigns(openId).then(res => {
    cb(null, res);
  }).catch(cb);
}

function getCampaignsForCustomer(openId, cb) {
  const _openid = app.globalData.customer._openid
  wx.cloud.callFunction({
    name: 'getCampaigns',
    data: {
      _openid
    }
  }).then(res => {
    let campaigns = res.result.data;
    cb(null, campaigns);
  }).catch(err => {
    cb(err)
  });
}

module.exports = {
  getCampaigns,
  getCampaignsForCustomer
};