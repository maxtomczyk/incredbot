const axios = require('axios')
const Botanalytics = require('botanalytics');

const logger = require('eazy-logger').Logger({
    prefix: "{blue:[Incredbot-User]}",
    useLevelPrefixes: true
})

class User {
    constructor(messenger_id, config, sender) {
        if (!messenger_id) logger.warn('You must pass messenger id of user!')
        this.config = config || {}
        this.messenger_id = messenger_id
        this.api_url = `https://graph.facebook.com/${config.api_version}/${this.messenger_id}`
        this.send = sender
        this.botanalytics = (this.config.botanalytics) ? Botanalytics.FacebookMessenger(this.config.botanalytics.token) : false
    }

    async getData(...fields) {
        try {
            fields = (fields.length > 0) ? fields : ['first_name, last_name, id, locale, timezone, gender']
            let url = `${this.api_url}?fields=${fields.toString().replace(' ', '')}&access_token=${this.config.access_token}`
            let data = await axios.get(url)

            if (this.botanalytics) {
                let analyticsData = Object.assign({}, data.data)
                analyticsData.user_id = analyticsData.id

                delete analyticsData.last_ad_referral
                delete analyticsData.is_payment_enabled
                delete analyticsData.id

                this.botanalytics.logUserProfile(analyticsData)
            }

            return data.data
        } catch (e) {
            console.error(e.response.data);
            logger.error(e)
        }
    }
}

module.exports = User
