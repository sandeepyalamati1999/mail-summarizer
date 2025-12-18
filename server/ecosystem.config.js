// ecosystem.config.js

module.exports = {
    apps: [
      {
        name: 'ticket-support',
        script: 'server-start.js', // Adjust the entry point as needed
        instances: 'max',       // Or specify a number like 1
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  