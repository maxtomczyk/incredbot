const axios = require('axios')

class Typer {
    constructor(options) {
        this.api_url = options.api_url || `https://graph.facebook.com/${options.api_version}/me/messages?access_token=${options.access_token}`
    }

    on(id, time) {
        return new Promise((resolve, reject) => {
            axios.post(this.api_url, {
                    recipient: {
                        id: id
                    },
                    sender_action: 'typing_on'
                })
                .then((data) => {
                    setTimeout(() => {
                        resolve(data)
                    }, time)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    off(id) {
        return new Promise((resolve, reject) => {
            axios.post(this.api_url, {
                    recipient: {
                        id: id
                    },
                    sender_action: 'typing_off'
                })
                .then((data) => {
                    resolve(data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

module.exports = Typer
