const func = require('../resources/functions')
const app = require('../app')
const fs = require('fs')

module.exports = {
  name: 'joincall',
  aliases: 'joincall',
  description: 'says hello',
  usage: 'hello',
  admin: true,
  removal: false,
  async execute(message, args) {
	  if (message.member.voice.channel) {
		  const connection = await message.member.voice.channel.join();
      const audio = connection.receiver.createStream(user, { mode: 'pcm', end: 'manual' });
      audio.pipe(fs.createWriteStream('user_audio'));

    }
    
  }
}