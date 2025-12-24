const { createClient } = require("redis");

let client;

async function getRedisClient() {
  if (!client) {
    client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    });

    client.on("error", err => {
      console.error("Redis Error:", err);
    });

    await client.connect();
  }
  return client;
}

module.exports = getRedisClient;
