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
		const tUser = app.currency.get(id);
		const tBal = user ? user.balance : 0;
		const crimexp = user ? user.crime_exp : 0
		const randmult = crimexp / 3
    var rand = Math.round(Math.random() * randmult + 1)
    if (target === message.author) {
      
      if (user) {
        user.crime_exp += Number(1);
        user.balance += Number(rand);
        user.save();
      } else {
        const newUser = await app.Users.create({ user_id: id, balance: rand, crime_exp: 1 });
        app.currency.set(id, newUser);
      }

      func.log(`${message.author} mugged an innocent civilian for ${rand}`, message)
      return message.channel.send(`${message.author} mugged an innocent civilian for ${rand}💰`)

    } else {
      if (!user) return message.channel.send(`${target.username} was not found`)
      rand = Math.min(rand, tBal)
      
      if (user) {
        user.crime_exp += Number(1);
        user.balance += Number(rand);
        user.save();
      } else {
        const newUser = await app.Users.create({ user_id: id, balance: rand, crime_exp: 1 });
        app.currency.set(id, newUser);
      }

      if (tUser) {
        tUser.balance += Number(-rand);
        tUser.save();
      } else {
        const newUser = await app.Users.create({ user_id: id, balance: -rand });
        app.currency.set(id, newUser);
      }

      func.log(`${message.author} mugged ${target} for ${rand}`, message)
      return message.channel.send(`${message.author} mugged ${target} for ${rand}💰`)

    }

  }
}