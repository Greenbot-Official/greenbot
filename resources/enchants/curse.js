const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'curse',
  async execute(message, userEffects, tUserEffects, user, tUser) {
    tUser.curse = true
    tUser.curse_time = Date.now()
    tUser.save()
    return message.reply(`you have been cursed`);
  },
}