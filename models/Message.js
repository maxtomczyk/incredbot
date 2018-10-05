const logger = require('../modules/winston')

class Message {
    constructor(options) {
        options = options || {}
        this.messaging_type = options.messaging_type || 'RESPONSE'
        this.recipient = {}
        this.recipient.id = options.recipient_id
        this.message = {}

        if(options.text) this.message.text = options.text
        if(options.replies) this.message.quick_replies = options.replies
    }
}

module.exports = Message
