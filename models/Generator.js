const MessageBase = require('./MessageBase.js')
const TemplateBase = require('./TemplateBase.js')

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
        let optionsCopy = options || {}
        const arr = !Array.isArray(quick_replies)
        if (arr) optionsCopy = quick_replies || {}
        optionsCopy.text = text
        optionsCopy.buttons = buttons
        if (!arr) optionsCopy.quick_replies = quick_replies

        super(optionsCopy)
    }
}

class Generic extends TemplateBase {
    constructor(elements, options) {
        options = options || {}
        options.generics = elements
        super(options)
    }
}

class Generator {
    constructor(options) {
        this.Text = Text
        this.QuickReplies = QuickReplies
        this.Buttons = Buttons
        this.Generic = Generic
    }
}

module.exports = Generator;
