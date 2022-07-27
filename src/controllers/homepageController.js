import homepageServices from "../services/homepageServices";

const PAGE_ACCESS_TOKEN = process.env.PAGE_TOKEN;

let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};

let setupWelcome = (req, res) => {
    try {
        await homepageServices.setupGreeting(PAGE_ACCESS_TOKEN)
        return res.status(200).json({ "message": "OK"});
    } catch (err) {
        return res.status(500).json({"message": "node server error"})
    }
};

module.exports = {
    getHomepage: getHomepage,
    setupWelcome: setupWelcome
};