const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'flame',
  id: 0,
  async execute(message, userEffects, tUserEffects, user, tUser) {
    tUser.burn = Number(3)
    tUser.save()
    return message.reply('your target was set on fire')
  },
}