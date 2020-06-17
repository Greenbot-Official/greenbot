const fs = require('fs');

module.exports = {
	log: function(text, message) {
		var readmessagefile = fs.readFileSync('log.txt', `utf-8`);
		fs.writeFileSync('log.txt', readmessagefile+`\n${message.createdAt}: ${message.guild} - ${text}`)
		return console.log(`${message.createdAt}: ${message.guild} - ${text}`);
	},
}