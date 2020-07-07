const fs = require('fs');
const config = require('../config.json')

module.exports = {
	log: function(text, message) {
		var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
		var name = message.author.id === config.author ? '<owner>' : message.author
		var text2 = text.replace(`@${config.author}`,'owner')
		fs.writeFileSync('log.txt', readmessagefile+`\n${message.createdAt}: ${message.guild} - ${name} ${text2}`)
		fs.writeFileSync('archives.txt', readmessagefile+`\n${message.createdAt}: ${message.guild} - ${name} ${text2}`)
		return console.log(`${message.createdAt}: ${message.guild} - ${name} ${text2}`);
	},
	clearStatus: function(userEffects) {
		userEffects.burn = Number(0)
		return userEffects.save()
	}
}