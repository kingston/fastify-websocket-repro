const fastify = require('fastify')({ logger: true })

fastify.register(require('@fastify/websocket'))
fastify.register(async function (fastify) {
  fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    fastify.log.info(`connection opened from ${req.ip}`);
    connection.socket.on('message', message => {
      fastify.log.info('received message');
      connection.socket.send('hi from server')
    })
  })
})

fastify.listen({ port: 3000, host: 'localhost' }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

const TIMEOUT = 5000;

const shutdownServer = (signal) => {
  setTimeout(() => {
    fastify.log.error(new Error('Shutdown timed out'));
    process.exit(1);
  }, TIMEOUT).unref();

  fastify.log.info(`Received ${signal} signal. Shutting down...`);

  fastify
    .close()
    .then(() => process.exit(0))
    .catch((err) => {
      fastify.log.error(err);
      process.exit(1);
    });
};

process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);

