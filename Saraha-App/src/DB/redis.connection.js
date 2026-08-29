import { createClient } from "redis";

export let client;
async function redisConnection() {
  client = createClient({
    url: "rediss://default:gQAAAAAAAzoTAAIgcDE1YWQ2MTE4MmM3ZjA0ZjhjOWY1ZWNhOWY0MjNhMjJmNg@precise-loon-211475.upstash.io:6379",
  });

  await client.connect();

  console.log("Redis connected successfully");
}

export default redisConnection;
