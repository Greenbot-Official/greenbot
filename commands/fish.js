const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'fish',
  aliases: 'fish',
  description: 'go fishing',
	usage: 'fish',
	cooldown: '5',
  async execute (message, args) {
		const user = app.currency.get(message.author.id);
		const fishexp = user ? user.fish_exp : 0;
		const randmult = fishexp / 5
		const rand = Math.round(Math.random() * randmult + 1)
		const money = rand / 2
		const biggest = user ? user.biggest_catch : 0;
		const newrec = Math.max(rand, biggest)
		
		if (user) {
			user.balance += Number(rand);
			user.fish_exp += Number(1);
			user.biggest_catch = Number(newrec)
			user.save();
		} else {
			const newUser = await app.Users.create({ user_id: message.author.id, balance: rand, fish_exp: 1, biggest_catch: newrec });
			app.currency.set(message.author.id, newUser);
		}
		func.log(`${message.author} caught a ${rand}in fish`, message)
		return message.channel.send(`${message.author} caught a ${rand}in :fish:`)

  }
}