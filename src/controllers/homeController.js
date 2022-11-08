var fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";

const apiId = 12666693;
const apiHash = "3e19194954ad1658c1cf44241eec4ad9";

let getHomePage = async (req, res) => {
  let data = req.body;
  try {
    var my_text = `Result is:  
     <b>-Text1:</b>  <i>${req.body.text1}</i> `;
    //  <b>-File:</b>  <i>${req.body.file1}</i>`
    var token = process.env.TOKEN_BOT_TELE;
    var chat_id = -1001628397471;
    //var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${my_text}&parse_mode=html`;
    //var urlendcode = encodeURI(url);

    // Open file demo.txt in read mode
    //fs.open('minh.txt', 'r');
    var send_document = `https://api.telegram.org/bot${token}/sendDocument?chat_id=${chat_id}&caption=${my_text}&files=fs.open('minh.txt', 'r')&parse_mode=html`;
    var urlendcode = encodeURI(send_document);
    // data = {
    //   'chat_id': bot_chatId,
    //   'parse_mode':'HTML',
    //   'caption':my_text
    //    }

    // r = requests.post(send_document, data=data, files=open('test.txt','rb'),stream=True)

    axios
      .get(urlendcode)
      .then((response) => {
        console.log(response.data.url);
        console.log(response.data.explanation);
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    console.log(e);
  }
};

let gethomepage = async (req, res) => {
  try {
    return res.render("homepage.ejs");
  } catch (e) {
    console.log(e);
  }
};

// Api hoạt động
let handleSend_sms_file2 = async (req, res) => {
  try {
    const newpath = __dirname;
    const file = req.files.file;
    const filename = file.name;
    let dsach = req.body.dsach;
    let list = dsach.split(",");

    file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      } else {
        console.log(file);
        var my_text = `Result is:  
        <b><i>${req.body.text1}</i></b>`;
        var token = process.env.TOKEN_BOT_TELE;

        const url = `https://api.telegram.org/bot${token}/sendDocument`;
        list.map(async (user) => {
          const formData = new FormData();
          let path = `${newpath}${filename}`;
          console.log(path);
          formData.append("chat_id", user);
          formData.append("caption", my_text);
          formData.append(
            "document",
            fs.createReadStream(path),
            "File khảo sát"
          );

          formData.append("parse_mode", "html");

          axios
            .post(url, formData, {
              headers: formData.getHeaders(),
            })
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

let handleGet_update = async (req, res) => {
  try {
    var token = process.env.TOKEN_BOT_TELE;
    var config = {
      method: "get",
      url: `https://api.telegram.org/bot${token}/getUpdates`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    let list = await axios(config)
      .then(function (response) {
        return response.data.result;
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(list);
    let kqua = [];
    var data = fs.readFileSync("srcminh.txt");
    list.map((user) => {
      if (user.message !== undefined) {
        const index = data.indexOf(user.message.chat.id.toString());
        const index1 = kqua.toString().indexOf(user.message.chat.id.toString());
        if (index === -1 && index1 === -1) {
          kqua.push(user.message.chat.title);
          kqua.push(user.message.chat.id);
        }
      }
      if (user.my_chat_member !== undefined) {
        const index = data.indexOf(user.my_chat_member.chat.id.toString());
        const index1 = kqua
          .toString()
          .indexOf(user.my_chat_member.chat.id.toString());
        if (index === -1 && index1 === -1) {
          kqua.push(user.my_chat_member.chat.title);
          kqua.push(user.my_chat_member.chat.id);
        }
      }
      if (user.channel_post !== undefined) {
        const index = data.indexOf(user.channel_post.chat.id.toString());
        const index1 = kqua
          .toString()
          .indexOf(user.channel_post.chat.id.toString());
        if (index === -1 && index1 === -1) {
          kqua.push(user.channel_post.chat.title);
          kqua.push(user.channel_post.chat.id);
        }
      }
    });
    handleEditList(kqua, data);

    let dsach_final = [];
    console.log(data.toString());
    var output = data.toString();
    const arr = output.split(",");
    for (var i = 0; i < arr.length; ) {
      let out = { title: "", chat_id: "" };
      out.title = arr[i];
      out.chat_id = arr[i + 1];
      dsach_final.push(out);
      i = i + 2;
    }
    res.send(dsach_final);
  } catch (e) {
    console.log(e);
  }
};
let handleEditList = (req, res) => {
  if (req.length > 1) {
    fs.writeFile(res, req, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  }
};
let handleEditListFile = (req, res) => {
  if (req.length > 1) {
    fs.appendFile(res, req, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  }
};
let handleGetList = async (req, res) => {
  try {
    const session = new StringSession(process.env.sessionTele);
    const client = new TelegramClient(session, apiId, apiHash, {});
    await client.connect(); // This assumes you have already authenticated with .start()
    let result = await client.invoke(
      new Api.messages.GetAllChats({
        exceptIds: [
          BigInt(675019015n),
          BigInt(709189661n),
          BigInt(1555189031n),
          BigInt(765228925n),
        ],
      })
    );
    let kqua1 = [];
    let kqua2 = [];
    // const result = await client.invoke(
    //   new Api.messages.GetHistory({
    //     peer: "dtm_test_update",
    //     offsetId: 43,
    //     offsetDate: 43,
    //     addOffset: 0,
    //     limit: 100,
    //     maxId: 0,
    //     minId: 0,
    //     hash: BigInt("-4156887774564"),
    //   })
    // );
    result.chats.map((chat) => {
      let id = "-100" + chat.id.toString();
      const index1 = kqua1.toString().indexOf(id);
      if (chat.username !== undefined && index1 === -1) {
        let t = { title: "", chat_id: "" };
        t.title = chat.title;
        t.chat_id = id;
        t.username = chat.username;
        kqua1.push(t);
        kqua2.push(chat.username);
        kqua2.push(id);
        kqua2.push(chat.title);
      }
    });
    console.log(kqua2.toString());
    var data = fs.readFileSync("srcminh.txt");
    handleEditList(kqua2.toString(), data);
    res.send(kqua1);
  } catch (e) {
    console.log(e);
  }
};
let handleGetMess = async (req, res) => {
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
        // let out=[];
        // await Promise.all( result.messages.map(async (item) => {
        //   let sms = {};
        //   if (item.fromId !== null) {
        //     if ( item.fromId.userId.toString() !== "1580604292" &&
        //       item.fromId.userId.toString() !== "5408308785" )
        //     {
        //       sms.title = chat.title;
        //       sms = await handleGetFile(item,sms);
        //       // out.push(await handleGetFile(item,sms));
        //     }
        //   }
        //   await out.push(sms);

        // }));
        const out = [];
        async function getListFile(item, index) {
          if (item.fromId !== null) {
            if (
              item.fromId.userId.toString() !== "1580604292" &&
              item.fromId.userId.toString() !== "5408308785"
            ) {
              let sms = {};
              sms.title = chat.title;
              sms = await handleGetFile(item, sms);
              out.push(sms);
            }
          }
        }
        await Promise.all(result.messages.map(getListFile));
        console.log(getListFile);

        // var data = fs.readFileSync("getListFile.txt");
        // console.log(data.toString());
        return out;
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
    console.log(e);
  }
};
let handleGetFile = async (req, res) => {
  const session = new StringSession(process.env.sessionTele); // You should put your string session here
  const client = new TelegramClient(session, apiId, apiHash, {});
  await client.connect(); // This assumes you have already authenticated with .start()
  const result = await client.invoke(
    new Api.upload.GetFile({
      precise: true,
      cdnSupported: true,
      location: new Api.InputDocumentFileLocation({
        id: req.media.document.id,
        accessHash: req.media.document.accessHash,
        fileReference: Buffer.from(req.media.document.fileReference),
        thumbSize: "",
      }),
      offset: 0,
      limit: 524288,
    })
  );
  let ten = req.media.document.attributes[0];
  if (ten !== null) {
    res.filename = ten.fileName;
  }
  res.userId = req.fromId.userId.toString();
  res.channelId = req.peerId.channelId.toString();
  res.message = req.message;
  var date = new Date(req.date * 1000);
  res.date = date.toUTCString().toString();
  var docu = Buffer.from(result.bytes)
  // var buffer =  Buffer.from(result.bytes, 'base64').toString('binary');
  //var buffer = Buffer.from( new Uint8Array(result.bytes) );
  res.document = docu ;
  console.log(res.document);
  return res;
  // var data = fs.readFileSync("getListFile.txt");
  // console.log(JSON.stringify(res));
  //handleEditListFile(res.toString(),data)
};
module.exports = {
  getHomePage: getHomePage,
  gethomepage: gethomepage,
  handleSend_sms_file2: handleSend_sms_file2,
  handleGet_update: handleGet_update,
  handleEditList: handleEditList,
  handleGetList: handleGetList,
  handleGetMess: handleGetMess,
  handleGetFile: handleGetFile,
  handleEditListFile: handleEditListFile,
};
