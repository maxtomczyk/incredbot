const logger = require('../modules/winston')

class Message {
    constructor(options) {
        options = options || {}

        if(options.text) this.text = options.text
        if(options.replies) this.quick_replies = options.replies
    }
}

module.exports = Message
