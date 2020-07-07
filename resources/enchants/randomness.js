const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'randomness',
  id: 4,
  async execute(message, userEffects, tUserEffects, user, tUser) {
    const rand = Math.round(Math.random() * 7)
    switch (rand) {
      case 0:
        userEffects.burn = Number(2)
        userEffects.save()
        message.reply('you have been set on fire')
        break;
      case 1:
        userEffects.poison = Number(5)
        userEffects.save()
        message.reply('you have been poisoned')
        break;
      case 2:
        user.fish_exp += Math.round(user.fish_exp / 10)
        user.save()
        message.reply('you get better at fishing')
        break;
      case 3:
        user.luck += Number(2)
        user.save()
        message.reply('you get luckier')
        break;
      case 4:
        tUserEffects.burn = Number(2)
        tUserEffects.save()
        message.reply('your target has been set on fire')
        break;
      case 5:
        tUserEffects.poison = Number(5)
        tUserEffects.save()
        message.reply('your target has been poisoned')
        break;
      case 6:
        tUser.fish_exp += Math.round(tUser.fish_exp / 15)
        tUser.save()
        message.reply('your target gets better at fishing')
        break;
      case 7:
        tUser.luck += Number(2)
        tUser.save()
        message.reply('your target gets luckier')
        break;
    }
  },
}