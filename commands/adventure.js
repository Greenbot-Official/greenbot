const func = require('../resources/functions')
const app = require('../app')
const Discord = require('discord.js')
const config = require('../config.json')
const Canvas = require('canvas');
const { Adventures } = require('../dbObjects');


module.exports = {
  name: 'adventure',
  aliases: 'ad',
  description: 'displays adventure menu',
  usage: 'adventure [args]',
  async execute(message, args) {
    const id = message.author.id
    const user = app.currency.get(id)
    const pos = await Adventures.findOne({ where: { user_id: id, player: true } })
    if (id !== config.author) return message.channel.send('adventure curently not available')
    if (!args[0]) {
      func.log('is looking at the adventure help', message)
      return message.channel.send('start: - starts a new adventure if not already in one\nview: - shows map of current adventure\nup | down | left | right: - moves in respective direction while in adventure', { code: true })
    
    } else if (args[0] === 'start') {
      if (user.adventure) return message.reply('you are already in an adventure')
      user.adventure = Boolean(true)
      user.save()
      message.channel.send('loading map . . .')
      for (let x = -1;x < 10;x++) {
        for (let y = -1;y < 10;y++) {
          await Adventures.create({ user_id: id, x_pos: x, y_pos: y })
        }
      }
      const playerRoom = await Adventures.findOne({ where: { user_id: id, x_pos: 5, y_pos: 0 } })
      playerRoom.player = Boolean(true)
      playerRoom.explored = Boolean(true)
      playerRoom.type = Number(1)
      playerRoom.save()
      message.channel.send('drawing map . . .')
      const image = await draw(id)
      func.log('started new adventure', message)
      return message.channel.send(image)

    } else if (args[0] === 'veiw') {
      if (!user.adventure) return message.reply('you are not in an adventure')
      message.channel.send('drawing map . . .')
      const image = await draw(id)
      func.log('is veiwing an adventure', message)
      return message.channel.send(image)

    } else if (args[0] === 'up' || args[0] === 'u') {
      if (!user.adventure) return message.reply('you are not in an adventure')
      const newX = Number(pos.x_pos)
      const newY = Number(pos.y_pos-1)
      const newPos = await Adventures.findOne({ where: { user_id: id, x_pos: newX, y_pos: newY } })
      if (pos.y_pos == 0 | pos.type == 1 | pos.type == 3 | pos.type == 5 | pos.type == 7 | pos.type == 9 | pos.type == 11 | pos.type == 13 | (newPos.type == 4 | 5 | 6 | 7 | 12 | 13 | 14)) { 
        message.channel.send('the way is blocked off')
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      } else {
        await newRoom(pos, newPos)
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      }

    } else if (args[0] === 'right' || args[0] === 'r') {
      if (!user.adventure) return message.reply('you are not in an adventure')
      const newX = Number(pos.x_pos+1)
      const newY = Number(pos.y_pos)
      const newPos = await Adventures.findOne({ where: { user_id: id, x_pos: newX, y_pos: newY } })
      if (pos.x_pos == 9 | pos.type ==  2 | pos.type == 3 | pos.type == 6 | pos.type == 7 | pos.type == 10 | pos.type == 11 | pos.type == 14 | newPos.type == 8 | newPos.type == 9 | newPos.type == 10 | newPos.type == 11 | newPos.type == 12 | newPos.type == 13 | newPos.type == 14) { 
        message.channel.send('the way is blocked off')
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      } else {
        await newRoom(pos, newPos)
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      }

    } else if (args[0] === 'down' || args[0] === 'd') {
      if (!user.adventure) return message.reply('you are not in an adventure')
      const newX = Number(pos.x_pos)
      const newY = Number(pos.y_pos+1)
      const newPos = await Adventures.findOne({ where: { user_id: id, x_pos: newX, y_pos: newY } })
      if (pos.y_pos == 9 | (pos.type == 4 | 5 | 6 | 7 | 12 | 13 | 14) | (newPos.type == 1 | 3 | 5 | 7 | 9 | 11 | 13)) { 
        message.channel.send('the way is blocked off')
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      } else {
        await newRoom(pos, newPos)
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      }

    } else if (args[0] === 'left' || args[0] === 'l') {
      if (!user.adventure) return message.reply('you are not in an adventure')
      const newX = Number(pos.x_pos-1)
      const newY = Number(pos.y_pos)
      const newPos = await Adventures.findOne({ where: { user_id: id, x_pos: newX, y_pos: newY } })
      if (pos.x_pos == 0 | (pos.type == 8 | 9 | 10 | 11 | 12 | 13 | 14) | (newPos.type ==  2 | 3 | 6 | 7 | 10 | 11 | 14)) { 
        message.channel.send('the way is blocked off')
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      } else {
        await newRoom(pos, newPos)
        message.channel.send('drawing map . . .')
        const image = await draw(id)
        return message.channel.send(image)
      }

    }
  }
}

async function draw(id) {
  const canvas = Canvas.createCanvas(320, 320);
  const ctx = canvas.getContext('2d');
  for (let x = 0;x < 9;x++) {
    for (let y = 0;y < 9;y++) {
      let room = await Adventures.findOne({ where: { user_id: id, x_pos: x, y_pos: y } })
      let image
      try {
        image = room.player ? await Canvas.loadImage(`./resources/textures/${room.type}p.png`) : await Canvas.loadImage(`./resources/textures/${room.type}.png`)
      } catch(e) {
        image = await Canvas.loadImage(`./resources/textures/15.png`)
      }
      ctx.drawImage(image, x*32, y*32, 32, 32);
    }
  }
  return new Discord.MessageAttachment(canvas.toBuffer())
}

async function newRoom(pos, newPos) {
  pos.player = Boolean(false)
  pos.save()
  newPos.player = Boolean(true)
  newPos.save()
  if (!newPos.explored) {
    const type = await roomGen(pos, newPos)
    newPos.explored = Boolean(true)
    newPos.type = Number(type)
    await newPos.save()
  }
  return
}

async function roomGen(pos, newPos) {
  if (newPos.y_pos = 0) {
    if (newPos.x_pos = 0) {
      return 9
    } else {
      return 1
    }
  } else if (newPos.x_pos = 0) {
    return 8
  } else if (newPos.y_pos = 9) {
    if (newPos.x_pos = 9) {
      return 6
    } else {
      return 4
    }
  } else if (newPos.x_pos = 9) {
    return 2
  } else {
    //not finished
    return 0
  }
}