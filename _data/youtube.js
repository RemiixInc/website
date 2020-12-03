var request = require("sync-request");
var res = request(
  "GET",
  `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`,
  {
    headers: {
      "user-agent": "RemiixInc"
    }
  }
);
res = JSON.parse(res.getBody()).items[0].statistics;
module.exports = res;
