const axios = require('axios');

let send_telegram = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            var my_text = `Result is:  
                <b>-Text1:</b>  <i>${data.text1}</i> 
                <b>-File:</b>  <i>${data.file1}</i>`
            var token = "5408308785:AAGHCjdj4VXn4XByM91cf-ElyB-61CWrL1M";
            var chat_id = -1001628397471;
            var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${my_text}&parse_mode=html`;
            var urlendcode = encodeURI(url);
            // fs.open('minh.txt', 'r');
            // var send_document = `https://api.telegram.org/bot${token}/sendDocument?chat_id=${chat_id}&caption=${my_text}&files=fs.open('minh.txt', 'r')&parse_mode=html`;
            //var urlendcode = encodeURI(send_document);
            axios.get(urlendcode)
            .then(response => {
                console.log(response.data.url);
                console.log(response.data.explanation);
                resolve({
                    errCode : 0,
                    message :'OK'
                });
            })
            .catch(error => {
                console.log(error);
            });
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    send_telegram:send_telegram
}