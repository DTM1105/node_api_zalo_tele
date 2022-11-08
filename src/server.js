import express, { response } from "express";

import bodyParser from "body-parser";

import viewEngine from "./config/viewEngine";

import initWebRoutes from "./route/web";
require("dotenv").config();

const axios = require("axios");

const request = require("request");
const fs = require("fs");
const FormData = require("form-data");
var qs = require("qs");
const fileupload = require("express-fileupload");

import { Api, TelegramClient, errors } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";

const apiId = 12666693;
const apiHash = "3e19194954ad1658c1cf44241eec4ad9";
const stringSession = new StringSession("");
let app = express();
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(express.static("files"));
let encodeUrl = bodyParser.urlencoded({ extended: false });
app.use(express.static("public"));

viewEngine(app);
initWebRoutes(app);

//auth telegram app use gramJS
app.get("/auth_tele", encodeUrl, async (req, res) => {
  (async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
    await client.sendMessage("me", { message: "Hello!" });
  })();
});
app.get("/test", encodeUrl, async (req, res) => {
  try {
    const session = new StringSession(process.env.sessionTele);
    const client = new TelegramClient(session, apiId, apiHash, {});
    await client.connect();
    var data = fs.readFileSync("srcminh.txt");
    let dsach = [];
    var output = data.toString();
    const arr = output.split(",");
    for (var i = 0; i < arr.length; ) {
      let out = { username: "", chat_id: "", title: "" };
      out.username = arr[i];
      out.chat_id = arr[i + 1];
      out.title = arr[i + 2];
      dsach.push(out);
      i = i + 3;
    }
    let list_sms = await await Promise.all(
      dsach.map(async function (chat) {
        const result = await client.invoke(
          new Api.messages.GetHistory({
            peer: chat.username,
            offsetId: 43,
            offsetDate: 43,
            addOffset: 0,
            limit: 100,
            maxId: 0,
            minId: 0,
            hash: BigInt("-4156887774564"),
          })
        );
        // let out = [];
        // result.messages.map( async (item) => {
        //   if (item.fromId !== null) {
        //     if (
        //       item.fromId.userId.toString() !== "1580604292" &&
        //       item.fromId.userId.toString() !== "5408308785"
        //     ) {
        //       let sms = {};
        //       let ten = item.document.attributes[0];
        //       let document = await handleGetFile(item.document);
        //       if(ten !== null){
        //         sms.filename = ten.fileName
        //       }
        //       sms.title = chat.title;
        //       sms.userId = item.fromId.userId.toString();
        //       sms.channelId = item.peerId.channelId.toString();
        //       sms.message = item.message;
        //       var date = new Date(item.date * 1000);
        //       sms.date = date.toUTCString().toString();
        //       console.log(sms.document)
        //       //sms.document = document;
        //        out.push(sms);
        //     }
        //   }
        // });
        return result;
      })
    );
    const simplifyArray = (arr = []) => {
      const res = [];
      arr.forEach((element) => {
        element.forEach((el) => {
          res.push(el);
        });
      });
      return res;
    };
    console.log(simplifyArray(list_sms));
    res.send(simplifyArray(list_sms));
  } catch (e) {
    console.log(errors.FloodWaitError.seconds);
  }
});
// get File use bot api
app.get("/getFile", encodeUrl, async (req, res) => {
  // var data = qs.stringify({
  //   chat_id: "-1006249011569812834041",
  // });
  var id = 6249011569812834041n;
  var file_id =
    "BQACAgUAAx0CbnK0IQADCmNfzbXI--SAsOazo1TfDrK6ICAGAAJ1BwACwOAAAVcfPbQb_6newSoE";
  console.log(file_id);
  var token = process.env.TOKEN_BOT_TELE;
  var config = {
    method: "get",
    url: `https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  //     BQACAgUAAx0CbnK0IQADBWNWdS9WhbY-CumRc2NDHg8URHnKAAL5BgAC6vK4VomEVKEj3rw2KgQ
  // {
  //   ok: true,
  //   result: {
  //     file_id: 'BQACAgUAAx0CbnK0IQADBWNWdS9WhbY-CumRc2NDHg8URHnKAAL5BgAC6vK4VomEVKEj3rw2KgQ',
  //     file_unique_id: 'AgAD-QYAAuryuFY',
  //     file_size: 11481,
  //     file_path: 'documents/file_0.docx'
  //   }
  // }
});
app.get("/getabc", encodeUrl, async(req,res)=> {
  const session = new StringSession(process.env.sessionTele)
  const client = new TelegramClient(session, apiId, apiHash, {});

  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(
    new Api.upload.GetFile({
      location: new Api.InputFileLocation({
        volumeId: BigInt("-4156887774564"),
        localId: 43,
        secret: BigInt("-4156887774564"),
        fileReference: Buffer.from("arbitrary data here"),
      }),
      offset: BigInt("-4156887774564"),
      limit: 100,
      precise: true,
      cdnSupported: true,
    })
  );
  console.log(result); // prints the result
})
app.get("/getadmin", encodeUrl, async (req, res) => {
  const session = new StringSession(process.env.sessionTele)
  const client = new TelegramClient(session, apiId, apiHash, {});

  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(
    new Api.messages.GetHistory({
      peer: "dtm_group_test",
      offsetId: 43,
      offsetDate: 43,
      addOffset: 0,
      limit: 100,
      maxId: 0,
      minId: 0,
      hash: BigInt("-4156887774564"),
    })
  );
  let arr = [];
  result.messages.map(async (chat) => {
    if (chat.fromId !== null) {
      if (
        chat.fromId.userId.toString() !== "1580604292" &&
        chat.fromId.userId.toString() !== "5408308785"
      ) {
        arr.push(chat.document);
      }
    }
  });
  console.log(arr)
  let file = arr[3];
  const result1 = await client.invoke(
    new Api.upload.GetFile({
      precise: true,
      cdnSupported: true,
      location: new Api.InputDocumentFileLocation({
        id: file.id,
        accessHash: file.accessHash,
        fileReference: Buffer.from(file.fileReference),
        thumbSize: "",
      }),
      offset: 0,
      limit: 524288,
    })
  );
  console.log(Buffer.from(result1.bytes).toString('hex'))
  // let buf = Buffer.from(arr[3])
  // console.log(buf);
//   function bufferFromBufferString(bufferStr) {
//     return Buffer.from(
//         bufferStr
//             .replace(/[<>]/g, '') // remove < > symbols from str
//             .split(' ') // create an array splitting it by space
//             .slice(1) // remove Buffer word from an array
//             .reduce((acc, val) => 
//                 acc.concat(parseInt(val, 16)), [])  // convert all strings of numbers to hex numbers
//      )
// }
// const newBuffer = bufferFromBufferString('<Buffer 02 6e 72 b4 21 00 00 00 05 63 60 bc cd b1 85 2b ce 1e d7 0f 79 f1 38 6f 8a 92 d8 4b 87>');

// console.log(newBuffer.toString())
});

app.get("/getmess", encodeUrl, async (req, res) => {
  const session = new StringSession(process.env.sessionTele)
  const client = new TelegramClient(session, apiId, apiHash, {});
  await client.connect(); // This assumes you have already authenticated with .start()
  let kqua = [];
  const result = await client.invoke(
    new Api.messages.GetHistory({
      peer: "dtm_group_test",
      offsetId: 43,
      offsetDate: 43,
      addOffset: 0,
      limit: 100,
      maxId: 0,
      minId: 0,
      hash: BigInt("-4156887774564"),
    })
  );
  result.messages.map(async (chat) => {
    if (chat.fromId !== null) {
      if (
        chat.fromId.userId.toString() !== "1580604292" &&
        chat.fromId.userId.toString() !== "5408308785"
      ) {
        console.log(chat.document);

        const result = await client.invoke(
          new Api.upload.GetFile({
            precise: true,
            cdnSupported: true,
            location: new Api.InputDocumentFileLocation({
              id: chat.document.id,
              accessHash: chat.document.accessHash,
              fileReference: Buffer.from(chat.document.fileReference),
              thumbSize: "",
            }),
            offset: 0,
            limit: 524288,
          })
        );
        console.log(result);
      }
    }
  });
});
app.get("/channels", encodeUrl, async (req, res) => {
  var data = qs.stringify({
    chat_id: "-640449525",
  });
  var token = process.env.TOKEN_BOT_TELE;
  var config = {
    method: "get",
    url: `https://api.telegram.org/bot${token}/getUpdates?chat_id=-640449525`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    //data:data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

  // console.log(kq.message);
  // kq.map((user)=>{
  //   if(user.message.document !== undefined){
  //     console.log(user.message);
  //   }
  // })
});
//Chạy thành công
app.get("/getUpdate", encodeUrl, async (req, res) => {
  var token = process.env.TOKEN_BOT_TELE;
  var config = {
    method: "get",
    url: `https://api.telegram.org/bot${token}/getUpdates`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  await axios(config)
    .then(function (response) {
      console.log(response.data.result[0]);
    })
    .catch(function (error) {
      console.log(error);
    });
  // list.map((user) => {
  //   if (!user.channel_post) {
  //     // let out = {title:'',chat_id:''};
  //     // out.title = user.my_chat_member.chat.title;
  //     // out.chat_id = user.my_chat_member.chat.id;
  //     const index = data.indexOf(user.my_chat_member.chat.id.toString());
  //     if (index === -1) {
  //       kqua.push(user.my_chat_member.chat.title);
  //       kqua.push(user.my_chat_member.chat.id);
  //     }
  //     //kqua = kqua + ";" + user.my_chat_member.chat.title + ";" + user.my_chat_member.chat.id;
  //   } else {
  //     // let out = {title:'',chat_id:''};
  //     // out.title = user.channel_post.chat.title;
  //     // out.chat_id = user.channel_post.chat.id;
  //     const index = data.indexOf(user.channel_post.chat.id.toString());
  //     if (index === -1) {
  //       kqua.push(user.channel_post.chat.title);
  //       kqua.push(user.channel_post.chat.id);
  //     }
  //     //kqua = kqua + ";" + user.channel_post.chat.title + ";" + user.channel_post.chat.id;
  //   }
  // });
  // if (data.toString().length !== 0) {
  //   kqua = "," + kqua;
  // }
  // if (kqua.length !== 1) {
  //   fs.appendFile("srcminh.txt", kqua.toString(), function (err) {
  //     if (err) {
  //       return console.error(err);
  //     }
  //   });
  // }
  // let dsach_final = [];
  // var output = fs.readFileSync("srcminh.txt").toString();
  // const arr = output.split(",");
  // for (var i = 0; i < arr.length; ) {
  //   let out = { title: "", chat_id: "" };
  //   out.title = arr[i];
  //   out.chat_id = arr[i + 1];
  //   dsach_final.push(out);
  //   i = i + 2;
  // }
  // res.send(dsach_final);
});

//Test gửi file từ react xuống node
// app.post("/upload", (req, res) => {
//     // use modules such as express-fileupload, Multer, Busboy

//     setTimeout(() => {
//         console.log('file uploaded',req.body.newFile)
//         return res.status(200).json({ result: true, msg: 'file uploaded from backend' });
//     }, 3000);
// });

app.post("/upload", (req, res) => {
  const newpath = __dirname;
  const file = req.files.file;
  const filename = file.name;

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    } else {
      console.log(file);
      res.status(200).send({ message: "File Uploaded", code: 200 });
    }
  });
});

app.delete("/upload", (req, res) => {
  console.log(`File deleted`);
  return res.status(200).json({ result: true, msg: "file deleted" });
});

//ZALO test
app.get("/zalo/getInfoUser", (req, res) => {
  var data = "";

  var config = {
    method: "get",
    url: "https://openapi.zalo.me/v2.0/oa/getfollowers?data=%7B%22offset%22%3A0%2C%22count%22%3A20%7D",
    headers: {
      access_token: process.env.TOKEN_ZALO,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const people = response.data.data.followers;
      people.forEach((person) => {
        for (const key in person) {
          // console.log(`${key}: ${person[key]}`);
          var data = "";
          var user_id = person[key];
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

          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data.data.display_name));
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/zalo/getUser", (req, res) => {
  var data = "";
  var user_id = "1452801887520312257";
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

  axios(config)
    .then(function (response) {
      res.send(JSON.stringify(response.data.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/zalo/getAllUsers", (req, res) => {
  var data = "";

  var config = {
    method: "get",
    url: "https://openapi.zalo.me/v2.0/oa/getfollowers?data=%7B%22offset%22%3A0%2C%22count%22%3A20%7D",
    headers: {
      access_token: process.env.TOKEN_ZALO,
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.data));
      res.send(JSON.stringify(response.data.data.followers));
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/zalo/sendsms", (req, res) => {
  var data = JSON.stringify({
    recipient: {
      user_id: "1452801887520312257",
    },
    message: {
      text: "hello, world! from nodeJS",
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
});

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port);
});
