/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import Sequelize from 'sequelize';

require('babel-plugin-require-context-hook/register')();

/*
if (process.env.NODE_ENV === 'development') {
  require('babel-plugin-require-context-hook/register')();
}
*/

export default sequelize => {
  const db = {};

  const context = require.context(
    '.',
    true,
    /^\.\/(?!index\.js).*\.js$/,
    'sync',
  );

  context
    .keys()
    .map(context)
    .forEach(module => {
      const model = module(sequelize, Sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
