// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const campaignCustomerLink = db.collection('campaign-customer-link')
const campaign = db.collection('campaign')

// 云函数入口函数
exports.main = async (event, context) => {
  const { _openid } = event

  const ret = await campaignCustomerLink.where({ _openid }).get()

  if (ret.data && ret.data.length) {
    const campaignIds = [...new Set(ret.data.map(item => item.campaignId))]

    const campaigns = campaign.where({ _id: _.in(campaignIds)} ).get()
    return campaigns
  }


  return []

}