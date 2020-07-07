const fs = require('fs');
const config = require('../config.json');
const { client } = require('../app');

module.exports = {
	log: function(text, message) {
		var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
		var name = message.author.id === config.author ? '<owner>' : message.author
		var text2 = text.replace(`@${config.author}`,'owner')
		fs.writeFileSync('log.txt', readmessagefile+`\n${message.createdAt}: ${message.guild} - ${name} ${text2}`)
		fs.writeFileSync('archives.txt', readmessagefile+`\n${message.createdAt}: ${message.guild} - ${name} ${text2}`)
		return console.log(`${message.createdAt}: ${message.guild} - ${name} ${text2}`);
	},
	clear: function(userEffects, effect, message) {
		if (effect === 'burn') {
			userEffects.burn = Number(0)
			message.reply('you are no longer burning')
		} else if (effect === 'poison') {
			userEffects.poison = Number(0)
			message.reply('you are no longer poisoned')
		}
		return userEffects.save()
	},
	clearStatus: function(userEffects) {
		userEffects.burn = Number(0)
		userEffects.poison = Number(0)
		return userEffects.save()
	},
	calclvl: function(lvl) {
		return (lvl + 1) * 2
	},
	die: function(message, cause, user, userEffects) {
		user.health = Number(1)
		user.balance -= Math.round(user.balance / 6)
		user.save()
		userEffects.save()
		this.clearStatus(userEffects)
		this.log(cause, message)
		return message.reply(cause)
	},
	updateEffects: function(user, userEffects) {
		if (userEffects.burn > 0) {
			user.health -= Number(2)
			userEffects.burn -= Number(1)
			user.save()
			userEffects.save()
			if (userEffects.burn < 1) message.reply('you are no longer burning')
			return cause = 'burned to death'
		}
		if (userEffects.poison > 0) {
			user.health -= Number(1)
			userEffects.burn -= Number(1)
			user.save()
			userEffects.save()
			if (userEffects.poison < 1) message.reply('you are no longer poisoned')
			return cause = 'died by poison'
		}
	}
}