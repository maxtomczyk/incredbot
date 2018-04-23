const logger = require('eazy-logger').Logger({
    prefix: "{blue:[Incredbot-Helpers]}",
    useLevelPrefixes: true
})

class Message {
    constructor(options) {
        options = options || {}
        this.messaging_type = options.messaging_type || 'RESPONSE'
        this.recipient = {}
        this.recipient.id = options.recipient_id
        this.message = {}
        this.message.attachment = {
            type: 'template',
            payload: {}
        }

        if (options.buttons) {
            let p = this.message.attachment.payload
            p.template_type = 'button'
            p.text = options.text
            p.buttons = options.buttons
        }

        if (options.generics) {
            let p = this.message.attachment.payload
            p.template_type = 'generic'
            p.elements = options.generics
        }
    }
}

module.exports = Message
