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
    thread: {
      type: 'VARCHAR(50)',
      notNull: false
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
      type: 'timestamp',
      notNull: false
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('thread_comments')
}
