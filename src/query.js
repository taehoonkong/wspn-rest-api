const knex = require('./knex')
const bcrypt = require('bcrypt')

module.exports = {
  createUser(username, password) {
    const hashed_password = bcrypt.hashSync(password, 10)
    return knex('user')
      .insert({
        username,
        hashed_password
      })
  },
  compareUser(username, password) {
    return knex('user')
      .where({username})
      .first()
      .then(user => {
        if(user) {
          const isMatch = bcrypt.compareSync(password, user.hashed_password)
          if(isMatch) {
            return user
          }
        }
        throw new Error('사용자 이름 또는 비밀번호가 일치하지 않습니다.')
      })
  },
  getUserById(id) {
    return knex('user')
      .where({id})
      .first()
  }
}
