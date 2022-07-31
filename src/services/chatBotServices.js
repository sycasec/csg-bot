import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_TOKEN;

let delay = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };

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

            await typingMimicry(sender_psid, 0);
            
            await sendMessage(sender_psid, response);
            await typingMimicry(sender_psid, 1);

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
                                        'title': 'I have questions 🤔',
                                        'payload': 'USER_FAQ'
                                    },
                                    {
                                        'type': 'postback',
                                        'title': 'I have some concerns',
                                        'payload': 'USER_CONCERNS'
                                    },
                                    {
                                        'type': 'postback',
                                        'title': '>help csg-bot.exe 🤖',
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
            await typingMimicry(sender_psid, 1);

            resolve("postback: GET_STARTED handled!")

        } catch (e) {
            reject(e);
        }
    });
};

let sendFAQ = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Can I ask what komsai student are you? 🤔\n Are you a Freshie (first year)? 💁\nor a Fossil 😂 (sophies, juniors, seniors)",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Freshie 🙋",
                                "payload": "FRESHIE_FAQ"
                            },
                            {
                                "type": "postback",
                                "title": "Fossil 🦖",
                                "payload": "OLDIES_FAQ"
                            }
                        ]
                    }
                }
            };

            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response);
            await typingMimicry(sender_psid, 1);

            resolve("USER_FAQ handled!");

        } catch (e) {
            reject(e);
        }
    });
};

let sendOldiesFAQ = (sender_psid, action) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "❓ Oldies FAQ ❓",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "📅 Enrollment Dates?",
                                "payload": "OLDIES_ENROLLMENT_DATES"
                            },
                            {
                                "type": "postback",
                                "title": "📄 Enrollment Forms?",
                                "payload": "OLDIES_ENROLLMENT_FORMS"
                            },
                            {
                                "type": "postback",
                                "title": "more ➡️",
                                "payload": "OLDIES_MORE_FAQ"
                            }
                        ]
                    }
                }
            }

            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "❓ Oldies more FAQ 🦖",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "🤔 Enlisted = Enrolled ?",
                                "payload": "OLDIES_ENLISTMENT"
                            },
                            {
                                "type": "postback",
                                "title": "Couldn't Pre-enlist 😞",
                                "payload": "OLDIES_COULD_NOT_ENLIST"
                            },
                            {
                                "type": "postback",
                                "title": "Enrollment Status? 📋",
                                "payload": "OLDIES_ENROLLMENT_STATUS"
                            },
                        ]
                    }
                }
            }

            let responses = [response1, response2];

            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, responses[action]);
            await typingMimicry(sender_psid, 1);
            
            resolve("oldies faq handled");
        } catch (e) {
            reject(e);
        }
    });
};


let sendOldiesFAQAnswers = (sender_psid, answer) => {
    return new Promise(async (resolve, reject) => {
        try {
            let text_responses = [
                "------ Dates ----- : --Student No. ----\n"+
                "📌 Aug 9,  Tue: 2019- earlier\n" +
                "📌 Aug 10, Wed: 2020-\n" +
                "📌 Aug 11, Thu: 2021-\n" +
                "📌 Aug 12, Fri: ALL\n" +
                "📌 Aug 13, Sat: ALL\n\n" +
                "---------------------------------------\n"+
                "📌 Aug 8-12, Advanced First Year Registration\n\n" + 
                "📌 Aug 30: Registration Period for Freshies, Graduating, and Graduate Students\n\n" +
                "📌 Aug 31 - Sep 2: All Undergrads and Grad Students\n\n" +
                "📌 Sep 1 - Sep 2: All students + Cross-reg, Non-Degree, Special Students\n\n" +
                "✅ IMPORTANT: Pre-enlistment hours will be from 04:00 AM to 09:00 PM to allow for SAIS maintenance.",

                "No forms nor further preparations are needed as long as you have pre-enlisted and resolved your Form 5A ineligibilities. 😊",

                "The pre-enlisted/enrolled students will be recorded as Enrolled in the system. The *Enrolled* tag will appear under [Holds] when a student checks their Student Center in SAIS. 😊",

                "That's okay. Students who want to enroll but have not pre-enrolled must speak with their College or Program Adviser. The student enrollment for the adviser's classes will be handled by the adviser. 😊",

                "Students may check their enrollment status via the Student Center in SAIS. 😊"
            ];

            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": text_responses[answer],
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I still have some questions 🤔",
                                "payload": "USER_FAQ"
                            },
                            {
                                "type": "postback",
                                "title": "I have some concerns",
                                "payload": "USER_CONCERNS"
                            },
                            {
                                "type": "postback",
                                "title": "🔙 back",
                                "payload": "OLDIES_FAQ"
                            }
                        ]
                    }
                }
            }

            await typingMimicry(sender_psid, 0);
            
            await sendMessage(sender_psid, response);
            await typingMimicry(sender_psid, 1);

            resolve("OLDIES_FAQ_ANSWER handled!");

        } catch (e) {
            reject(e);
        }
    });
}

let sendFreshieFAQ = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "❓ Freshies FAQ ❓",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Couldn't do advanced registration 😞",
                                "payload": "FRESHIE_ADVANCED_REG"
                            },
                            {
                                "type": "postback",
                                "title": "FORM5 == FORM5A ?",
                                "payload": "FRESHIE_FORM5"
                            }
                        ]
                    }
                }
            };

            await typingMimicry(sender_psid, 0);
            
            await sendMessage(sender_psid, response);
            await typingMimicry(sender_psid, 1);

            resolve("FRESHIE_FAQ handled!");

        } catch (e) {
            reject(e);
        }
    });
}

let sendFreshieFAQAnswers = (sender_psid, answer) => {
    return new Promise(async (resolve, reject) => {
        try {
            let text_responses = [
                "That's okay, you can still register on August 30 up until September 2, 2022 for this A.Y. 😊",
                "FORM 5A is a document that you can acquire and print from sais.up.edu.ph that lists all your enlisted classes for the term. It includes your class schedule, room assignment, instructors, and units enrolled. It also serves as your TEMPORARY FORM 5 prior to enrollment. 😊",
            ];

            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": text_responses[answer],
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
                            },
                            {
                                "type": "postback",
                                "title": "🔙 back",
                                "payload": "FRESHIE_FAQ"
                            }
                        ]
                    }
                }
            }

            await typingMimicry(sender_psid, 0);
            
            await sendMessage(sender_psid, response);
            await typingMimicry(sender_psid, 1);

            resolve("FRESHIE_FAQ_ANSWER handled!");

        } catch (e) {
            reject(e);
        }
    });
}

let sendHooman = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {"text": "🤖 Loading your UPCSG Virtual Hooman™️, it might take a while..."};

            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response);
            await typingMimicry(sender_psid, 1);

            resolve("TALK_TO_HOOMAN handled!");
        } catch (e) {
            reject (e);
        }
    });
}

let sendConcerns = (sender_psid) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "How would you like me to assist you? 😊",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Can I talk to hooman 😵‍💫",
                                "payload": "TALK_TO_HOOMAN"
                            },
                            {
                                "type": "postback",
                                "title": "Additional contact points? 📞",
                                "payload": "ADD_CONTACT_POINTS"
                            }
                        ]
                    }
                }
            };

            await typingMimicry(sender_psid, 0);
            
            await sendMessage(sender_psid, response);
            await typingMimicry(sender_psid, 1);

            resolve("USER_CONCERNS handled!");

        } catch (e) {
            reject(e);
        }
    });
}

let sendAdditionalContacts = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response1 = {"text": "For any other questions, your respective block representatives will be able to assist you. 😊"};
            let response2 = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Please address your concerns to the following contact points, and we will make sure it will be handled immediately. 😊\n"
                              + "📌 UPCSG Internal Communications Officer:\nDunn Dexter Lahaylahay\n🔗 m.me/DunnDexterLahaylahay\n\n"
                              + "📌 Office of the University Registrar:\n Asst. Prof. May Christina G. Bugash, M. Ed.\n 📧 our.upcebu@up.edu.ph\n📧 mgbugash@up.edu.ph\n📞 (032) 2328187\n\n"
                              + "📌 Office of Student Affairs:\n Asst. Prof. Ma. Alena N. Macasil\n 📧 osa.upcebu@up.edu.ph\n📧 mnacasil@up.edu.ph \n📞 (032) 2328187\n\n",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I still have some questions 🤔",
                                "payload": "USER_FAQ"
                            },
                            {
                                "type": "postback",
                                "title": ">help csg-bot.exe 🤖",
                                "payload": "USER_HELP"
                            },
                            {
                                "type": "postback",
                                "title": "🔙 back",
                                "payload": "USER_CONCERNS"
                            }
                        ]
                    }
                }
            }
            
            await typingMimicry(sender_psid, 0);
            await sendMessage(sender_psid, response1);
            await typingMimicry(sender_psid, 0);
            await delay(1000);
            await sendMessage(sender_psid, response2);
            await typingMimicry(sender_psid, 1);

            resolve("ADD_CONTACT_POINTS handled!");

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

    let bot_action;
    if (action == 0) { bot_action = "typing_on"; }
    else if (action == 1) { bot_action = "typing_off"; }
    else if (action == 2) { bot_action = "mark_seen"; }

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
    delay: delay,
    sendDefaultMessage: sendDefaultMessage,
    sendUserWelcome: sendUserWelcome,
    sendFAQ: sendFAQ,
    sendFreshieFAQ: sendFreshieFAQ,
    sendFreshieFAQAnswers: sendFreshieFAQAnswers,
    sendOldiesFAQ: sendOldiesFAQ,
    sendOldiesFAQAnswers: sendOldiesFAQAnswers,
    sendHooman: sendHooman,
    sendAdditionalContacts: sendAdditionalContacts,
    sendConcerns: sendConcerns,
    sendMessage: sendMessage,
    typingMimicry: typingMimicry
}