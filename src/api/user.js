({
  async read(id) {
    const response = await db('user').read(id, ['id', 'email'])
    return response
  },

  async create({ name, phone, email, password, address, points }) {
    const { encrypt: { createPasswordHash } } = util
    const hashedPassword = createPasswordHash(password)
    const user = await db('user').create({ name, phone, email, password: hashedPassword, address, points })

    return user
  },

  async update(id, record) {
    return await db('user').update(id, record);
  },

  async delete(id) {
    return await db('user').delete(id);
  },

})