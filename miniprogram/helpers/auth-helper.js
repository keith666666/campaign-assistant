'use strict';
function authorize(scope, title, content, cb) {
  wx.getSetting({
    success(res) {
      if (res.authSetting[scope]) {
        cb(null, res);
      } else {
        wx.showModal({
          title, content,
          success(res) {
            if (!res.confirm) {
              cb(new Error('授权失败'))
              return;
            }
            wx.openSetting({
              success(res) {
                if (res.authSetting[scope] === true) {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                  })
                  cb(null, res);
                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'success',
                  });
                  cb(new Error('授权失败'))
                }
              }
            });
          }
        });
      }
    }
  });
}
module.exports = {
  authorize
}