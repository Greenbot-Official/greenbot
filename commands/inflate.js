const func = require('../resources/functions')
const app = require('../app')

module.exports = {
  name: 'inflate',
  aliases: 'cc',
  description: 'creates money',
  usage: 'inflate {amount}',
  admin: true,
  removal: false,
  async execute(message, args) {
    const user = app.currency.get(message.author.id);
    user.balance += Number(args[0])
    user.save()
    func.log(`created $${args[0]}`, message)

  }
}