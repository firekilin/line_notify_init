import "dotenv/config";
import express, { response } from 'express';
import fetch from 'node-fetch';
import request from "request";


const app=express();
//使用者訂閱
//https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=ngegPHE6scsOCHLoJ32gsp&redirect_uri=https://icecube.servegame.com/linenotify&scope=notify&state=NO_STATE
//
//我的個人網站：https://icecube.servegame.com/
//我將使用nginx 把這app轉至：https://icecube.servegame.com/linenotify

app.listen("5670",()=>{
  console.log("listen 5670");
});


//建置callback
app.get("/",express.json(),async(req,res)=>{
  console.log(req.query.code);
  await registerToken(req.query.code,(token)=>{
    await lineNotifyMessage(token,"test");
  });
  res.send("OK");
});


//註冊 token
let registerToken=async(AuthorizeCode,token)=>{
  let test={
    "grant_type":"authorization_code",
    "code":AuthorizeCode,
    "redirect_uri":"https://icecube.servegame.com/linenotify",
    "client_id":process.env.CLIENT_ID,
    "client_secret":process.env.CLIENT_SECRET
};
  let url = new URL("https://notify-bot.line.me/oauth/token");
  Object.keys(test).forEach(key=>url.searchParams.append(key,test[key]));
  await request.post({headers: 
    {'content-type' : 'application/x-www-form-urlencoded'},
      url:url},(error,response,body)=>{
        console.log(body.access_token);
        token(body.access_token);
    })
  
  
}

let lineNotifyMessage=async (token, msg)=>{
  let req=await request.post({headers: 
    {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/x-www-form-urlencoded"
    },
      url:"https://notify-api.line.me/api/notify",
      body:"message=test"},(error,response,body)=>{
        console.log(error);
        console.log(response);
        console.log(body);
    })
}