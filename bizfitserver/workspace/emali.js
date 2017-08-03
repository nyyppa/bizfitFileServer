"use strict";
var MailListener = require("mail-listener2");
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert'); 

var mailListener = new MailListener({
  username: "form@atteleikki.biz",
  password: "formporn",
  host: "box.atteleikki.biz",
  port: 993, // imap port 
  tls: true,
  connTimeout: 10000, // Default by node-imap 
  authTimeout: 5000, // Default by node-imap, 
  debug: console.log, // Or your custom function with only one incoming argument. Default: null 
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor 
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved 
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time 
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`, 
  mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib. 
  attachments: true,// download attachments as they are encountered to the project directory 
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments 
});
var url = 'mongodb://127.0.0.1:27017/test';
 
mailListener.start(); // start listening 
 
// stop listening 
//mailListener.stop(); 
 
mailListener.on("server:connected", function(){
  console.log("imapConnected");
});
 
mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});
 
mailListener.on("error", function(err){
  console.log(err);
});
 
mailListener.on("mail", function(mail, seqno, attributes){
  // do something with mail object including attachments 
    console.log(mail.text);
  //console.log(mail);
    console.log(mail.attachments);
    console.log(attributes);
    var coach={};
    var finder={};
    //finder['nimi']=coach['nimi'];
    MongoClient.connect(url, function(err, db)
    {
        db.collection('coach').update(finder, coach, { upsert: true });
        db.collection('user').save(coach, {
            w: 1
        }, function(err, result) {
             assert.equal(err,null);
            db.close();
        });   
    });
  //console.log("emailParsed", mail);
  // mail processing code goes here 
});
 
mailListener.on("attachment", function(attachment){
/*  console.log(attachment.stream);
  console.log(attachment);
  var fs = require('fs');

  //fs.createReadStream(attachment.stream);

 var wstream = fs.createWriteStream("testi.jpg");
 attachment.stream.pipe(wstream);*/
});