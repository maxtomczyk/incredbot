const Server = require('./models/Server.js')
const Sender = require('./models/Sender.js')
const QuickReply = require('./models/QuickReply.js')
const Button = require('./models/Button.js')

class Incredbot {
    constructor(config) {
        config = config || {}
        this.access_token = config.access_token
        this.Server = new Server(config)
        this.send = new Sender(config)
        this.helpers = {
            QuickReply: QuickReply,
            Button: Button
        }
    }
}

module.exports = Incredbot
