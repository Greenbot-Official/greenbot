const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')
const { Users } = require('../dbObjects')

module.exports = {
  name: 'userinfo',
  aliases: ['userinfo'],
  description: 'gets full info on user',
  usage: 'userinfo {id}',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const user = app.currency.get(args[0])
		func.log(`is looking at user <${args[0]}>`, message, client);
		if (!user) return message.channel.send(`${user.user_id} :: 
		not initialized`
		, { code: true} )
    return message.channel.send(`${user.user_id} ::
		adventure: ${user.adventure}
		leaderboard: ${user.leaderboard}
		level: ${user.level}
		turn: ${user.turn}
		combat: ${user.combat}
		combat_target_id: ${user.comabt_target_id}
		combat_target: ${user.comabt_target}
		max_health: ${user.max_health}
		health: ${user.health}
		balance: ${user.balance}
		fish_exp: ${user.fish_exp}
		biggest_catch: ${user.biggest_catch}
		crime_exp: ${user.crime_exp}
		combat_exp: ${user.combat_exp}
		luck: ${user.luck}
		strength: ${user.strength}
		dexterity: ${user.dexterity}
		curse: ${user.curse}
		curse_time: ${user.curse_time}`
    , { code: true })

  }
}