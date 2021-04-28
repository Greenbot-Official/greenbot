const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'curseremoval',
  async execute(message, userEffects, tUserEffects, user, tUser) {
    user.curse = false
    user.save()
    return message.reply('you have been lifted of your curse')
  },
}