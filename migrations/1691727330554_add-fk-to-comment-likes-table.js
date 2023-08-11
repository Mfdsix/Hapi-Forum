const tableName = 'thread_comment_likes'
const fkNameComment = 'fk_thread_comment_likes.comment'
const fkNameOwner = 'fk_thread_comment_likes.owner'

exports.up = pgm => {
  pgm.addConstraint(tableName, fkNameComment, 'FOREIGN KEY(comment) REFERENCES thread_comments(id) ON UPDATE CASCADE ON DELETE CASCADE')
  pgm.addConstraint(tableName, fkNameOwner, 'FOREIGN KEY(owner) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint(tableName, fkNameComment)
  pgm.dropConstraint(tableName, fkNameOwner)
}
