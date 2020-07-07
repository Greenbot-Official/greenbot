const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'flame',
  id: 0,
  async execute(message, userEffects, tUserEffects, user, tUser) {
    tUserEffects.burn = Number(3)
    tUserEffects.save()
    return message.reply('your target was set on fire')
  },
}