const axios = require('axios')

const logger = require('../modules/winston')

let that = null

class User {
    constructor(messenger_id, config, sender, emitter) {
        if (!messenger_id) logger.warn('You must pass messenger id of user!')
        this.config = config || {}
        this.messenger_id = messenger_id
        this.api_url = `https://graph.facebook.com/${config.api_version}/${this.messenger_id}`
        this.send = sender
        this.emitter = emitter
        that = this
    }

    async getData(...fields) {
        try {
            fields = (fields.length > 0) ? fields : ['first_name, last_name, id, locale, timezone, gender']
            let url = `${this.api_url}?fields=${fields.toString().replace(' ', '')}&access_token=${this.config.access_token}`
            let data = await axios.get(url)
            that.emitter.emit('request_outgoing', null, data)

            return data.data
        } catch (e) {
            logger.error(e)
        }
    }
}

module.exports = User
