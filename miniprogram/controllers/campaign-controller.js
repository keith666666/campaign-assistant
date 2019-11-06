'use strict';
let dbHelper = require('../helpers/db-helper');

let app = getApp();

function getCampaigns(cb) {
  let openId = app.globalData.merchant._openid;
  dbHelper.promisedGetCampaigns(openId).then(res => {
    cb(null, res);
  }).catch(cb);
}


module.exports = {
  getCampaigns,

};