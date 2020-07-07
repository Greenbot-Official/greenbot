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
        const rand3 = Math.round(Math.random() * 1)
        var weapon;
        switch (rand3) {
          case 0:
            weapon = 'iron\_dagger'
            break;
          case 1:
            weapon = 'iron\_greatsword'
            break;
        }
        const rand4 = Math.round(Math.random() * 0)
        var ench;
        switch (rand4) {
          case 0:
            ench = app.getEnchants(0)
            break;
        }
        find = `an ${weapon} of ${ench.name}`
        user.addUniqueItem(`${weapon}\_of\_${ench.name}`,'weapon',ench.id,5,null)
        break;
    }
    user.save()
    func.log(`found a chest with ${find}`, message)
    return message.reply(`found a chest with ${find} in it`)
  },
}