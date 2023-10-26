const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

module.exports = table => ({
  query: async (sql, args) => {
    try {
      const result = await pool.query(sql, args)
      return result.rows
    } catch (err) {
      throw new Error(err)
    }
  },

  create: async ({ ...record }) => {
    const keys = Reflect.ownKeys(record)
    const nums = new Array(keys.length)
    const data = new Array(keys.length)

    let i = 0

    for (const key of keys) {
      data[i] = record[key]
      nums[i] = `$${++i}`
    }

    const fields = `"${keys.join('", "')}"`
    const params = nums.join(', ')
    const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params})`
    const result = await pool.query(sql, data)
    return result
  },

  read: async (id, fields = ['*']) => {
    const names = fields.join(', ')
    const sql = `SELECT ${names} FROM "${table}"`

    // SELECT name, email FROM "user" WHERE id = 1

    const result = id
      ? await pool.query(`${sql} WHERE id = $1`, [id])
      : await pool.query(sql)

    return result
  },

  update: async (id, { ...record }) =>  {
    const keys= Reflect.ownKeys(record)
    const updates = new Array(keys.length)
    const data = new Array(keys.length)

    let i = 0

    for (const key of keys) {
      data[i] = record[key]
      updates[i] = `${key} = $${++i}`
    }

    const delta = updates.join(', ')
    const sql = `UPDATE ${table} SET ${delta} WHERE id = $${++i}`

    data.push(id)

    const result = await pool.query(sql, data)
    return result
  },

  delete: async (id) => {
    const sql = `DELETE FROM ${table} WHERE id = $1`
    const result = await pool.query(sql, [id])
    return result
  }
})