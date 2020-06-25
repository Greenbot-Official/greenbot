const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'flame',
  id: 0,
  async execute(user, tUser) {
    tUser.burn = Number(3)
    return tUser.save()
  },
}