const func = require('../resources/functions')

module.exports = {
  name: 'dm',
  aliases: 'dm',
  description: 'dms target',
  usage: 'dm {@user} {message}',
  execute(message, args) {
		const target = message.mentions.users.first()
		if (!target) throw func.throwError('invalidUser')
    if(!message.member.hasPermission("ADMINISTRATOR")) func.throwError('invalidPerms')
    mentionMessage = args;
    if(mentionMessage.length < 1) throw func.throwError('invalidSyntax')
		target.send(`${mentionMessage}`)
		return func.log(`${message.author} sent ${mentionMessage} to ${target}`, message)

  }
}