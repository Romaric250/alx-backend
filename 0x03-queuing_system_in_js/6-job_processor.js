#!/usr/bin/env node
import { createQueue } from 'kue';

const queue = createQueue();

const sendNotification = (phoneNumber, message) => {
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
};

queue.process('push_notification_code', (job, done) => {
const { phoneNumber, message } = job.data;
sendNotification(phoneNumber, message);
done();
});

export default queue;