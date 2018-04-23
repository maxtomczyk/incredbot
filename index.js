const Server = require('./models/Server.js')
const Sender = require('./models/Sender.js')
const Helpers = require('./models/Helpers.js')
const User = require('./models/User.js')

class Incredbot {
    constructor(config) {
        config = config || {}
        this.config = config
        this.config.api_version = this.config.api_version || 'v2.11'

        this.access_token = config.access_token
        this.Server = new Server(config)
        this.send = new Sender(config)
        this.Helpers = new Helpers()
    }

    User(messenger_id) {
        return new User(messenger_id, this.config)
    }
}

module.exports = Incredbot
