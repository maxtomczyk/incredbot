const axios = require('axios')

const logger = require('eazy-logger').Logger({
    prefix: "{blue:[Incredbot-Sender]}",
    useLevelPrefixes: true,
    level: 'warn'
})

const Message = require('./Message.js')
const Template = require('./TemplateMessage.js')
const Attachment = require('./AttachmentMessage.js')

class Sender {
    constructor(config, recipient_id) {
        config = config || {}

        this.access_token = config.access_token
        this.recipient_id = recipient_id || null
        this.api_version = config.api_version
        this.api_url = `https://graph.facebook.com/${this.api_version}/me/messages?access_token=${this.access_token}`
        this.setting_url = `https://graph.facebook.com/${this.api_version}/me/messenger_profile?access_token=${this.access_token}`
    }

    raw(message) {
        return new Promise((resolve, reject) => {
            axios.post(this.api_url, message)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
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
