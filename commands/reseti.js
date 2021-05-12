const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')
const { UserItems } = require('../dbObjects')

module.exports = {
  name: 'reseti',
  aliases: ['reseti'],
  description: 'resets targets inventory',
  usage: 'resetinv {id}',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const tuser = app.currency.get(args[0])
    UserItems.destroy({ where: { user_id: tuser.user_id } })
    return func.log(`reset ${tuser.user_id} inv`, message, client);

  }
}