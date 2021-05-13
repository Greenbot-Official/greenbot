const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'exp',
  async execute(message, userEffects, tUserEffects, user, tUser) {
    user.exp += Number(10)
    user.save()
    return message.reply('you gained 10 exp')
  },
}