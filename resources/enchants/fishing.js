const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'fishing',
  id: 1,
  async execute(message, userEffects, tUserEffects, user, tUser) {
    user.fish_exp += Number(5)
    user.save()
    return message.reply('you get better at fishing')
  },
}