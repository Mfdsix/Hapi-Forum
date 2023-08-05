/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const UsersTableTestHelper = {
  async addUser (payload = {}) {
    const {
      id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia'
    } = payload
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username',
      values: [id, username, password, fullname]
    }

    const result = await pool.query(query)
    return result.rows[0]
  },

  async findUsersById (id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM users WHERE 1=1')
  }
}

module.exports = UsersTableTestHelper
