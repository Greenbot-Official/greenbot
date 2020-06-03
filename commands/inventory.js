const { Users } = require('../dbObjects')

module.exports = {
  name: 'inventory',
  aliases: 'inv',
  description: 'checks user\'s inventory',
  usage: 'inv [@user]',
  async execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		require('../app').log(`${message.author} checked ${target}'s inventory`, message)
		return message.channel.send(`${target.tag} currently has:\n${items.map(t => `${t.amount} ${t.item.name}`).join('\n')}`);

  }
}