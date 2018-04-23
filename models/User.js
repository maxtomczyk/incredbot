const axios = require('axios')

const logger = require('eazy-logger').Logger({
    prefix: "{blue:[Incredbot-User]}",
    useLevelPrefixes: true
})


class User {
    constructor(messenger_id, config) {
      if(!messenger_id) logger.warn('You must pass messenger id of user!')
      this.messenger_id = messenger_id
      this.api_url = `https://graph.facebook.com/${config.api_version}/${this.messenger_id}?fields=first_name,last_name,profile_pic,locale,timezone,gender,is_payment_enabled,last_ad_referral&access_token=${config.access_token}`
    }

    async getData(){
        try {
          let data = await axios.get(this.api_url)
          return data.data
        } catch (e) {
          logger.error(e)
        }
    }
}

module.exports = User
