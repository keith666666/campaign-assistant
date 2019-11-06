'use strict';

let app = getApp();
const db = wx.cloud.database();

// for customer and merchant
function promisedFindOrCreateUser(type = 'customer', openId) {
  let logPrefix = 'promisedFindOrCreateUser ' + type;
  console.log(logPrefix, 'openId:', openId);

  let collectionName = type;
  let promisedResult = db.collection(collectionName).where({
    _openid: openId
  }).get().then(res => {
    console.log(logPrefix, 'result');
    console.log(res.data);
    let userExist = (res.data.length === 1);
    console.log(logPrefix, 'find user in db?', userExist);
    if (userExist) {
      // find it
      return res.data[0];
    } else {
      // not found, create one
      let user = {
        info: {},
        created: db.serverDate()
      };
      let promisedCreateUser = db.collection(collectionName).add({
        // data 字段表示需新增的 JSON 数据
        data: user
      }).then(res => {
        console.log(res);
        console.log(logPrefix, 'create user?', Boolean(res._id));
        user._id = res._id;
        return user;
      });
      return promisedCreateUser;
    }
  });
  return promisedResult;
}


function promisedGetCampaigns(openId) {
  let logPrefix = 'promisedGetCampaigns';
  console.log(logPrefix, 'openId:', openId);
  let promisedResult = db.collection('campaign').where({
    _openid: openId
  }).get().then(res => {
    console.log(logPrefix, 'result');
    console.log(res.data);
    return res.data;
  });
  return promisedResult;
}

function promisedCreateCampaign(rawCampaign) {
  let logPrefix = 'promisedCreateCampaign';
  rawCampaign.created = db.serverDate();
  rawCampaign.joinedNumber = 0;
  let promisedResult = db.collection('campaign').add({
    data: rawCampaign
  }).then(res => {
    console.log(logPrefix, 'result');
    console.log(res._id);
    return res._id;
  });
  return promisedResult;
}
function promisedUpdateCampaign(campaign) {
  let logPrefix = 'promisedUpdateCampaign';
  let { name, targetText, conditions, result, enabled } = campaign;
  let updatedData = { name, targetText, conditions, result, enabled };
  let promisedResult = db.collection('campaign').doc(campaign._id).update({
    data: updatedData
  }).then(res => {
    console.log(logPrefix, 'result');
    console.log(res.stats.updated);
    return res.stats.updated;
  });
  return promisedResult;
}
function promisedDeleteCampaign(campaign) {
  let logPrefix = 'promisedDeleteCampaign';
  let promisedResult = db.collection('campaign').doc(campaign._id).remove().then(res => {
    console.log(logPrefix, 'result');
    console.log(res.stats.removed);
    return res.stats.removed;
  });
  return promisedResult;
}

module.exports = {
  promisedFindOrCreateUser,
  promisedGetCampaigns,
  promisedCreateCampaign,
  promisedUpdateCampaign,
  promisedDeleteCampaign
};