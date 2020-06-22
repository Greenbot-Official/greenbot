const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'chest',
  id: 2,
  level: '1',
  async execute(message, user) {
    const rand = Math.round(Math.random() * 2)
    var find;
    switch (rand) {
      case 0:
        find = 'nothing'
        break;
      case 1:
        var g = Math.round(Math.random() + user.level + 1 * 2)
        find = `${g}💰`
        user.balance += g
        break;
      case 2:
        const rand2 = Math.round(Math.random() * 2)
        var stat;
        switch (rand2) {
          case 0:
            stat = 'being lucky'
            user.luck += Number(1)
            break;
          case 1:
            stat = 'fishing'
            user.fish_exp += Number(2)
            break;
          case 2:
            stat = 'crime'
            user.crime_exp += Number(2)
            break;
        }
        find = `a book about ${stat}`
        break;
      case 3:
        //wip
        const enchFiles = app.fs.readdirSync('./enchants').filter(file => file.endsWith('.js'));
        const ench = app.getEvents().get(Math.round(Math.random() * (enchFiles.length - 1)))
        const rand3 = Math.round(Math.random() * 1)
        var weapon;
        switch (rand3) {
          case 0:
            weapon = 'ironDagger'
            break;
          case 1:
            weapon = 'ironGreatsword'
            break;
        }
        find = `an ${weapon} of ${ench.name}`
        user.addUniqueItem(`${weapon} of ${ench.name}`,'weapon',5,null,ench.id)
        break;
    }
    user.save()
    func.log(`${message.author} found a chest with ${find}`, message)
    return message.reply(`found a chest with ${find} in it`)
  },
}