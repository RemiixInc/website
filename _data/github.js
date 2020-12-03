var request = require("sync-request");
var res = request("GET", "https://api.github.com/users/RemiixInc", {
  headers: {
    "user-agent": "RemiixInc"
  }
});
res = JSON.parse(res.getBody());
module.exports = res;
