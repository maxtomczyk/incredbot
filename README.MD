# Incredbot

IMPORTANT! This is very early version and it's still under construction.

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
| entry       | Emmited on each entry in received object                |
| message     | Any message received                                    |
| text        | Text message received (media messages in early version) |
| payload     | Any payload received (button or quick reply)            |
| postback    | Payload from button reveived                            |
| quick_reply | Payload from quick reply received                       |
| echo        | On any message sent by bot                              |
| location    | Location received                                       |

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

-   sender_id
-   timestamp
-   payload (if message contain any payload)
-   reply (Incredbot sender object with setted user_id to use it without user_id parameter)
-   location (if location event)

## Natural typing

Incredbot by default sets timeout to your messages that contiant text and displays typing animation to client. This feature is turned on by default and can be configured vie config object passed to Incredbot instance

```javascript
  let incredbot = new Incredbot({
    ...
    natural_typing: true, // default: true
    natural_typing_speed: 50 // default: 50, chars per second
    ...
  })
```

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

#### `attachment(type, url, options)`

Sends attachment to user

```javascript
await message.reply.attachment('image', 'https://example.com/assets/image.png')
```

#### `generic(elements, options)`

Sends generic template to user.

```javascript
let buttons = [
    new bot.Helpers.Button('postback', 'Button no.1', 'PAYLOAD'),
    new bot.Helpers.Button('web_url', 'Button no.2', 'https://example.com/')
  ]

let card1 = {
  title: 'Card One',
  subtitle: 'Subtitle no. 1',
  image_url: 'https://example.com/images/1.png',
  buttons: buttons
}

let cards = [
  new bot.Helpers.Generic(card1),
  new bot.Helpers.Generic('Card Two', 'Subtitle no.2', 'https://example.com/images/2.png', buttons)

]
await message.reply.generic(cards)
```

### Sending Greeting

```javascript
let greeting = new bot.Helpers.Greeting('This is greeting text!')
await bot.send.setting(greeting)
```

### Sending Get Started Button

```javascript
let get_started = new bot.Helpers.GetStartedButton()
await bot.send.setting(get_started)
```

### Sending Persistent Menu

Actually, there is not any helper for persistent menu.

```javascript
let menu = {
    persistent_menu: [{
        locale: "default",
        call_to_actions: [{
            title: "Options",
            type: "postback",
            payload: "OPTIONS"
        }]
    }]
}

await bot.send.setting(menu)
```

## Helpers

### Button

Actually, this helper supports following types of buttons:

-   postback
-   web_url
-   phone_number
-   element_share

`new incredbot.Helpers.Button(type, title, payload)`

```javascript
  let postback = new incredbot.Helpers.Button('postback', 'Send Payload', 'PAYLOAD')
  let web_url = new incredbot.Helpers.Button('web_url', 'Go', 'https://example.com/')
  let phone_number = new incredbot.Helpers.Button('phone_number', 'Call Us', '+15105559999')
  let share = new incredbot.Helpers.Button('element_share')
```

### Generic

As first argument of generic message helper you can pass object or string.

`new bot.Helpers.Generic(title, subtitle, image_url, buttons, default_action)`

```javascript
let card1 = {
  title: 'Card One',
  subtitle: 'Subtitle no. 1',
  image_url: 'https://example.com/images/1.png',
  buttons: [...]
}

let cards = [
  new bot.Helpers.Generic(card1),
  new bot.Helpers.Generic('Card Two', 'Subtitle no.2', 'image_url', buttons)
]
```

### Get Started Button

As argument you can pass own paylod, default payload is 'GET_STARTED'.

`new bot.Helpers.GetStartedButton(payload)`

```javascript
let get_started = new bot.Helpers.GetStartedButton('OWN_PAYLOAD')
```

### Greeting

You can pass locale string as second argument, default locale string: default

`new bot.Helpers.Greeting(text, locale)`

```javascript
let greeting = new bot.Helpers.Greeting('Greeting text', 'zh_CN')
```

### Quick Reply

`new bot.Helpers.QuickReply(type, title, payload, image_url)`

```javascript
let qr = new bot.Helpers.QuickReply('text', 'Start!', 'START')
```
