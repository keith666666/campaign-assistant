'use strict';
let dbHelper = require('../helpers/db-helper');

// login method for both customer and merchant
function login(type = 'customer', cb) {
  let logPrefix = 'login';
  // 1. try to find user in cache
  wx.getStorage({
    key: type,
    complete(res) {
      console.log(logPrefix, `find ${type} in cache ?`, Boolean(res.data));
      let user = res.data;
      if (user) {
        cb(null, user);
      } else {
        // 2. try to login if cache miss
        wx.cloud.callFunction({
          name: 'login',
          success: res => {
            console.log('login success');
            console.log(res.result);
            let openId = res.result.openid;

            // 3. find or create user
            dbHelper.promisedFindOrCreateUser(type, openId).then(user => {
              // cache the data
              wx.setStorage({ key: type, data: user });
              cb(null, user);
            }).catch(cb);
          },
          fail: cb,
        });
      }
    }
  });
}

module.exports = {
  login
};