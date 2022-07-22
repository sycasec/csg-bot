require('dotenv').config();
import request from 'request';

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
  let VERIFY_TOKEN = process.env.MSG_TOKEN
    
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

function sendWelcome(sender_psid, recieved_message) {
  let attachment_url = "../public/images/hello_world.png";
  let response = {
    "attachment": {
      "type" : "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "I am your personal assistant, <CSG_BOT_NAME> !",
            "image_url": attachment_url,
            "buttons": [
              {
                'type': 'postback',
                'title': 'Get Started',
                'payload': 'get_started'
              },
              {
                'type': 'postback',
                'title': 'Help',
                'payload': 'help'
              }
            ]
          }
        ]
      }
    }
  }
};

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `Howdy hey guilder! Natural Language  Your message was: ${received_message.text}`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "This is a test response if our buttons are clicky. Try clicking them!",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes Button",
                "payload": "yes"
              },
              {
                "type": "postback",
                "title": "No Button",
                "payload": "no"
              }
            ]
          }]
        }
      }
    }
  }
  
  // Sends the response message
  callSendAPI(sender_psid, response); 

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "You clicked the yes button! The button works fine i guess. That's all for now!" }
  } else if (payload === 'no') {
    response = { "text": "You clicked the no button! The button works fine i guess. That's all for now!" }
  } else if (payload === 'get_started') {
    response = { "text": "That's all for now guilder, ciao!" }
  } else if (payload === 'help') {
    response = { "text": "I am your personal assistant, <CSG_BOT_NAME> ! I can help you with the following: \n 1. Get Started \n 2. Help \nPlease take note that the bot is in beta, and will be unable to provide any useful assistance. Thanks!" }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
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
    "uri": "https://graph.facebook.com/v6.0/me/messages",
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

module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook
};