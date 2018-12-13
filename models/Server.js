const express = require('express')
const bodyParser = require('body-parser')
const randomize = require('../modules/randomize')

const Logger = require('../modules/logger')
const Sender = require('./Sender.js')
const CommentTools = require('./CommentTools.js')

const app = express()
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

let that = null

class Server {
    constructor(config, emitter) {
        this.config = config
        this.verify_token = randomize.string(10)
        this.emitter = emitter
        this.log = new Logger(this.config, 'SERVER', emitter)
        that = this
    }

    setup() {
        app.get('/webhook', (req, res) => {
            let mode = req.query['hub.mode']
            let token = req.query['hub.verify_token']
            let challenge = req.query['hub.challenge']

            if (mode && token) {
                if (mode === 'subscribe' && token === this.verify_token) {
                    this.log.info('Webhook connected!')
                    res.status(200).send(challenge)
                } else {
                    this.log.warn('Webhook connect try with incorrect token.')
                    res.sendStatus(403)
                }
            }
        })

        app.post('/webhook', (req, res) => {
            let body = req.body
            that.emitter.emit('request_incoming', body, req)
            if (body.object === 'page') {
                body.entry.forEach(function (entry) {
                    that.emitter.emit('entry', entry)
                    if (entry.messaging) {
                        entry.messaging.forEach(message => {
                            if (message.message && message.message.is_echo) {
                                let m = {}
                                m.text = message.message.text
                                m.app_id = message.message.app_id
                                m.timestamp = message.timestamp
                                m.recipient_id = message.recipient.id
                                m.reply = new Sender(that.config, message.recipient.id, that.emmiter)
                                that.emitter.emit('echo', m, message)
                                return
                            }

                            let m = {}
                            m.sender_id = message.sender.id
                            m.reply = new Sender(that.config, message.sender.id, that.emitter)
                            m.timestamp = message.timestamp
                            if (message.message && message.message.text) m.text = message.message.text

                            that.emitter.emit('message', m, message)

                            if (message.message && message.message.attachments) {
                                message.message.attachments.map(attachment => {
                                    if (attachment.type === 'location') {
                                        m.location = attachment.payload.coordinates
                                        that.emitter.emit('location', m, message)
                                    } else if (attachment.type === 'image') {
                                        m.url = attachment.payload.url
                                        that.emitter.emit('image', m, message)
                                    } else if (attachment.type === 'fallback') {
                                        m.url = attachment.url
                                        m.title = attachment.title
                                        m.payload = attachment.payload
                                        that.emitter.emit('fallback', m, message)
                                    }
                                })
                            } else if (!message.message && message.postback) {
                                m.payload = message.postback.payload
                                that.emitter.emit('postback', m, message)
                                that.emitter.emit('payload', m, message)
                            } else if (message.message.quick_reply) {
                                m.payload = message.message.quick_reply.payload
                                that.emitter.emit('quick_reply', m, message)
                                that.emitter.emit('payload', m, message)
                            } else {
                                that.emitter.emit('text', m, message)
                            }
                        })
                    } else if (entry.changes) {
                        entry.changes.forEach(change => {
                            that.emitter.emit('change', change)
                            let o = {}
                            o.user = change.value.from,
                                o.type = change.value.item,
                                o.created_time = change.value.created_time

                            if (o.type === 'comment') {
                                o.comment = {
                                    text: change.value.message,
                                    id: change.value.comment_id
                                }
                                o.tools = new CommentTools(that.config, o.comment, o.user, that.emitter)
                                that.emitter.emit('comment', o, change)
                            }
                        })
                    }
                })

                res.status(200).send('EVENT_RECEIVED')
            } else {
                res.sendStatus(404)
            }
        })

        // Timeout needed to set event listener outside this file
        setTimeout(function () {
            that.log.info(`Verify token: ${that.verify_token}`)
        }, 1000)

        return {
            bot: that.emitter,
            server: app
        }
    }


}

module.exports = Server
