'use strict';

async function getCampaigns(cloud) {
  const db = cloud.database();
  let { data: campaigns } = await db.collection('campaign').where({ enabled: true }).get();
  return campaigns;
}
module.exports = {
  getCampaigns
}