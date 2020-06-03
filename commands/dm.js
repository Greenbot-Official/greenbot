module.exports = {
  name: 'dm',
  aliases: 'dm',
  description: 'dms target',
  usage: 'dm {@user} {message}',
  execute(message, args) {
		const target = message.mentions.users.first()
		if (!target) return message.channel.send("Can't find user!")
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You can't you that command!")
    mentionMessage = args;
    if(mentionMessage.length < 1) return message.reply('You must supply a message!')
		target.send(`${mentionMessage}`)
		return require('../app').log(`${message.author} sent ${mentionMessage} to ${target}`, message)

  }
}