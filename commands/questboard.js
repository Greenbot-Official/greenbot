const app = require('../app')
const func = require('../resources/functions')
const { QuestBoard, Enemy, UserItems } = require('../dbObjects');

module.exports = {
  name: 'questboard',
  aliases: ['qb','quest'],
  description: 'displays the items in the shop',
  usage: 'questboard [quest name/id]',
  admin: true,
  removal: true,
  async execute(message, args) {
    const quests = await QuestBoard.findAll();
    func.log(`is browsing the shop`, message)
    if (!args[0]) {
      return message.channel.send(
        quests.sort((a, b) => a.diff - b.diff).map(q => `[${q.id}]${q.name}: ${q.desc} ${q.reward}💰`).join('\n\n')
        , { code: true }
      );
    } else {
      let qname = args[0]
      if (!qname) return message.channel.send('please enter a quest to take')
      const user = app.currency.get(message.author.id);
      // if (user.combat) return message.channel.send('you cannot do that while in combat')
      let q = await QuestBoard.findOne({ where: { name: qname } });
      if (!q) {
        q = await QuestBoard.findOne({ where: { id: qname } });
        if (!q) return message.channel.send(`could not find quest: ${qname}`)
      }

      user.combat = Boolean(true)
      await user.addQuest(q.name);
      user.save();

      func.log(`accepted ${q.name}`, message)
      message.channel.send(`You've accepted the quest ${q.name}!`);

      const enemy = Enemy.findOne({ where: { user_id: user.user_id } })
      return message.channel.send(`${message.author.tag}: \n` +
        `${user.health}/${user.max_health} \n\n` +
        `${enemy.name}: \n` +
        `${enemy.health}/${enemy.max_health}`, { code: true })
    }
  }
}