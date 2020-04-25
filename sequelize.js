const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

// all the tag stuff is from @link:{https://github.com/discordjs/guide/blob/master/code-samples/sequelize/tags/sequelize.js}

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
});

const Tags = sequelize.define('tags', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
})

client.once('ready', () => {
  Tags.sync();
  console.log('Ready!');
})

client.on('message', message => {
  if (message.content.startsWith(prefix)) {
		const input = message.content.slice(prefix.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		if (command === 'addtag') {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');

			try {
				const tag = await Tags.create({
					name: tagName,
					description: tagDescription,
					username: message.author.username,
				});
				return message.reply(`Tag ${tag.name} added.`);
			} catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.reply('That tag already exists.');
				}
				return message.reply('Something went wrong with adding a tag.');
			}
		} else if (command === 'tag') {
			const tagName = commandArgs;

			const tag = await Tags.findOne({ where: { name: tagName } });
			if (tag) {
				tag.increment('usage_count');
				return message.channel.send(tag.get('description'));
			}
			return message.reply(`Could not find tag: ${tagName}`);
		} else if (command === 'edittag') {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');

			const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
			if (affectedRows > 0) {
				return message.reply(`Tag ${tagName} was edited.`);
			}
			return message.reply(`Could not find a tag with name ${tagName}.`);
		} else if (command === 'taginfo') {
			const tagName = commandArgs;

			const tag = await Tags.findOne({ where: { name: tagName } });
			if (tag) {
				return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
			}
			return message.reply(`Could not find tag: ${tagName}`);
		} else if (command === 'showtags') {
			const tagList = await Tags.findAll({ attributes: ['name'] });
			const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
			return message.channel.send(`List of tags: ${tagString}`);
		} else if (command === 'removetag') {
			const tagName = commandArgs;
			const rowCount = await Tags.destroy({ where: { name: tagName } });
			if (!rowCount) return message.reply('That tag did not exist.');

			return message.reply('Tag deleted.');
		}
    if (command === 'e') {
      message.channel.send("hi, I am greenbot");
    }
  }
});

client.login(token);