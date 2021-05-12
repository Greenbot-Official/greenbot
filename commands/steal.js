const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'steal',
  aliases: ['steal'],
  description: 'chance to steal money from target',
  usage: 'steal [@target]',
  cooldown: '500',
  admin: false,
  removal: false,
  execute(message, args, client) {
    const target = message.mentions.users.first() || message.author
    const user = app.currency.get(target.id)
    if (target == message.author) {
      const suc = Math.round(Math.random() * 100)
      const money = Math.round(user.balance / 10)
      if (suc >= 50) {
        user.crime_exp += 1
        user.balance += money
        user.save()
        func.log(`mugged an innocent civilian for ${money}`, message, client)
        return message.channel.send(`${message.author} stole from an innocent civilian for ${money}💰`)
      } else {
        user.crime_exp -= 1
        user.balance -= (money * 1.5)
        user.save()
        func.log(`tried mugged an innocent civilian and lost ${money * 1.5}`, message, client)
        return message.channel.send(`${message.author} tried to steal from an innocent civilian and lost ${money * 1.5}💰`)
      }

    } else {
      const u = app.currency.get(message.author.id)
      const suc = Math.round(Math.random() * 100)
      if (suc >= 50) {
        const money = Math.round(user.balance * .15)
        user.crime_exp -= 1
        user.balance -= money
        u.crime_exp += 1
        u.balance += money
        user.save()
        u.save()
        func.log(`${message.author} stole ${target} for ${money}`, message, client)
        return message.channel.send(`${message.author} stole ${money}💰 from ${target}`)
      } else {
        const money = Math.round(user.balance * .05)
        user.crime_exp += 1
        user.balance += money
        u.crime_exp -= 1
        u.balance -= money
        user.save()
        u.save()
        func.log(`${message.author} tried to mug ${target} and lost ${money}`, message, client)
        return message.channel.send(`${message.author} tried to steal from ${target} and lost ${money}💰`)
      }

    }

  }
}