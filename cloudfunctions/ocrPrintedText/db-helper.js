'use strict';

async function getCampaigns(cloud) {
  const db = cloud.database();
  let { data: campaigns } = await db.collection('campaign').get();
  return campaigns;
}
module.exports = {
  getCampaigns
}