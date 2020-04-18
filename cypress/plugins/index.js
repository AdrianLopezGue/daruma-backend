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
    'es:clean': async () => {
      const axios = require('axios');

      const response = await axios({
        url: `${config.env.EVENT_STORE_URL}/streams/$ce-${config.env.EVENT_STORE_CATEGORY}`,
        method: 'GET',
      });

      const streams = response.data.entries
        .map(entry => entry.title.split('@')[1])
        .filter(value => !value.startsWith('$$'))
        .filter((value, index, self) => self.indexOf(value) === index);

      streams.forEach(async stream => {
        await axios({
          url: `${config.env.EVENT_STORE_URL}/streams/${stream}`,
          method: 'DELETE',
        });
      });

      return null;
    },
  });
};
