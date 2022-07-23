import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


// send a default message to the user
let sendDefaultMessage = (sender_psid) => {
    return new Promise (async (resolve, reject) => {
        try{
            let response = {
                "text": "<CSG-BOT> is not yet equipped to handle these stuffs D:"
            };
        } catch (err) {
            reject(err);
        }
    });
}

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
                "uri": "https://graph.facebook.com/v6.0/me/messages",
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
    sendMessage: sendMessage,
    typingMimicry: typingMimicry
}