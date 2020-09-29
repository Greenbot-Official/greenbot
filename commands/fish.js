const app = require('../app')
const func = require('../resources/functions');
const { UserEffects } = require('../dbObjects');

module.exports = {
  name: 'fish',
  aliases: 'fish',
  description: 'go fishing',
	usage: 'fish',
	cooldown: '60',
	admin: false,
  async execute (message, args) {
		const user = app.currency.get(message.author.id);
		if (user.combat) return message.channel.send('you cannot do that while in combat')
		const fishexp = user.fish_exp || 0;
		const randmult = fishexp / 5
		const rand = Math.round(Math.random() * randmult + 1)
		const money = rand / 2
		const biggest = user.biggest_catch || 0;
		const newrec = Math.max(rand, biggest)
		
		user.balance += Number(rand);
		user.fish_exp += Number(1);
		user.biggest_catch = Number(newrec)
		user.save();

		func.log(`caught a ${rand}in fish`, message)
		return message.channel.send(`${message.author} caught a ${rand}in :fish:`)

  }
}