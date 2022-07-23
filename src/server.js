require("dotenv").config();
import express from 'express';
import viewEngine from "./config/viewEngine"
import initWebRoutes from "./routes/web";
import bodyParser from 'body-parser';
import request from 'request';

let app = express();


//  config view engine
viewEngine(app);

//use body-parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init all web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function getStarted() {
    let request_body = {
      "get_started": {
        "payload": "get_started"
      }
    }
  
    request({
      "uri": "https://graph.facebook.com/v14.0/me/messages",
      "qs": { "access_token": process.env.PAGE_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!, my message: ${response}');
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
}

getStarted();