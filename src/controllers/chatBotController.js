require('dotenv').config();
import request from 'request';
import chatBotServices from '../services/chatBotServices';
import homepageServices from '../services/homepageServices';


const VERIFY_TOKEN = process.env.MSG_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_TOKEN;

let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the even is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message){
              handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
              handlePostback(sender_psid, webhook_event.postback);
            }
            
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.MSG_TOKEN;  

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
      
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
};


function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

let handleMessageEnt = (received_message) => {
  let entitiesArr = ["wit$greetings", "wit$thanks", "wit$bye"];
  let entityChosen = "";
  let data = {};

  entitiesArr.forEach((name) => {
    let entity = firstTrait(received_message.nlp, name);
    console.log("entity: " + entity + " name: " + name);
    if (entity && entity.confidence > 0.8){
      entityChosen = name;
      data.value = entity.value;
    }
  });

  data.name = entityChosen;
  return data;
};


// Handles messages events
let handleMessage = async (sender_psid, received_message) => {
  let response;

  // handle text message with NLP  YOU WERE HERE
  let entity = handleMessageEnt(received_message);

  await chatBotServices.typingMimicry(sender_psid, 0);
  await chatBotServices.typingMimicry(sender_psid, 2);

  if (entity.name === "wit$greetings") {
    await homepageServices.sendGreetingResponse(sender_psid);
  } else if (entity.name === "wit$thanks") {
    await homepageServices.sendThanksResponse(sender_psid);
  } else if (entity.name === "wit$bye") {
    await homepageServices.sendByeResponse(sender_psid);
  } else {
    console.log("Uncaught error in switch case entity: " + entity.name);
    await chatBotServices.sendDefaultMessage(sender_psid);
  }

}

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
  // Set the response based on the postback payload

  await chatBotServices.typingMimicry(sender_psid, 1);
  switch(payload) {
    case "GET_STARTED":
    case "RESTART_CONVERSATION":
      await chatBotServices.sendUserWelcome(sender_psid);
      break;
    case "USER_HELP":
      await homepageServices.sendHelp(sender_psid);
      break;
    case "USER_FAQ":
      await chatBotServices.sendFAQ(sender_psid);
      break;
    case "FRESHIE_FAQ":
      await chatBotServices.sendFreshieFAQ(sender_psid);
      break;
    case "FRESHIE_ADVANCED_REG":
      await chatBotServices.sendFreshieFAQAnswers(sender_psid, 0);
      break;
    case "FRESHIE_FORM5":
      await chatBotServices.sendFreshieFAQAnswers(sender_psid, 1);
      break;
    case "USER_CONCERNS":
      await chatBotServices.sendConcerns(sender_psid);
      break;
    default: 
      console.log("Uncaught error in switch case payload: " + payload);
  }

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  };

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v14.0/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!, my message: ' + response);
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
  
}

module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook,
};