const func = require('../resources/functions')
const app = require('../app')
const config = require('../config.json')

module.exports = {
  name: 'reinitializeusers',
  aliases: ['reinitusers'],
  description: 'reloads all users by id saved to text file',
  usage: 'reinitializeusers',
  admin: true,
  removal: false,
  async execute(message, args, client) {
    const usersfile = app.fs.readFileSync('users.txt', 'utf-8')
    let users = usersfile.split(' ')
    for (let i = 0; i <= users.length; i++) {
      user = await app.Users.create({ user_id: users[i] });
      userEffects = await app.UserEffects.create({ user_id: users[i] })
      app.currency.set(users[i], user);
      if (config.author.includes(users[i])) {
        user.addUniqueItem('god\_sword', 'w', null, 100, 'str', 1, null, 1)
        user.addUniqueItem('wacking\_stick', 'w', 'randomness', 0, 'none', 0, null, 1)
        user.balance += Number(100)
        user.save()
      }
      func.logconsole(`initialized user <${users[i]}>`, message.createdAt, client)
    }
    return func.log(`reinitialized users`, message, client);

  }
}