const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'antidote',
  async execute(message, userEffects, tUserEffects, user, tUser) {
    userEffects.poison = Number(0)
    userEffects.save()
    return message.reply('you are no longer poisoned')
  },
}