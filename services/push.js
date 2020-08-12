//PUSH
var push = require('web-push')

let vapidKeys = push.generateVAPIDKeys()
let vapidKeys = {
    publicKey: 'BC0eDE92338RKYDyfdZvVpgOHRdWvYosUIJKNPv9OQnM2RkEtDt-BR2tZRqDd1GkdQ_8ZxdmO3W-YoDnE0jpFck',
    privateKey: '2Tvd40xvvghJWkMHxmWdcF8qRUzV3eJRND5Q9D5I3eg'
}
push.setVapidDetails('mailto:ranzlmn@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey)

let sub = {}

push.sendNotification(sub, 'test message Tamir ha homo')
//PUSHEND
