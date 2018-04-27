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
            type: options.type,
            payload: {
                url: options.url,
                is_reusable: options.is_reusable
            }
        }
    }
}

module.exports = Message
