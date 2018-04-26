# Incredbot

Incredbot is splited into two parts: server (receiving requests from facebook messenger) and sender (sending requests to messenger api)

## Including

```javascript
const Incredbot = require('./modules/incredbot')
const incredbot = new Incredbot({
    access_token: config.facebook.access_token
})
```

## Server

### Starting server

```javascript
const webhook = incredbot.Server.setup()
const app = webhook.server
const bot = webhook.bot
```

Now server is listening on `/webhook`. Your console should display your verify token.
Server always returns status 200 to facebook!

`incredbot.Server.setup()` returns object which contains server and bot properties.

`server` property is passed express from Incredbot instance, so you can create own routes for bot API if needed.

`bot` property is event listener which is designed to catch server events.

### Server events

| Event       | When                                                    |
| ----------- | ------------------------------------------------------- |
| message     | Any message received                                    |
| text        | Text message received (media messages in early version) |
| payload     | Any payload received (button or quick reply)            |
| postback    | Payload from button reveived                            |
| quick_reply | Payload from quick reply received                       |

### Simple hello world

```javascript
bot.on('text', async (message, raw) => {
    try {
        await message.reply.text('Hello!')
    } catch (e) {
        console.error(e)
    }
})
```

### Message object
First parameter passed to event function is custom object created by incredbot server, if you need raw data from facebook it's passed as second parameter.

#### Message object properties
* sender_id
* timestamp
* payload (if message contain any payload)
* reply (Incredbot sender object with setted user_id to use it without user_id parameter)

## Sender
```javascript
incredbot.send.METHOD()
// OR
message.reply.METHOD()
```

Each method last parameter is option parameter, which is object. In this object you can pass recipient_id and messaging_type. (Options object will be propably changed soon)

It's recommended to use sender with Incredbot helpers which allows you to create messeges in a clean way.

All examples below are presented as replying to message

### Methods

#### `text(message, options)`
Sends text to client
```javascript
await message.reply.text('Your message')
```

#### `quick_replies(message, replies, options)`
Sends quick replies to client.
```javascript
let qrs = [
  new bot.Helpers.QuickReply('text', 'Yes', 'ANSWER_YES')
  new bot.Helpers.QuickReply('text', 'No', 'ANSWER_NO')
]
await message.reply.quick_replies('Your message', qrs)
```

#### `buttons(text, buttons, options)`
Sends buttons template to user
```javascript
let buttons = [
  new bot.Helpers.Button('postback', 'Some postback', 'POSTBACK')
  new bot.Helpers.Button('web_url', 'Some link', 'http://example.com')
]
await message.reply.buttons('Your message', buttons)
```
