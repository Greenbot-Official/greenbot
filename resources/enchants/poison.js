const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'poison',
  id: 2,
  async execute(message, userEffects, tUserEffects, user, tUser) {
    tUserEffects.poison = Number(6)
    tUserEffects.save()
    return message.reply('your target has been poisoned')
  },
}