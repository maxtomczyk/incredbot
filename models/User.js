const axios = require('axios')
const Botanalytics = require('botanalytics');

const logger = require('eazy-logger').Logger({
    prefix: "{blue:[Incredbot-User]}",
    useLevelPrefixes: true
})


class User {
    constructor(messenger_id, config, sender) {
      if(!messenger_id) logger.warn('You must pass messenger id of user!')
      this.config = config || {}
      this.messenger_id = messenger_id
      this.api_url = `https://graph.facebook.com/${config.api_version}/${this.messenger_id}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${config.access_token}`
      this.send = sender
      this.botanalytics = (this.config.botanalytics) ? Botanalytics.FacebookMessenger(this.config.botanalytics.token) : false
    }

    async getData(){
        try {
          let data = await axios.get(this.api_url)

          if(this.botanalytics){
            let analyticsData = Object.assign({}, data.data)
            analyticsData.user_id = analyticsData.id

            delete analyticsData.last_ad_referral
            delete analyticsData.is_payment_enabled
            delete analyticsData.id

            this.botanalytics.logUserProfile(analyticsData)
          }

          return data.data
        } catch (e) {
          logger.error(e)
        }
    }
}

module.exports = User
