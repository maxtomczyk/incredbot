# Incredbot 🤖

**IMPORTANT!** Incredbot is still under development, but it was successfully used for some projects!

-   [What is incredbot?](#what-is-incredbot-)
-   [Including](#including)
    -   [Configuration options](#configuration-options)
-   [Server](#server)
    -   [Starting server](#starting-server)
    -   [Catching events](#catching-events)
    -   [Server events](#server-events)
    -   [Incredbot Message vs Raw Message](#incredbot-message-vs-raw-message)
-   [Sender](#sender)
    -   [Methods](#methods)
        -   [`text(message, options)`](#-text-message--options--)
        -   [`quick_replies(message, replies, options)`](#-quick-replies-message--replies--options--)
        -   [`buttons(text, buttons, options)`](#-buttons-text--buttons--options--)
        -   [`attachment(type, url, options)`](#-attachment-type--url--options--)
        -   [`generic(elements, options)`](#-generic-elements--options--)
-   [Helpers](#helpers)
    -   [Button](#button)
    -   [Generic Message](#generic-message)
    -   [Get Started Button](#get-started-button)
    -   [Greeting](#greeting)
    -   [Quick Reply](#quick-reply)
-   [User object](#user-object)
    -   [Get user data](#get-user-data)
    -   [Send message](#send-message)
-   [Static elements](#static-elements)
    -   [`incredbot.send.setting(data)`](#-incredbotsendsetting-data--)
        -   [Greeting](#greeting-1)
        -   [Get Started Button](#get-started-button-1)
        -   [Persistent Menu](#persistent-menu)
-   [Natural typing](#natural-typing)
-   [Generator Module](#generator-module)
    -   [Supported types](#supported-types)
        -   [Text](#text)
        -   [Quick Replies](#quick-replies)
        -   [Buttons](#buttons)
        -   [Generic](#generic)
    -   [Frame class](#frame-class)
-   [Broadcast API](#broadcast-api)
    -   [Create Creative Message](#create-creative-message)
    -   [Create label](#create-label)
    -   [List labels](#list-labels)
    -   [Delete label](#delete-label)
    -   [Assign label to user](#assign-label-to-user)
    -   [Remove label from user](#remove-label-from-user)
    -   [List labels assigned to users](#list-labels-assigned-to-users)
    -   [List broadcasts](#list-broadcasts)
    -   [Get broadcast info](#get-broadcast-info)
    -   [Cancel planned broadcast](#cancel-planned-broadcast)
    -   [Send broadcast](#send-broadcast)
        -   [Options](#options)
    -   [Start broadcast size estimationId](#start-broadcast-size-estimationid)
    -   [Get estimation results](#get-estimation-results)
    -   [Get metrics of broadcast](#get-metrics-of-broadcast)
-   [Comments interaction](#comments-interaction)
    -   [Private Reply](#private-reply)
-   [Examples](#examples)
    -   [Echo bot full example](#echo-bot-full-example)
-   [License](#license)
-   [About me 👨🏻‍💻](#about-me--------)

## What is incredbot?

Incredbot is library which allows you to easily build Facebook Messenger bot using Messenger Platform API with async/await syntax. Library provides server for listening for events from messenger and set of function and helpers for sending messages as simple as possible.

## Including

```javascript
const Incredbot = require('incredbot')
const incredbot = new Incredbot({
    access_token: config.facebook.access_token
})
```

Configuration object should be passed like `new Incredbot(configObject)`.

#### Configuration options

| Name                   | Descrition                                       | Type   | Default |
| ---------------------- | ------------------------------------------------ | ------ | ------- |
| `access_token`         | App's access token for desired page              | string | null    |
| `api_version`          | Graph API version to use inrequests              | string | 'v2.11' |
| `natural_typing`       | Enable or disable natural typing feature         | bool   | true    |
| `natural_typing_speed` | Speed of message typing in characters per second | int    | 50      |

## Server

### Starting server

```javascript
const webhook = incredbot.Server.setup()
const app = webhook.server
const bot = webhook.bot

app.listen(3000, () => {
  console.log('Server running on port 3000');
})
```

Now server is listening on `/webhook`. Your console should display your verify token.
**Server always returns status 200 to facebook!**

`incredbot.Server.setup()` returns object which contains server and bot properties.

`server` property is passed from Incredbot express instance, so you can create own routes for bot API if needed.

`bot` property is event listener which is designed to catch server events.

### Catching events

Catching events after starting a server is as simple as:

```javascript
bot.on('text', async (message, raw) => {
    ...
})
```

### Server events

| Event       | Description                                                  | Passed parameters                |
| ----------- | ------------------------------------------------------------ | -------------------------------- |
| request     | Every request to your webhook                                | `body`, `request`                |
| entry       | Each entry in received object                                | `entry`                          |
| echo        | Any message sent by bot (every message with `is_echo: true`) | `incredbotMessage`, `rawMessage` |
| message     | Any message received (each object of `entry.messaging`)      | `incredbotMessage`, `rawMessage` |
| text        | Text message received                                        | `incredbotMessage`, `rawMessage` |
| location    | Each message attachment with `type: 'location'`              | `incredbotMessage`, `rawMessage` |
| image       | Each message attachment with `type: 'image'`                 | `incredbotMessage`, `rawMessage` |
| fallback    | Each message attachment not recognized by messenger platform | `incredbotMessage`, `rawMessage` |
| payload     | Any payload received (button or quick reply)                 | `incredbotMessage`, `rawMessage` |
| postback    | Payload from button reveived                                 | `incredbotMessage`, `rawMessage` |
| quick_reply | Payload from quick reply received                            | `incredbotMessage`, `rawMessage` |
| change      | Each change in received object (ex. new comment on page)     | `rawChange`                      |
| comment     | Each comment action on page                                  | `incredbotChange`, `rawChange`   |

### Incredbot Message vs Raw Message

As you probably noticed in table above,a lot of events have passed data named `incredbotMessage` and `rawMessage`. First object is object created by incredbot library containing most useful informations like sender, type or content. It also contains `reply` object which allows you to reply to the message sender without passing recipient id. Second object is unmodified object received from Messenger Platform.

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

## Helpers

Using helpers is the easiest way to send desired message to facebook. Helpers are returning object for

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

### Generic Message

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

## User object

`incredbot.User(messenger_id)` allows to perform some basic operations on specific user.

### Get user data

You can fetch user data like `first_name`, `gender`, etc with `.getData(...fields)` method.

```javascript
let data = awiat incredbot.User(this.data.messenger_id).getData('first_name', 'last_name', 'id')
```

**Attention!**
Remember that for some fields like gender you need special permissions from facebook, unless your request will fail with status code 400!

### Send message

You can send message directly to messenger id using Usee's send object. The rules are the same as using send or reply object.

```javascript
const user = incredbot.User(message.sender_id)
await user.send.text('Hi!')
```

## Static elements

Incredbot allows you to easily set static elements of your bot, like Get Started Button, Greeting text or persistent menu.

### `incredbot.send.setting(data)`

This function allows you to send any object to graph apip `/me/messenger_profile` endpoint. To easily send basic elements to API use Helpers as shown below.

#### Greeting

```javascript
let greeting = new bot.Helpers.Greeting('This is greeting text!')
await incredbot.send.setting(greeting)
```

#### Get Started Button

```javascript
let get_started = new bot.Helpers.GetStartedButton()
await incredbot.send.setting(get_started)
```

#### Persistent Menu

Actually, incredbot hasn't got any helper for menu, so you have to craft menu object on your own and then send it.

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

await incredbot.send.setting(menu)
```

## Natural typing

Incredbot by default sets timeout to your messages that contiant text and displays typing animation to client. This feature is turned on by default and can be configured vie config object passed to Incredbot instance.

## Generator Module

Generator module was created to easily create messages for Broadcast API Creative Messages, but it can be also used to create advanced or unusual messages that are not covered by send methods and helpers. In brief, generator return message in facebook format which you can edit.

Generator module is accessible as Message object (`incredbot.Message`)

### Supported types

#### Text

`incredbot.Message.Text(text, options)`

```javascript
const message = new incredbot.Message.Text('This is message created with generator module')
```

#### Quick Replies

`incredbot.Message.QuickReplies(text, replies, options)`

```javascript
const replies = [
  new incredbot.Helpers.QuickReply('text', 'Super', 'PAYLOAD_1'),
  new incredbot.Helpers.QuickReply('text', 'Ok', 'PAYLOAD_2')
]

const message = new incredbot.Message.QuickReplies('This is message created with generator module', replies)
```

#### Buttons

`incredbot.Message.Buttons(text, buttons, quick_replies, options)`

If quick_replies parameter is not an array it's interpreted as options object!

```javascript
const buttons = [
  new incredbot.Helpers.Button('postback', 'Button 1', 'PAYLOAD_1'),
  new incredbot.Helpers.Button('postback', 'Button 2', 'PAYLOAD_2')
]

const message = new incredbot.Message.QuickReplies('This is message created with generator module', buttons)
```

#### Generic

`incredbot.Message.Generic(elements, options)`

```javascript
const card = {
  title: 'Card',
  subtitle: 'Subtitle',
  image_url: 'https://example.com/images/1.png',
  buttons: [...]
}

const cards = [card, card, card]

const message = new incredbot.Message.Generic(cards)
```

### Frame class

`incredbot.Frame(message, recipient_id, options)`

Above examples of supported messages shows how to use Generator module. Any generator returns only message body. It means that there isn's recipient object etc and message is **compatible only with Broadcast API Creative Message**. If you want to send message from creator as reply to message you will have to use MessageFrame class, which is accessible as `incredbot.Frame`

When message is in frame you can send it using `incredbot.send.raw()` or `message.reply.raw()` (if reply object is available). This is exactly the same, because message in frame has already defined recipient id.

```javascript
const message = new incredbot.Message.Text('Text message created with Generator class')
const framedMessage = new incredbot.Frame(message, '1489852771114961')
await incredbot.send.raw(framedMessage)
```

## Broadcast API

Incredbot supports Messenger Platform Broadcast API, so you can easily manage labels and other stuff needed to send message via Broadcast API.

### Create Creative Message

`incredbot.broadcast.createMessage(message)`

Creates creative message. To create message which can be used as creatice message use Generator Module, which is described in Generator Module section.

Function returns ID of created message.

```javascript
const replies = [
  new incredbot.Helpers.QuickReply('text', 'Yes', 'YES_PAYLOAD'),
  new incredbot.Helpers.QuickReply('text', 'No', 'NO_PAYLOAD')
]
const message = new incredbot.Message.QuickReplies('This is some question pushed by broadcast API.', replies)
const messageId = await incredbot.broadcast.createMessage(message)
```

### Create label

`incredbot.broadcast.createLabel(name)`

Creates label and returns ID of created label.

```javascript
const labelId = await incredbot.broadcast.createLabel('my_label_1')
```

### List labels

`incredbot.broadcast.listLabels()`

Lists all labels on connected page.

```javascript
const labels = await incredbot.broadcast.listLabels()
```

### Delete label

`incredbot.broadcast.deleteLabel(labelId)`

Deletes label with passed id. Returns original facebook response like `{ success: true }`

```javascript
const deleted = await incredbot.broadcast.deleteLabel('1967522760009660')
```

### Assign label to user

`incredbot.broadcast.labelToUser(labelId, userId)`

Adds label to user. Returns original facebook response like `{ success: true }`

```javascript
const added = await incredbot.broadcast.labelToUser('2034816159918780', '1489852771114961')
```

### Remove label from user

`incredbot.broadcast.removeLabelFromUser(labelId, userId)`

Adds label to user. Returns original facebook response like `{ success: true }`

```javascript
const removed = await incredbot.broadcast.removeLabelFromUser('2034816159918780', '1489852771114961')
```

### List labels assigned to users

`incredbot.broadcast.listUserLabels(userId)`

Lists labels assigned to user (names and id's).

```javascript
const userLabels = await incredbot.broadcast.listUserLabels('1489852771114961')
```

### List broadcasts

`incredbot.broadcast.listBroadcasts()`

Lists broadcasts from connected page.

```javascript
const broadcastsList = await incredbot.broadcast.listBroadcasts()
```

### Get broadcast info

`incredbot.broadcast.getBroadcast(broadcastId)`

Fetches data about broadcast.

```javascript
const broadcastsList = await incredbot.broadcast.getBroadcast('2209764209284356')
```

### Cancel planned broadcast

`incredbot.broadcast.cancel(broadcastId)`

Cancels broadcast (if scheduled).

```javascript
const canceled = await incredbot.broadcast.cancel('2209764209284356')
```

### Send broadcast

`incredbot.broadcast.send(creativeId, labelId, options)`

Sends broadcast and return pushed broadcast id.

Params:

-   `creativeId` - ID of creative message which should be pushed
-   `labelId` - Label ID of target audience
-   `options` - Object with settings of broadcast (optional)

#### Options

| Name                | Description                                                                       | Default                        |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------------ |
| `messaging_type`    | Messaging type of message                                                         | 'MESSAGE_TAG'                  |
| `tag`               | Tag of message                                                                    | 'NON_PROMOTIONAL_SUBSCRIPTION' |
| `notification_type` | Type of notification that broadcast will trigger                                  | 'REGULAR'                      |
| `schedule_time`     | Time when facebook should send your broadcast. ISO-8601 or Unix timestamp format. | undefined                      |

### Start broadcast size estimationId

`incredbot.broadcast.startEstimation(labelId)`

Estimates range of broadcast in passed label ID. Returns estimation ID.

```javascript
const estimation = await incredbot.broadcast.startEstimation('2034816156918780')
```

### Get estimation results

`incredbot.broadcast.getEstimation(estimationId)`

Fetches estimation results.

```javascript
const estimationResult = await incredbot.broadcast.getEstimation('YnJvYWRjYXN0X3JlYWNoX2VzdGltYXRpb246MTkzMzgwMTQ0Njk2NDk1LjE1NDQ1Mzg5MjAuNTg4OC4yMDE3QjYxMDY2')
```

### Get metrics of broadcast

`incredbot.broadcast.getMetrics(broadcastId)`

Fetches metrics of broadcast.

```javascript
const metrics = await incredbot.broadcast.getMetrics('2209764209284356')
```

## Comments interaction

For now, the only interaction with comment which is supported by incredbot is private replying.

### Private Reply

`comment.tools.replyPrivately(text)`

Object tools, which contains replyPrivately method is only inside comment object. To send privte reply to comment you need to catch it's event first.

```javascript
bot.on('comment', async (comment, raw) => {
  try {
    await comment.tools.replyPrivately('Hi! This is private reply!')
  } catch (e) {
    console.error(e)
  }
})
```

## Examples

### Echo bot full example

```javascript
const Incredbot = require('incredbot')
const incredbot = new Incredbot({
  access_token: '<PAGE_ACCESS_TOKEN>'
})

const webhook = incredbot.Server.setup()
const app = webhook.server
const bot = webhook.bot

bot.on('text', async (message, raw) => {
  try {
    await message.reply.text(message.text)
  } catch (e) {
    console.error(e)
  }
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
```

## License

This software is licensed under MIT License.

## About me 👨🏻‍💻

I'm almost 20 years old Node.JS software. I've been creating bots almost since messenger supports them. If you have any questions feel free to contact me at m.tomczyk.dev@gmail.com
