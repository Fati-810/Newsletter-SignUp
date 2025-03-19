const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config(); // Load environment variables
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
// Load API credentials from environment variables
const apiKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.MAILCHIMP_LIST_ID;
const url = `https://us8.api.mailchimp.com/3.0/lists/${listId}`;
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName , lastName , email );
    const data = {
        members: [
            {
                email_address: email
                , status: "subscribed"
                , merge_fields: {
                    FNAME: firstName
                    , LNAME: lastName
                }
      }
    ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/480711ed14"
    const options = {
        method: "post"
        , auth: `fatimah:${apiKey}`
    };
    const request = https.request(url, options, function (response) {
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});
app.post("/failure", function (req, res) {
    res.redirect("/")
})
app.listen(3000, function () {
    console.log("server is running");
});
