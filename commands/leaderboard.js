const func = require('../resources/functions')
const app = require('../app')
const { Users } = require('../dbObjects')

module.exports = {
  name: 'leaderboard',
  aliases: 'top',
  description: 'displays options for leaderboard',
  usage: 'leaderboard [args]',
  async execute(message, args, client) {
    const user = app.currency.get(message.author.id)
    if (!args[0]) {
      func.log(`${message.author} is veiwing the leaderboard help`, message)
      return message.channel.send(`toggle: - toggles public stats (currently: ${user.leaderboard}) \nbalance: - top balances \nfish: - shows biggest catch \ncrime: - top crime exp \ncombat: - top combat exp`, { code: true })

    } else if (args[0] === 'toggle') {
      user.leaderboard = !(user.leaderboard)
      user.save()
      func.log(`${message.author} toggled leaderboard status to ${user.leaderboard}`, message)
      return message.reply(`has changed their leaderboard status to:\`${user.leaderboard}\``)

    } else if (args[0] === 'bal' || args[0] === 'balance' || args[0] === 'money') {
      func.log(`${message.author} is veiwing the bal leaderboard`, message)
      return message.channel.send(app.currency.sort((a, b) => b.balance - a.balance)
        .filter(user => client.users.cache.has(user.user_id))
        .filter(user => user.leaderboard)
        .first(10)
        .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
        .join('\n'), { code: true })

    } else if (args[0] === 'fish') {
      func.log(`${message.author} is veiwing the fishing leaderboard`, message)
      return message.channel.send(app.currency.sort((a, b) => b.biggest_catch - a.biggest_catch)
        .filter(user => client.users.cache.has(user.user_id))
        .filter(user => user.leaderboard)
        .first(10)
        .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.biggest_catch}`)
        .join('\n'), { code: true })

    } else if (args[0] === 'crime') {
      func.log(`${message.author} is veiwing the crime leaderboard`, message)
      return message.channel.send(app.currency.sort((a, b) => b.crime_exp - a.crime_exp)
        .filter(user => client.users.cache.has(user.user_id))
        .filter(user => user.leaderboard)
        .first(10)
        .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.crime_exp}`)
        .join('\n'), { code: true })

    } else if (args[0] === 'combat' || args[0] === 'battle' || args[0] === 'fighting') {
      func.log(`${message.author} is veiwing the combat leaderboard`, message)
      return message.channel.send(app.currency.sort((a, b) => b.combat_exp - a.combat_exp)
        .filter(user => client.users.cache.has(user.user_id))
        .filter(user => user.leaderboard)
        .first(10)
        .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.combat_exp}`)
        .join('\n'), { code: true })

    }

  }
}