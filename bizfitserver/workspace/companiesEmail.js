"use strict";
var MailListener = require("mail-listener2");
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var     cheerio = require('cheerio');

var mailListener = new MailListener({
  username: "companies@atteleikki.biz",
  password: "companies",
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
var url = 'mongodb://127.0.0.1:27017/companies';
 
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
    //console.log(mail['html']);
   // console.log("peppu");
    var $ = cheerio.load(mail['html']);
    var coach={};
    //console.log($("#expertInput").text());
    $('div').each(function(i, elem) {
        if(this.attribs.id=="langs")
        {
            var array=[];
             $('zzz').each(function(i, elem) {
                console.log($(this).text());
                array.push($(this).text());
             });
            //console.log($(this).text());
            /*
            var array=$(this).text().replace(new RegExp("  ", 'g'),"").split("\n");
            array=array.slice(1,array.length-1);
            
            console.log(array);
            console.log(array.length)*/
            coach['langs']=array;
        }else{
           coach[this.attribs.id]=$(this).text();
        }
        //console.log(this.attribs.id);
        //console.log($(this).text());
    });
    console.log(coach)
    //languages.push()
    var finder={};
    finder['email']=coach['email'];
    //finder['nimi']=coach['nimi'];
    MongoClient.connect(url, function(err, db)
    {
        db.collection('companies').update(finder, coach, { upsert: true });
        //db.collection('coach').update(finder, coach);
        //db.collection('coach').insert(coach);
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