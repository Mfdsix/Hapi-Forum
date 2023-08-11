exports.up = pgm => {
  pgm.createTable('thread_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('thread_comment_likes')
}
