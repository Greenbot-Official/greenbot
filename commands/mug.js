const app = require('../app')
const func = require('../resources/functions')

module.exports = {
  name: 'mug',
  aliases: 'mug',
  description: 'mugs target',
  usage: 'mug [@target]',
  cooldown: '300',
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author
    const id = target.id
		const user = app.currency.get(message.author.id);
		if (user.combat) return message.channel.send('you cannot do that while in combat')
		const tUser = app.currency.get(id);
		const tBal = user.balance || 0;
		const crimexp = user.crime_exp || 0
		const randmult = crimexp / 3
    let rand = Math.round(Math.random() * randmult + 1)
    if (target === message.author) {
      
      user.crime_exp += Number(1);
      user.balance += Number(rand);
      user.save();

      func.log(`mugged an innocent civilian for ${rand}`, message)
      return message.channel.send(`${message.author} mugged an innocent civilian for ${rand}💰`)

    } else {
      if (!user) return message.channel.send(`${target.username} was not found`)
      rand = Math.min(rand, tBal)
      
      user.crime_exp += Number(1);
      user.balance += Number(rand);
      user.save();
      tUser.balance -= Number(rand);
      tUser.save();

      func.log(`mugged ${target} for ${rand}`, message)
      return message.channel.send(`${message.author} mugged ${target} for ${rand}💰`)

    }

  }
}