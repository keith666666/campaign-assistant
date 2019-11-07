'use strict';
let dbHelper = require('../helpers/db-helper');

let app = getApp();

function getCampaigns(cb) {
  let openId = app.globalData.merchant._openid;
  dbHelper.promisedGetCampaigns(openId).then(res => {
    cb(null, res);
  }).catch(cb);
}

function getCampaignCustomerLinksForCustomer(cb) {
  const customerId = app.globalData.customer._id
  wx.cloud.callFunction({
    name: 'getCampaigns',
    data: {
      customerId
    }
  }).then(res => {
    console.log("getCampaignsForCustomer")
    console.log(res);
    let campaignCustomerLinks = res.result;
    cb(null, campaignCustomerLinks);
  }).catch(err => {
    cb(err)
  });
}

module.exports = {
  getCampaigns,
  getCampaignCustomerLinksForCustomer
};