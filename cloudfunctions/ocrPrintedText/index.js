// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const dbHelper = require('./db-helper');

async function getFileURL(fileID) {
  let fileList = [fileID];
  let fileURLResult = await cloud.getTempFileURL({
    fileList: fileList,
  });
  let fileURL = fileURLResult.fileList[0].tempFileURL;
  console.log('tempFileURL:', fileURL);
  return fileURL;
}
async function parseImage(fileURL) {
  // encoded file url
  fileURL = encodeURIComponent(fileURL);

  let ocrResult = await cloud.openapi.ocr.printedText({
    type: 'photo',
    imgUrl: fileURL,
  });
  console.log('ocrResult---');
  console.log(ocrResult);

  let { errCode, items } = ocrResult;
  if (errCode !== 0 || !Array.isArray(items) || items.length === 0) {
    throw new Error('invalid result');
  }
  return ocrResult;
}
async function decodeOCRResult(ocrResult) {
  let textItems = ocrResult.items.map(item => item.text);
  let allTexts = textItems.join('');
  console.log('decodeOCRResult:', allTexts);
  return allTexts;
}

async function searchMatchedCampaign(text) {
  if (!text) return [];
  let campaigns = await dbHelper.getCampaigns(cloud);
  // let campaigns = [
  //   {
  //     name: 'test',
  //     targetText: '小程序',
  //     conditions: [],
  //     result: []
  //   }
  // ];
  let matchedCampaigns = campaigns.filter(campaign => text.indexOf(campaign.targetText) > -1);
  console.log('matchedCampaigns---')
  console.log(JSON.stringify(matchedCampaigns));
  return matchedCampaigns;
}

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let { fileID } = event;
    // fileID = 'cloud://xly-4aiv8.786c-xly-4aiv8-1300617887/WechatIMG116.jpeg';
    let fileURL = await getFileURL(fileID);
    let ocrResult = await parseImage(fileURL);
    let text = await decodeOCRResult(ocrResult);
    let campaigns = await searchMatchedCampaign(text)
    return campaigns;
  } catch (error) {
    console.log('ocr error---');
    console.log(error);
    return error;
  }
}