const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'devgive',
  aliases: 'devgive',
  description: 'gives self specified amount',
  usage: 'devgive {amount}',
  admin: true,
  removal: false,
  async execute(message, args) {
    const user = app.currency.get(message.author.id)
    user.balance += Number(args[0])
    user.save()
    return func.log(`gave themselves ${args[0]}`, message)

  }
}