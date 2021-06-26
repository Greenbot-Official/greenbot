const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')
const { Enemy } = require('../dbObjects')

module.exports = {
  name: 'exitcombat',
  aliases: ['forceexit'],
  description: 'says hello',
  usage: 'hello',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const user = app.currency.get(args[0])
    await Enemy.destroy({ where: { user_id: user.user_id } })
    const tUser = app.currency.get(user.combat_target_id)
    user.combat = Boolean(false)
    user.turn = Boolean(true)
    user.save()
    tUser.combat = Boolean(false)
    tUser.turn = Boolean(true)
    tUser.save()
    func.log(`says hello`, message, client);

  }
}