'use strict';

let app = getApp();
const db = wx.cloud.database();

// for customer and merchant
function promisedFindOrCreateUser(type = 'customer', openId) {
  let logPrefix = 'findOrCreateUser ' + type;
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
      }).catch(console.error);
      return promisedCreateUser;
    }
  });
  return promisedResult;
}

module.exports = {
  promisedFindOrCreateUser,
};