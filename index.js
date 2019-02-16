"use strict";

require("dotenv").config();

// LINE
const line = require("@line/bot-sdk");
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};
const lineClient = new line.Client(config);

// Express
const express = require("express");
const app = express();

// Server
const server = app.listen(3000, () => {
  console.log("express server running:" + server.address().port);
});

const handleEvent = event => {
  console.log(event);
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  const echo = { type: "text", text: event.message.text };
  return lineClient.replyMessage(event.replyToken, echo);
};

app.post("/", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});
