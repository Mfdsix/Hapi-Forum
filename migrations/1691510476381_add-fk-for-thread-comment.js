const tableName = 'thread_comments'
// const fkNameThread = 'fk_thread_comments.thread'
const fkNameOwner = 'fk_thread_comments.owner'
const fkNameParent = 'fk_thread_comments.parent'

exports.up = pgm => {
  // pgm.addConstraint(tableName, fkNameThread, 'FOREIGN KEY(thread) REFERENCES threads(id)')
  pgm.addConstraint(tableName, fkNameOwner, 'FOREIGN KEY(owner) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE')
  pgm.addConstraint(tableName, fkNameParent, 'FOREIGN KEY(parent) REFERENCES thread_comments(id) ON UPDATE CASCADE ON DELETE CASCADE')
}

exports.down = pgm => {
  // pgm.dropConstraint(tableName, fkNameThread)
  pgm.dropConstraint(tableName, fkNameOwner)
  pgm.dropConstraint(tableName, fkNameParent)
}
