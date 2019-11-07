// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

async function getListData(campaignId) {
  let result = await db.collection('campaign-customer-link').aggregate()
    .match({
      campaignId
    })
    .lookup({
      from: "customer",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    })
    .unwind('$customer')
    .sort({
      created: 1,
    })
    .end();
  return result.list;
}
async function getGroupedData(campaignId) {
  const $ = db.command.aggregate
  let result = await db.collection('campaign-customer-link').aggregate()
    .match({
      campaignId
    })
    .project({
      formattedCreated: $.dateToString({
        date: '$created',
        format: '%Y-%m-%d %H',
        timezone: 'Asia/Shanghai'
      })
    })
    .group({
      _id: '$formattedCreated',
      num: $.sum(1)
    })
    .sort({
      _id: 1,
    })
    .end();
  return result.list;
}
// 云函数入口函数
exports.main = async (event, context) => {
  let { campaignId } = event;
  let listData = await getListData(campaignId);
  let groupedData = await getGroupedData(campaignId);
  let result = {
    total: listData.length,
    listData,
    groupedData
  }
  console.log('analytics---')
  console.log(result);

  return result;
}