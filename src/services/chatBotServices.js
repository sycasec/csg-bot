import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_TOKEN;


// send a default message to the user
let sendDefaultMessage = (sender_psid) => {
    return new Promise (async (resolve, reject) => {
        try{

            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "$CSG_BOT_NAME is not yet equipped to handle these stuffs D:",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I have some questions",
                                "payload": "USER_FAQ"
                            },
                            {
                                "type": "postback",
                                "title": "I have some concerns",
                                "payload": "USER_CONCERNS"
                            }
                        ]
                    }
                }
            };

            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response);

            resolve("default message sent!")

        } catch (err) {
            reject(err);
        }
    });
}

let sendUserWelcome = (sender_psid) => {

    return new Promise(async (resolve, reject) => {
        try {
            let attachment_url = "https://csg-bot.herokuapp.com/images/hello_world.png";

            let response1 = {"text": "Hello, I'm $CSG_BOT_NAME. I'm here to help you with your UPCSG related questions."};
            
            let response2 = {
                "attachment": {
                    "type" : "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                            "title": "What can I do for you, guilder?",
                            "image_url": attachment_url,
                            "buttons": [
                                    {
                                        'type': 'postback',
                                        'title': 'I have some questions',
                                        'payload': 'USER_FAQ'
                                    },
                                    {
                                        'type': 'postback',
                                        'title': 'I have some concerns',
                                        'payload': 'USER_CONCERNS'
                                    },
                                    {
                                        'type': 'postback',
                                        'title': '>man csg_bot',
                                        'payload': 'USER_HELP'
                                    }
                                ]
                            }
                        ]
                    }
                }
            };

            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response1);
            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response2);

            resolve("postback: GET_STARTED handled!")

        } catch (e) {
            reject(e);
        }
    });
};

let sendFAQ = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {"text": "FAQs are coming soon! (no faqs given!)"};

            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response);

            resolve("USER_FAQ handled!");

        } catch (e) {
            reject(e);
        }
    });
};

let sendConcerns = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = {"text": "Concern collection is in development!"};
            
            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response);
            resolve("USER_CONCERNS handled!");

        } catch (e) {
            reject(e);
        }
    });
};
  

// posts message to the messenger platform to be sent to user
let sendMessage = (sender_psid, response) => {
    return new Promise((resolve, reject) => {
        try {

            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            };

            // send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v14.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });


        } catch (err) {
            reject(err);
        }
    })
}

// mimic mark seen and typing
let typingMimicry = (sender_psid, action) => {
    let bot_action = action == 0 ? "typing_on" : "mark_seen";

    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "sender_action": bot_action
            };
            request({
                "uri": "https://graph.facebook.com/v14.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            })
            
        } catch (err) {
            reject(err);
        }
    })
} 

module.exports = {
    sendDefaultMessage: sendDefaultMessage,
    sendUserWelcome: sendUserWelcome,
    sendFAQ: sendFAQ,
    sendConcerns: sendConcerns,
    sendMessage: sendMessage,
    typingMimicry: typingMimicry
}