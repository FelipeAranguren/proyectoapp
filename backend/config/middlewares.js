module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::logger',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173'],
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    },
  },
  'strapi::body',
  'strapi::query',
  'strapi::favicon',
  'strapi::public',
];