/// <reference types="cypress" />

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', {
    'db:clean': async () => {
      const mongoose = require('mongoose');

      await mongoose.connect(config.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();

      return null;
    },
    sync: async () => {
      await new Promise(r => setTimeout(r, 50));

      return null;
    },
  });
};
