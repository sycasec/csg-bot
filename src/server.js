require("dotenv").config();
import express from 'express';
import viewEngine from "./config/viewEngine"
import initWebRoutes from "./routes/web";
import bodyParser from 'body-parser';

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
