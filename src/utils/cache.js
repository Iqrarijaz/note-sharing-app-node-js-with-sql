const getRedisClient = require("../config/redis");
const { printLog } = require("./logger");

async function getCache(key) {
  printLog("REPONSE FROM CACHE", null, { key });
  const client = await getRedisClient();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value, ttl = 300) {
  const client = await getRedisClient();
  await client.set(key, JSON.stringify(value), {
    EX: ttl
  });
}

async function deleteCache(key) {
  const client = await getRedisClient();
  await client.del(key);
}

module.exports = {
  getCache,
  setCache,
  deleteCache
};
