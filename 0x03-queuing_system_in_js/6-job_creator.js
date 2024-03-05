#!/usr/bin/env node

import { createQueue } from "kue"

const queue = createQueue({ name: 'push_notification_code' });
const data = {
    phoneNumber: '4153518780',
    message: 'veryfying my account'
}

const job = queue.create('push_notification_code', data).save((error) => {
    if (!error) console.log(`Notification job created: ${job.id}`);
});

job
.on('complete', () => console.log('Notification job completed'));

job.on('enqueue', () => {
    console.log(`Notification job created: ${job.id}`);
})

job.on('failed', () => console.log('Notification job failed'));

job.save((error) => {
    if (!error) console.log(`Error creating job: ${job.id}`);
});