const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'flame',
  async execute(message, userEffects, tUserEffects, user, tUser) {
    tUserEffects.necrofire = Boolean(true)
    tUserEffects.save()
    return message.channel.send(`<@${tUser.user_id}>, you have been set on fire`)
  },
}