# WordPush Bot - A Telegram/GoogleAppsScript-based Vocabulary bot

The WordPush Bot allows you to upload your favorite vocabulary in an Google Spreadsheet and will then send you four random pieces of vocabulary every day. Never again forget to revise your vocab! 

## Features:
- **Automatically send you your vocabulary** Your bot automatically browses your own vocabulary list and push it to you four times a day.
- **Upload your own vocabulary** Whatever language you are trying to get better with, upload your vocabulary as a simple table and start revising.
- **Google Spreadsheets and Telegram: Small bot, great benefit**: WordPush bot is a Telegram bot than connects to your Google Spreadsheet. 
- **Simple syntax**: The core element of the bot relies only on if-else statements and is understandable also to programming beginners
- **Easy to install, free of charge, 24/7 readiness**

## Initizalization

- Set up a telegram bot with @BotFather (relevant information: bot token), see here: https://core.telegram.org/bots
- Set up new Google Spreadsheet (relevant information: webApp url, Spreadsheet id) or upload the attached xls file.

>> Setting up the Telegram and Google Apps Script part follows this YouTube tutorial: https://www.youtube.com/watch?v=mKSXd_od4Lg 

## Prepare Google Spread Sheet

The bot in its current specification is written to fill the attached spread sheet [Template](docs/WordPush.xls). The provided template consistes of three worksheets:
- *Worksheet 1 "Dict_input":* This is where your vocabulary is stored. Currently filled with English-German vocab. Erase the current content and fill in your vocab. Make sure to keep the header!
- *Worksheet 2 "command_storage":* This is a temporary storage for commands that control the bot. Please don't change anything here unless you are sure what you are doing.
- *Worksheet 3 "userlist":* Here, the bot logs all users of your bot. In the sense of open source, everyone can jump onto your bot and receive the same vocab you do. Don't worry - outsiders cannot mess with the acutal bot. They only receive the help that you do.

*Suggestion*: Import the spreadsheet, see how the bot works and customize the bot to your needs afterwards.

## Import and fill individual details to Google Apps Script code

The bot runs on a Google Web App, using Google Apps script - a JavaScript based programming. To get the bot running, you can download the .gs files (Google Apps Script) and import them to your Google Script Apps project.

As you see in the directory, there is only one files that makes up for the whole bot:

### main.gs

This script contains all elements of the WordPush Bot such as doPost(), send and trigger functions. The functions all work on the Google Web Apps site and effect changes in the Google Spreadsheet. The important parts to fill in with your information are emphasized with three asterices.

```
webAppUrl = *** YOUR GOOGLE WEBAPPS URL ***; you will receive the webAppUrl when you publish your script for the first time as WebApp (looks like this: https://script.google.com/macros/s/AKfydbw7KIMKGdLNpmPtdXJoQF7Ras61ItJq8Dztvjh9CNNXZ1EmJio/exec)
ss_id = *** YOUR GOOGLE SPREADSHEETS ID ***; you will find the ss_id in the URL of your spreadsheet (looks like this: "1Bsn7gZX5jZ_lTVucM5ebaDzmxtok3UtMNVUb8021h3e") 

token = *** YOUR TELEGRAM BOT TOKEN ***; you will receive the token from the Telegram botfather (looks like this: 1175871460:AAGDapaqpOGdYgsMqDL0lP213IKlMiqXGog)
admin_id = *** ADMIN TELEGRAM ID ***; if you want to receive status updates for your bot, please fill in your Telegram id (or the one of the admin). You'll find the id if you send your bot a message and look it up in the as sender_id... ;-) (looks like this: 325208322)
```

This script consists of the all relevant functions. Amongst others, it contains the following functions:

- getMe(): checking bot status
- setWebhook(): setting telegram webhook (to connect Google WebApp to bot)
- deleteWebhook(): deleting telegram webhook
- **doPost()**: interaction with bot (digest messages to bot and post reponses) --> this is the core of the bot's Telegram interaction!
- pickWord(): This is the random selection function for your vocabulary. Once it's trigger, it will give a back a random piece of vocab from your list. If you want to change the language, here you can adjust the message that is send to all users (look for the msg variable).
- triggerInit(): This is the function that your built-in timer trigger (currently four times a day), to send random pieces of vocabulary to all users of your bot.
- deleteUser(): Deletes a user who does not want to receive messages from the bot anymore.
- three send functions for replies of the telegram bot to its users


## Prepare Telegram bot

As a last step, add the commands to your telegram bots via the BotFather (https://core.telegram.org/bots#commands). To use the preset functions of the WordPush bot, add the following commands:

```
next - Next word
stop - No more words
```

Watch out: The bot does not work with inline commands!

## Set time trigger in Google Apps

As you want the bot to work automatically, you can set time-based trigger via Google Apps. The most comfortable way is to go via https://script.google.com/home/projects/ + your project id + /triggers. Here you can adjust all trigger settings. Make sure to execute the triggerInit() function.

If you want to do if fully manually, check out the trigger functions in my TwitterURL project on GitHub - not as comfortable but of course way cooler!

## Start off = customize to your own needs

Take a closer look at the doPost(), triggerInit() and pickWord() functions. This is where the magic happens! AND: Make sure to put in the vocabulary that you want to revise. This happens in the first Google Spreadsheet sheet. Also: With little programming skills, you can start adapting the WordPush bot to your own needs.  

Have fun!

