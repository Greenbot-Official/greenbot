const fs = require('fs');
const config = require('../config.json');
const { client } = require('../app');

module.exports = {
	log: function(text, message) {
		var readarchives = fs.readFileSync('archives.txt', `utf-8`);
		var text2 = `${message.author} ${text}`
		text2 = text2.replace(`<@${config.author}>`, '<owner>')
		for (var i = 0; i < config.coolids.length; i++) {
			text2 = text2.replace(`<@${config.coolids[i]}>`, `<${config.coolnames[i]}>`)
		}
		fs.writeFileSync('archives.txt', readarchives+`\n${message.createdAt}: ${message.guild} - ${text2}`)
		return console.log(`${message.createdAt}: ${message.guild} - ${text2}`);
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
		user.balance = 0
		user.save()
		userEffects.save()
		this.clearStatus(userEffects)
		this.log(cause, message)
		return message.reply(cause)
	},
	updateEffects: function(message, user, userEffects) {
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