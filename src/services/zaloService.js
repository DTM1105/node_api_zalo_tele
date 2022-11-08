const axios = require("axios");

let getUser = () => {
    return new Promise(async(resolve,reject)=>{
        try {
            var list='';
            var data = "";
            var config = {
              method: "get",
              url: "https://openapi.zalo.me/v2.0/oa/getfollowers?data=%7B%22offset%22%3A0%2C%22count%22%3A20%7D",
              headers: {
                access_token:process.env.TOKEN_ZALO
              },
              data: data,
            };
        
            axios(config)
              .then(function (response) {
                res.send(response.data.data.followers);
              })
              .catch(function (error) {
                console.log(error);
              });
            resolve();
          } catch (e) {
            reject(e);
          }
    })
}

module.exports = {
    getUser:getUser,

}