const app = require('../app')
const func = require('../resources/functions')
const { currency } = require('../app')
const { UserItems, UserEffects } = require('../dbObjects')
const config = require('../config.json')

module.exports = {
  name: 'adminst',
  aliases: 'adminst',
  description: 'gets the stats of a target',
  usage: 'stats [@target]',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.author
    const user = currency.get(target.id)
    if (!user) return message.channel.send(`${target.username} was not found`)
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: message.author.id, equipped: true } })
    const userEffects = await UserEffects.findOne({ where: { user_id: message.author.id } })
    let effects = ''
    if (userEffects.burn > 0) effects += `\nburn: ${userEffects.burn}`
    if (userEffects.poison > 0) effects += `\npoison: ${userEffects.poison}`
    if (user.curse) effects += `\nCURSED`
    if (!weapon.item_id) { wep = 'none' } else { wep = weapon.item_id }
    func.log(`is checking the stats of ${target}`, message, client)
    return message.channel.send(`${target.username}'s stats: \n` +
      `level: ${user.level} \n` +
      `health: ${user.health}/${user.max_health} \n` +
      `luck: ${user.luck} \n` +
      `strength: ${user.strength}\n` +
      `dexterity: ${user.dexterity}\n` +
      `fish exp: ${user.fish_exp}\n` +
      `biggest fish: ${user.biggest_catch} \n` +
      `combat exp: ${user.combat_exp}\n` +
      `crime exp: ${user.crime_exp}\n` +
      `adventure: ${user.adventure}\n` +
      `combat: ${user.combat}\n` +
      `combat target: ${user.combat_target}\n` +
      `combat tid: ${user.combat_target_id}\n` +
      `weapon: ${wep}\n` +
      `status:${effects}`
      , { code: true })

  }
}