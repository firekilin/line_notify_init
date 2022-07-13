import "dotenv/config";
import express from 'express';
import fetch from 'node-fetch';

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
  registerToken(req.query.code);
  res.send("OK");
});


//註冊 token
let registerToken=async(code)=>{
  let url="https://notify-bot.line.me/oauth/token";
  const ans= await fetch(url,{
    method:"POST",
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body:{
      grant_type:"authorization_code",
      code:code,
      redirect_uri:"https://icecube.servegame.com/linenotify",
      client_id:process.env.CLIENT_ID,
      client_secret:process.env.CLIENT_SECRET
    }
  });
  console.log(ans.status);
  return ans;
}

