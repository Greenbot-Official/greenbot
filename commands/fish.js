const func = require('../resources/functions')

module.exports = {
  name: 'fish',
  aliases: 'fish',
  description: 'go fishing',
	usage: 'fish',
	cooldown: '5',
  execute (message, args) {
		const fishexp = func.getFishexp(message.author.id);
		const randmult = fishexp / 5
		const rand = Math.round(Math.random() * randmult + 1)
		const money = rand / 2
		func.log(`${message.author} caught a ${rand}in fish`, message)
		func.add(message.author.id,money)
		func.addFishexp(message.author.id,1)
		const newrec = Math.max(rand, func.getBiggestCatch(message.author.id))
		func.setBiggestCatch(message.author.id, newrec)
		return message.channel.send(`${message.author} caught a ${rand}in :fish:`)

  }
}