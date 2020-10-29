//// MAIN 
// transfer bot that stores input of telegram user in customizable Google Spreadsheet, controlled by telegram commands

// Telegram inputs (bot token, telegramURLapi)
var token = *** YOUR BOT TOKEN HERE ***; 
var telegramUrl = "https://api.telegram.org/bot" + token;

// Google inputs (webApps, Spreadsheet id)
var webAppUrl = *** YOUR GOOGLE WEBAPP URL HERE ***;
var ss_id = *** YOUR SPREADSHEET ID HERE ***;

// Telegram id of the admin that hosts the bot
var admin_id = *** YOUR ADMIN TELEGRAM ID ***;

// help text (passed back if help command is sent)
var help_text = "Hello user! This WordPush bot sends you frequent pieces of vocabulary and its translation. Version 0.1"

// comand list
var command1 = "/next";
var command4 = "/start";
var command5 = "/stop";


// Checking bot status
function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

// setting telegram webhook (to connect Google WebApp to bot)
function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

// deleting telegram webhook
function deleteWebhook() {
  var url = telegramUrl + "/deleteWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

// interaction with bot (digest messages to bot and post reponses)
function doPost(i) {
  var data = JSON.parse(i.postData.contents); // parses the JSON input that has been sent to the bot
  var text = data.message.text; // the actual message sent to the bot (as string)
  var msg_id = data.message.message_id;
  var sender_id = data.message.from.id;
  var chat_id = data.message.chat.id;
  var name = data.message.from.first_name + " " + data.message.from.last_name;
  var date = data.message.date;
  var sheet = SpreadsheetApp.openById(ss_id); // spreadsheet to store data 
  var sheet0 = sheet.getSheets()[0];
  var sheet1 = sheet.getSheets()[1];
  var sheet2 = sheet.getSheets()[2];
  var input_key = sheet1.getRange('B2').getValue(); // user_id of person that sent commands to start an input
  
  
  if (true){ // Currently disabled - checks if there is a non-finished input by another user
    if (text.split("")[0] == "/"){ // checks if input is a command (starts with '/')
      var command = text.split(" ")[0];
      sheet1.getRange('A2').setValue(command); // sets command in command storage and overwrites existing command
      sheet1.getRange("B2").setValue(sender_id); // sets sender_id in command storage and overwrites existing sender_id 
      
      if (command == command1) {
        sendText(sender_id, "You requested some more brainfood. Here we go!");
        pickWord(ss_id, sender_id);
      }
      
      if (command == command4) {
        var lastrow = sheet2.getLastRow();
        var user_list = sheet2.getRange(2,1,lastrow-1,1).getValues();
        var newRow = lastrow + 1;
        var already_listed = 0;
        for (var i in user_list) {
          if (sender_id == user_list[i]) {
            already_listed = 1;
          }
        }
        
        if (already_listed == 1){
          sendText(sender_id, "The bot is already running. If you don't receive anything, try /stop and then /start again.");
        } else {
          sheet2.getRange(newRow, 1).setValue(sender_id); // sets command in command storage and overwrites existing command
          sheet2.getRange(newRow, 2).setValue(name); // sets sender_id in command storage and overwrites existing sender_id 
          sendText(sender_id, "Welcome! I will send you some vocabulary from now on. Send the command /stop to make me stop. Let's give it a try:");
          pickWord(ss_id, sender_id);
        }
      }
      
      if (command == command5) {
        deleteUser(sender_id, sheet2); 
        sendText(sender_id, "Bye! If you want to re-join, send /start again.");
      }
      
      
    } else {
      sendText(admin_id, "Nothing happened.");
    }
  } else {
    sendText(sender_id, "You are not allowed to do this. Sry!");
  }
}


function triggerInit(){
  var sheet = SpreadsheetApp.openById(ss_id);
  var sheet2 = sheet.getSheets()[2];
  var lastrow = sheet2.getLastRow();
  var user_list = sheet2.getRange(2,1,lastrow-1,1).getValues();
  for (var i in user_list){
    try {
      pickWord(ss_id, user_list[i]);
    } catch(e) {
      Logger.log(e);
    }
  }
}

// ########################

function deleteUser(new_user_id, in_sheet){
  // takes the user telegram id and the sheet with list to delete it from (incl. header, IDs must be first column) and return message in case of success or failure
  var lastrow = in_sheet.getLastRow();
  var user_list = in_sheet.getRange(2,1,lastrow-1,1).getValues();
  var success = 0;
  for (var i in user_list) {
    if (new_user_id == user_list[i]) {
      var row_todelete = parseInt(i) + 2; // list count starts at zero (+1) and we need to count in the header (+1)
      var success = 1;
    }
  }
  if (success == 1){
    in_sheet.deleteRow(row_todelete);
    var display_msg = "Removed successfully.";
  } else {
    var display_msg = "Not entry found.";
  }
  return display_msg, success;
}

// ########################

/// PICK WORD FUNCTION

function pickWord(sheet_id, telegram_id){
  // takes an spreadsheet with english and other language in first and second column (incl. title)
  var sheet = SpreadsheetApp.openById(sheet_id); // spreadsheet to store data 
  var sheet0 = sheet.getSheets()[0];
  var lastrow = sheet0.getLastRow();
  var random_num = getRandomInt(lastrow);
  var vocab_en = sheet0.getRange(random_num, 1).getValue();
  var vocab_de = sheet0.getRange(random_num, 2).getValue();
  var msg = "Here goes your regular dosis of vocab.\nKeep up the spirit!\n"+
      "\n&#x1F1EC;&#x1F1E7 - <b>"+ 
        vocab_en + 
          "\n</b>&#x1F1E9;&#x1F1EA - <b>" + 
          vocab_de +"</b>";
  sendHTMLtext(telegram_id, msg);
}

function getRandomInt(max) {
  // give back random integer
  return Math.floor(Math.random() * Math.floor(max));
}


// ########################

/// SEND FUNCTIONS
// different send functions for replies of the telegram bot to its users


// regular text
function sendText(id, text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

// html text
function sendHTMLtext(id, text) {
  var input = encodeURIComponent(text)
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + input + "&parse_mode=html";
  var response = UrlFetchApp.fetch(url );
  Logger.log(response.getContentText());
}

// text without link preview (for URL)
function sendText_nopreview(id, text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text +"&disable_web_page_preview=true";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}