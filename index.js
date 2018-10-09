const Server = require('./models/Server.js')
const Sender = require('./models/Sender.js')
const Helpers = require('./models/Helpers.js')
const User = require('./models/User.js')
const Typer = require('./models/Typer.js')
const Uploader = require('./models/Uploader.js')
const MessageGenerator = require('./models/Generator.js')
const Broadcast = require('./models/Broadcast.js')

class Incredbot {
    constructor(config) {
        config = config || {}
        this.config = config
        this.config.api_version = this.config.api_version || 'v2.11'

        this.access_token = config.access_token
        this.Server = new Server(config)
        this.send = new Sender(config)
        this.Helpers = new Helpers()
        this.Typer = new Typer(config)
        this.upload = new Uploader(config)
        this.Message = new MessageGenerator(config)
        this.broadcast = new Broadcast(config)
    }

    User(messenger_id) {
        return new User(messenger_id, this.config, new Sender(this.config, messenger_id))
    }
}

module.exports = Incredbot
