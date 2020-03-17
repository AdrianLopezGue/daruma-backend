export default {
  protocol: process.env.EVENT_STORE_PROTOCOL || 'http',
  hostname: process.env.EVENT_STORE_HOSTNAME || '127.0.0.1',
  tcpPort: process.env.EVENT_STORE_TCP_PORT || 1113,
  httpPort: process.env.EVENT_STORE_HTTP_PORT || 2113,
  credentials: {
    username: process.env.EVENT_STORE_CREDENTIALS_USERNAME || 'admin',
    password: process.env.EVENT_STORE_CREDENTIALS_PASSWORD || 'changeit',
  },
  poolOptions: {
    min: process.env.EVENT_STORE_POOLOPTIONS_MIN || 1,
    max: process.env.EVENT_STORE_POOLOPTIONS_MAX || 10,
  },
};
