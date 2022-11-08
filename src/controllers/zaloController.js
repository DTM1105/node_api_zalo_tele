var fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
("use strict");

import { OA } from "zalo-api";

let handleUpload_file_api = async (req, res) => {
  try {
    let kqua;
    const newpath = __dirname;
    const file = req.files.file;
    const filename = file.name;
    let text = req.body.text1;
    let dsach = req.body.dsach;
    let list = dsach.split(",");
    console.log(list);
    file.mv(`${newpath}${filename}`, async (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      } else {
        console.log(file);
        const formData = new FormData();
        let path = `${newpath}${filename}`;
        formData.append("file", fs.createReadStream(path));

        var config = {
          method: "post",
          url: "https://openapi.zalo.me/v2.0/oa/upload/file",
          headers: {
            access_token: process.env.TOKEN_ZALO,
            ...formData.getHeaders(),
          },
          data: formData,
        };

        kqua = await axios(config)
          .then(function (response) {
            return response.data.data.token;
          })
          .catch(function (error) {
            console.log(error);
          });
        await list.map(async (user) => {
          handleSend_sms_api(text, user);
          handleSend_file_api(kqua, user);
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

let handleSend_file_api = async (req, res) => {
  try {
    var data = JSON.stringify({
      recipient: {
        user_id: res,
      },
      message: {
        attachment: {
          payload: {
            token: req,
          },
          type: "file",
        },
      },
    });

    var config = {
      method: "post",
      url: "https://openapi.zalo.me/v2.0/oa/message",
      headers: {
        access_token: process.env.TOKEN_ZALO,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (e) {
    console.log(e);
  }
};

//use zalo-api npm
let handleSend_sms_file = async (req, res) => {
  try {
    console.log(req.body.text1, req.body.user_id);
    OA.message({
      access_token: process.env.TOKEN_ZALO,
      recipient: {
        user_id: req.body.user_id,
      },
      message: {
        text: "Hello Zalo API",
      },
    });
  } catch (e) {
    console.log(e);
  }
};

//use api on web https://developers.zalo.me/
let handleSend_sms_api = async (req, res) => {
  try {
    var data = JSON.stringify({
      recipient: {
        user_id: res,
      },
      message: {
        text: req,
      },
    });

    var config = {
      method: "post",
      url: "https://openapi.zalo.me/v2.0/oa/message",
      headers: {
        access_token: process.env.TOKEN_ZALO,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (e) {
    console.log(e);
  }
};
let handleGet_info_user = async (user_idInput) => {
  var data = "";
  var user_id = user_idInput;
  var kqua = "";
  var config = {
    method: "get",
    url:
      "https://openapi.zalo.me/v2.0/oa/getprofile?data=%7B%22user_id%22%3A%22" +
      user_id +
      "%22%7D",
    headers: {
      access_token: process.env.TOKEN_ZALO,
    },
    data: data,
  };
  kqua = await axios(config)
    .then(function (response) {
      return response.data.data.display_name;
    })
    .catch(function (error) {
      console.log(error);
    });
  return kqua;
};

let getuser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data1 = "";
      var user_id1 = userId;
      let users = "";
      var config = {
        method: "get",
        url:
          "https://openapi.zalo.me/v2.0/oa/getprofile?data=%7B%22user_id%22%3A%22" +
          user_id1 +
          "%22%7D",
        headers: {
          access_token: process.env.TOKEN_ZALO,
        },
        data: data1,
      };
      users = await axios(config)
        .then(function (response) {
          return response.data.data.display_name;
        })
        .catch(function (error) {
          console.log(error);
        });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let handleGet_all_user = async (req, res) => {
  try {
    var list;
    var data = "";
    var config = {
      method: "get",
      url: "https://openapi.zalo.me/v2.0/oa/getfollowers?data=%7B%22offset%22%3A0%2C%22count%22%3A20%7D",
      headers: {
        access_token: process.env.TOKEN_ZALO,
      },
      data: data,
    };
    list = await axios(config)
      .then(function (response) {
        return response.data.data.followers;
      })
      .catch(function (error) {
        console.log(error);
      });
    var output = await await Promise.all(
      list.map(async function (user) {
        var data = "";
        var user_id = user.user_id;
        var config = {
          method: "get",
          url:
            "https://openapi.zalo.me/v2.0/oa/getprofile?data=%7B%22user_id%22%3A%22" +
            user_id +
            "%22%7D",
          headers: {
            access_token: process.env.TOKEN_ZALO,
          },
          data: data,
        };
        return await axios(config)
          .then(function (response) {
            return response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      })
    );
    console.log(output);
    res.send(output);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  handleSend_sms_file: handleSend_sms_file,
  handleGet_all_user: handleGet_all_user,
  handleGet_info_user: handleGet_info_user,
  handleSend_sms_api: handleSend_sms_api,
  handleUpload_file_api: handleUpload_file_api,
  handleSend_file_api: handleSend_file_api,
};
