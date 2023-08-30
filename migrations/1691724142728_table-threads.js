/* eslint-disable camelcase */

exports.up = (pgm) => pgm.createTable('threads', {
  id: {
    type: 'VARCHAR(50)',
    primaryKey: true,
  },
  title: {
    type: 'TEXT',
    notNull: true,
  },
  body: {
    type: 'TEXT',
    notNull: true,
  },
  owner: {
    type: 'TEXT',
    notNull: true,
    references: '"users"',
    onDelete: 'cascade',
  },
  created_at: {
    type: 'TEXT',
    notNull: true,
  },
  updated_at: {
    type: 'TEXT',
    notNull: true,
  },
  deleted_at: {
    type: 'TEXT',
  },
});

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
