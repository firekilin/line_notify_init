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
  let token =await registerToken(req.query.code);
  let access_token="";
  token.json().then((data)=>{
    console.log(data);
    access_token=data.access_token;
  });
  console.log(access_token);
  await lineNotifyMessage(access_token,"test");
  res.send("OK");
});


//註冊 token
let registerToken=async(AuthorizeCode)=>{
  let test={
    "grant_type":"authorization_code",
    "code":AuthorizeCode,
    "redirect_uri":"https://icecube.servegame.com/linenotify",
    "client_id":process.env.CLIENT_ID,
    "client_secret":process.env.CLIENT_SECRET
};
  let url = new URL("https://notify-bot.line.me/oauth/token");
  Object.keys(test).forEach(key=>url.searchParams.append(key,test[key]));
  const ans= await fetch(url,{
    method:"POST",
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });

  console.log(ans.status);
  return ans;
}

let lineNotifyMessage=async (token, msg)=>{
    let headers = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    let r =await fetch("https://notify-api.line.me/api/notify?message=test", {method:"POST" ,headers:headers})
    console.log(r);
    return r
  }