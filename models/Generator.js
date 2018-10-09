const QuickReply = require('./helpers/QuickReply.js')
const Button = require('./helpers/Button.js')
const GetStartedButton = require('./helpers/GetStartedButton.js')
const Greeting = require('./helpers/Greeting.js')
const Generic = require('./helpers/Generic.js')
const MessageBase = require('./MessageBase.js')
const TemplateBase = require('./TemplateBase.js')

const logger = require('../modules/winston.js')

class Text extends MessageBase {
    constructor(text, options) {
        options = options || {}
        super(options)
        this.text = text
    }
}

class QuickReplies extends Text {
    constructor(text, replies, options) {
        super(text, options)
        this.quick_replies = replies
    }
}

class Buttons extends TemplateBase {
    constructor(text, buttons, quick_replies, options) {
        options = options || {}
        options.text = text
        options.buttons = buttons
        options.quick_replies = quick_replies

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
