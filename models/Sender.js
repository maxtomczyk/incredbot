const axios = require('axios')

const logger = require('eazy-logger').Logger({
    prefix: "{blue:[Incredbot-Sender]}",
    useLevelPrefixes: true,
    level: 'warn'
})

const Message = require('./Message.js')
const Template = require('./TemplateMessage.js')
const Attachment = require('./AttachmentMessage.js')
const Typer = require('./Typer.js')
const Botanalytics = require('botanalytics');

class Sender {
    constructor(config, recipient_id) {
        config = config || {}
        this.config = config
        this.access_token = config.access_token
        this.recipient_id = recipient_id || null
        this.api_version = config.api_version
        this.api_url = `https://graph.facebook.com/${this.api_version}/me/messages?access_token=${this.access_token}`
        this.setting_url = `https://graph.facebook.com/${this.api_version}/me/messenger_profile?access_token=${this.access_token}`
        this.natural_typing = config.natural_typing || true
        this.natural_typing_speed = config.natural_typing_speed || 50
        this.typing = new Typer(config)
        this.botanalytics = (this.config.botanalytics) ? Botanalytics.FacebookMessenger(this.config.botanalytics.token) : false
    }

    async raw(message) {
        if (message.message.text && this.natural_typing) await this.typing.on(message.recipient.id, this.calculateTypingTime(message.message.text))
        return new Promise((resolve, reject) => {
            axios.post(this.api_url, message)
                .then(res => {
                    if (this.botanalytics) this.botanalytics.logOutgoingMessage(message.message, message.recipient.id, this.access_token)
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    calculateTypingTime(text) {
        const cps = this.natural_typing_speed
        let time = Math.round((text.length / cps) * 1000)
        if (time < 5000) return time
        else return 5000
    }

    text(text, options) {
        if (!text) return logger.error('Message text can\'t be empty!')

        options = options || {}
        options.text = text
        options.recipient_id = this.recipient_id || options.recipient_id
        let message = new Message(options)

        return this.raw(message)
    }

    quick_replies(text, replies, options) {
        if (!text) return logger.error('Message text can\'t be empty!')

        options = options || {}
        options.text = text
        options.recipient_id = this.recipient_id || options.recipient_id
        options.replies = replies

        let message = new Message(options)

        return this.raw(message)
    }

    buttons(text, buttons, options) {
        if (!text) return logger.error('Message text can\'t be empty!')
        options = options || {}
        options.text = text
        options.recipient_id = this.recipient_id || options.recipient_id
        options.buttons = buttons

        let message = new Template(options)

        return this.raw(message)
    }

    setting(data) {
        return new Promise((resolve, reject) => {
            axios.post(this.setting_url, data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    generic(elements, options) {
        options = options || {}
        options.recipient_id = this.recipient_id || options.recipient_id
        options.generics = elements

        let message = new Template(options)
        return this.raw(message)
    }

    attachment(type, url, options) {
        options = options || {}
        options.recipient_id = this.recipient_id || options.recipient_id
        options.is_reusable = options.is_reusable || true
        options.url = url
        options.type = type

        let message = new Attachment(options)
        return this.raw(message)
    }
}

module.exports = Sender
