const app = require('../app')
const func = require('../resources/functions');
const { UserEffects } = require('../dbObjects');

module.exports = {
  name: 'fish',
  aliases: 'fish',
  description: 'go fishing',
	usage: 'fish',
	cooldown: '5',
  async execute (message, args) {
		const user = app.currency.get(message.author.id);
		if (user.combat) return message.channel.send('you cannot do that while in combat')
		const fishexp = user.fish_exp || 0;
		const randmult = fishexp / 5
		const rand = Math.round(Math.random() * randmult + 1)
		const money = rand / 2
		const biggest = user.biggest_catch || 0;
		const newrec = Math.max(rand, biggest)

		const userEffects = await UserEffects.findOne({ where: { user_id: message.author.id } })
		if (userEffects.fish_effect > 0) {
			if (userEffects.fish_effect === 1) {
				user.fish_exp -= Number(18)
				message.reply('your fishing bonus has worn off')
			}
			userEffects.fish_effect -= Number(1)
		}
		
		user.balance += Number(rand);
		user.fish_exp += Number(1);
		user.biggest_catch = Number(newrec)
		user.save();
		userEffects.save()

		func.log(`caught a ${rand}in fish`, message)
		return message.channel.send(`${message.author} caught a ${rand}in :fish:`)

  }
}