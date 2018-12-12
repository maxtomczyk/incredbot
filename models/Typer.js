const axios = require('axios')

let that = null

class Typer {
    constructor(options, emitter) {
        this.api_url = options.api_url || `https://graph.facebook.com/${options.api_version}/me/messages?access_token=${options.access_token}`
        this.emitter = emitter
        that = this
    }

    on(id, time) {
        return new Promise((resolve, reject) => {
            const body = {
                recipient: {
                    id: id
                },
                sender_action: 'typing_on'
            }
            axios.post(this.api_url, body)
                .then((data) => {
                    that.emitter.emit('request_outgoing', body, data)
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
            const body = {
                recipient: {
                    id: id
                },
                sender_action: 'typing_off'
            }
            axios.post(this.api_url, body)
                .then((data) => {
                    that.emitter.emit('request_outgoing', body, data)
                    resolve(data)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

module.exports = Typer
