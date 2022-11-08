import express from "express";

import homeController from '../controllers/homeController';

import zaloController from '../controllers/zaloController';

let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/',(req,res)=>{
    //     return res.send("Hello world DTM");
    // })

    router.get('/home1',homeController.gethomepage);

    
    //TELEGRAM
    //api chính gửi mess và file cho telegram 
    router.post('/api/send-sms-file2', homeController.handleSend_sms_file2);

    router.get('/api/tele/getUpdate', homeController.handleGet_update);

    router.get('/api/tele/getList', homeController.handleGetList);

    router.get('/api/tele/getMess',homeController.handleGetMess);

    //ZALO
    //api gửi tin nhắn
    router.post('/api/zalo/send-sms-file',zaloController.handleSend_sms_file);

    router.get('/api/zalo/get-all-user',zaloController.handleGet_all_user);

    router.post('/api/zalo/send-sms-api',zaloController.handleSend_sms_api);

    router.post('/api/zalo/upload-file',zaloController.handleUpload_file_api);



    

    return app.use("/",router);
}

module.exports = initWebRoutes;