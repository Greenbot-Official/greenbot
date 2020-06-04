const app = require('../app')

module.exports = {
  name: 'fish',
  aliases: 'fish',
  description: 'go fishing',
	usage: 'fish',
	cooldown: '5',
  execute (message, args) {
		const fishexp = app.getFishexp(message.author.id);
		const randmult = fishexp / 5
		const rand = Math.round(Math.random() * randmult + 1)
		const money = rand / 2
		app.log(`${message.author} caught a ${rand}in fish`, message)
		app.add(message.author.id,money)
		app.addFishexp(message.author.id,1)
		const newrec = Math.max(rand, app.getBiggestCatch(message.author.id))
		app.setBiggestCatch(message.author.id, newrec)
		return message.channel.send(`${message.author} caught a ${rand}in :fish:`)

  }
}