exports.up = pgm => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    parent: {
      type: 'VARCHAR(50)',
      notNull: false
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    deleted_at: {
      type: 'VARCHAR(25)',
      notNull: false
    },
    created_at: {
      type: 'VARCHAR(25)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('thread_comments')
}
