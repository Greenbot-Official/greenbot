module.exports = {
  name: 'fish',
  aliases: 'fish',
  description: 'go fishing',
  usage: 'fish',
  execute (message, args) {
		const fishexp = require('../app').getFishexp(message.author.id);
		const randmult = fishexp / 5
		const rand = Math.round(Math.random() * randmult + 1)
		const money = rand / 2
		require('../app').log(`${message.author} caught a ${rand}in fish`, message)
		require('../app').add(message.author.id,money)
		require('../app').addFishexp(message.author.id,1)
		const newrec = Math.max(rand, require('../app').getBiggestCatch(message.author.id))
		require('../app').setBiggestCatch(message.author.id, newrec)
		return message.channel.send(`${message.author} caught a ${rand}in :fish:`)

  }
}