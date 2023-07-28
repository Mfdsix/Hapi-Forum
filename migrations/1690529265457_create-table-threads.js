exports.up = pgm => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    created_at: {
      type: 'VARCHAR(25)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('threads')
}
