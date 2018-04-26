const randomstring = require('randomstring')
const express = require('express')
const bodyParser = require('body-parser')
const EventEmitter = require('events')
class Emitter extends EventEmitter {}
const emitter = new Emitter()
const logger = require('eazy-logger').Logger({
    prefix: "{blue:[Incredbot-Server]}",
    useLevelPrefixes: true
})
const Sender = require('./Sender.js')
const app = express()
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

let that = null

class Server {
    constructor(config) {
        this.config = config
        this.verify_token = randomstring.generate(10)
        that = this
    }

    setup() {
        app.get('/webhook', (req, res) => {
            let mode = req.query['hub.mode']
            let token = req.query['hub.verify_token']
            let challenge = req.query['hub.challenge']

            if (mode && token) {
                if (mode === 'subscribe' && token === this.verify_token) {
                    logger.log('Webhook connected!')
                    res.status(200).send(challenge)
                } else {
                    logger.warn('Webhook connect try with incorrect token.')
                    res.sendStatus(403)
                }
            }
        })

        app.post('/webhook', (req, res) => {
            let body = req.body
            if (body.object === 'page') {
                body.entry.forEach(function(entry) {
                    emitter.emit('entry', entry)

                    if (entry.messaging) {
                        entry.messaging.forEach(message => {
                            if (message.message && message.message.is_echo) {
                                let m = {}
                                m.text = message.message.text
                                m.app_id = message.message.app_id
                                m.timestamp = message.timestamp
                                m.recipient_id = message.recipient.id
                                m.reply = new Sender(that.config, message.recipient.id)
                                emitter.emit('echo', m, message)
                                return
                            }

                            let m = {}
                            m.sender_id = message.sender.id
                            m.reply = new Sender(that.config, message.sender.id)
                            m.timestamp = message.timestamp
                            if (message.message && message.message.text) m.text = message.message.text

                            emitter.emit('message', m, message)

                            if (!message.message && message.postback) {
                                m.payload = message.postback.payload
                                emitter.emit('postback', m, message)
                                emitter.emit('payload', m, message)
                            } else if (message.message.quick_reply) {
                                m.payload = message.message.quick_reply.payload
                                emitter.emit('quick_reply', m, message)
                                emitter.emit('payload', m, message)
                            } else {
                                emitter.emit('text', m, message)
                            }
                        })
                    }
                })

                res.status(200).send('EVENT_RECEIVED')
            } else {
                res.sendStatus(404)
            }
        })

        logger.info(`Verify token: ${this.verify_token}`)

        return {
            bot: emitter,
            server: app
        }
    }


}

module.exports = Server
