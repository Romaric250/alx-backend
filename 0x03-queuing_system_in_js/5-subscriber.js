#!/usr/bin/env node

import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("connect", () => {
    console.log("Redis client connected to the server");
}).on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error}`);
});

redisClient.subscribe("holberton school channel");

redisClient.on("message", (channel, message) => {
    console.log(message);
    if (message === "KILL_SERVER") {
        redisClient.unsubscribe(channel);
        redisClient.quit();
    }
});