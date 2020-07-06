const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'fishing',
  id: 1,
  async execute(message, userEffects, tUserEffects, user, tUser) {
    if (!(userEffects.fish_effect > 0)) user.fish_exp += Number(30)
    userEffects.fish_effect = Number(5)
    user.save()
    userEffects.save()
    return message.reply('you get better at fishing')
  },
}