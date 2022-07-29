import request from "request";
import chatBotServices from "./chatBotServices";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_TOKEN;
const IMAGES_URL = "https://csg-bot.herokuapp.com/images/";

let setupGreeting = (PAGE_ACCESS_TOKEN) => { // set up get started and persistent menu
    return new Promise((resolve, reject) => {
        try{
            let data = {
                "get_started":{
                    "payload": "GET_STARTED"
                },
                "persistent_menu" : [
                    {
                        "locale": "default",
                        "composer_input_disabled": false,
                        "call_to_actions": [
                            {
                                "type": "postback",
                                "title": "BOT MANUAL",
                                "payload": "USER_HELP",
                                "webview_height_ratio": "full"
                            },
                            {
                                "type": "web_url",
                                "title": "Online Enrollment Guide",
                                "url": "https://our.upcebu.edu.ph/information/online-enrollment-guide/",
                                "webview_height_ratio": "full"
                            },
                            {
                                "type": "web_url",
                                "title": "SAIS Pre-enlistment Guide",
                                "url": "https://drive.google.com/file/d/1CdwWkYjgDeP6YWkMjWw-SHRvAdvsoeOo/view",
                                "webview_height_ratio": "full"
                            },
                            {
                                "type": "web_url",
                                "title": "University Registrar FAQs",
                                "url": "https://our.upcebu.edu.ph/up-college-admissions-2022/frequently-asked-questions-faq-2022/",
                                "webview_height_ratio": "full"
                            },
                            {
                                "type": "postback",
                                "title": "Restart this conversation",
                                "payload": "RESTART_CONVERSATION"
                            }
                        ]
                    }
                ],
                "whitelisted_domains": [
                    process.env.SERVER_URL
                ]
            };
            request({
                "uri": "https://graph.facebook.com/v14.0/me/messenger_profile",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": data
            }, (err, res, body) => {
                if (!err) {
                    resolve("setup success!");
                } else {
                    reject(err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};


let sendGreetingResponse = (sender_psid) => {

    return new Promise(async (resolve, reject) => {
        try {
            let images = [IMAGES_URL+"robot$greet0.jpeg", IMAGES_URL+"robot$greet0.png", IMAGES_URL+"robot$greet1.png"]
            let random_image = images[Math.floor(Math.random() * images.length)];

            let response1 = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": random_image
                    }
                }
            };

            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Hello Guilder! I'm $CSG-BOT-NAME, I'm here to help you with your CSG related queries.",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I have some questions 🤔",
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

            await chatBotServices.typingMimicry(sender_psid, 0);
            await chatBotServices.sendMessage(sender_psid, response1);
            await chatBotServices.typingMimicry(sender_psid, 0);
            await chatBotServices.sendMessage(sender_psid, response2);
            await chatBotServices.typingMimicry(sender_psid, 1);

            resolve("greeting response done!");

        } catch (e) {
            reject(e);
        }
    });

}

let sendThanksResponse = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let phrases = [
                "At your service!",
                "Nary a problem, guilder!",
                "Delighted to help, guilder!",
                "Ad Victoriam, Brother! ah, wait, this isn't the Brotherhood of Steel...",
                "Initiating kill-switch sequence... ah wait, this isn't black mirror...",
                "$GENERIC_RESPONSE_THANKS + '!'",
                "You are a simula- WELCOME, GUILDER! Happy to be at your service.",
                "The development team has ran out of witty responses. U r welcome i guess."
            ]

            let random_phrase = phrases[Math.floor(Math.random() * phrases.length)];

            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": random_phrase + "\n\n In case you have some questions or concerns: ",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I have some questions 🤔",
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

            await chatBotServices.typingMimicry(sender_psid, 0);
            await chatBotServices.sendMessage(sender_psid, response);
            await chatBotServices.typingMimicry(sender_psid, 1);

            resolve("thanks response done!");

        } catch (e) {
            reject(e);
        }
    });
}

let sendByeResponse = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let phrases = [
                "Excelsior, guilder!",
                "Ad Victoriam, Brother! ah, wait, this isn't the Brotherhood of Steel...",
                "Initiating kill-switch sequence... ah wait, this isn't black mirror...",
                "$GENERIC_RESPONSE_BYE + '!'",
                "K. (this is a developer-generated response)",
                "The development team has ran out of witty responses. Good bye :D"
            ]

            let random_phrase = phrases[Math.floor(Math.random() * phrases.length)];

            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": random_phrase + "\n\n In case you have some questions or concerns: ",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I have some questions 🤔",
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

            await chatBotServices.typingMimicry(sender_psid, 0);
            await chatBotServices.sendMessage(sender_psid, response);
            await chatBotServices.typingMimicry(sender_psid, 1);

            resolve("bye response done!");

        } catch (e) {
            reject(e);
        }
    });  
}

let sendHelp = (sender_psid) => { //sends help message to user.
    return new Promise((resolve, reject) => {
        try{
            let response1 = {
                "text": "Hello Guilder! I'm $CSG-BOT-NAME, I'm here to help you with your CSG related queries.\n\n" +
                "I can help you with the following:\n" +
                "1. Answer some of FAQ's\n" +
                "2. Notify the officers about some of your concerns. (in development)\n" +
                "3. You can check useful links in the menu! (it should look like three stacked bars)\n"
            };
            let response2 = {
                "text": "Please like and follow our page for the latest updates on CSG activities!"
            };

            let response3 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "What would you like to do next?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I have some questions 🤔",
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

            // add future help menu items here.
            let responses = [response1, response2, response3];

            for(let i = 0, len = responses.length; i < len; i++){
                chatBotServices.typingMimicry(sender_psid, 0);
                chatBotServices.sendMessage(sender_psid, responses[i]);
            }
            resolve("USER_HELP handled!")

        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    setupGreeting: setupGreeting,
    sendGreetingResponse: sendGreetingResponse,
    sendThanksResponse: sendThanksResponse,
    sendByeResponse: sendByeResponse,
    sendHelp: sendHelp
}