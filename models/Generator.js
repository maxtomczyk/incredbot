const QuickReply = require('./helpers/QuickReply.js')
const Button = require('./helpers/Button.js')
const GetStartedButton = require('./helpers/GetStartedButton.js')
const Greeting = require('./helpers/Greeting.js')
const Generic = require('./helpers/Generic.js')
const Message = require('./Message.js')
const TemplateMessage = require('./TemplateMessage.js')

const logger = require('../modules/winston.js')

class Text extends Message {
    constructor(text, recipient, options) {
        super(options)
        this.message.text = text
        this.recipient.id = recipient
    }
}

class QuickReplies extends Text {
    constructor(text, replies, recipient, options) {
        super(text, recipient, options)
        this.message.quick_replies = replies
    }
}

class Buttons extends TemplateMessage {
    constructor(text, buttons, recipient, options) {
        options = options || {}
        options.text = text
        options.recipient_id = recipient || options.recipient_id
        options.buttons = buttons

        super(options)
    }
}

class Generator {
    constructor(options) {
        this.Text = Text
        this.QuickReplies = QuickReplies
        this.Buttons = Buttons
    }
}

module.exports = Generator;
