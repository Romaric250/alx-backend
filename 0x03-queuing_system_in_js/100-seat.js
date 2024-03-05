import express from 'express';
import { promisify } from 'util';
import redis from 'redis';
import kue from 'kue';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

let reservationEnabled = true;

const reserveSeat = async (number) => {
  await setAsync('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  const seats = await getAsync('available_seats');
  return seats;
};

const queue = kue.createQueue();

const app = express();
const port = 1245;

app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
  } else {
    const job = queue.create('reserve_seat', {}).save((err) => {
      if (err) {
        res.json({ status: 'Reservation failed' });
      } else {
        res.json({ status: 'Reservation in process' });
      }
    });

    job.on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    }).on('failed', (errorMessage) => {
      console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
    });
  }
});

app.get('/process', (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    let seats = await getCurrentAvailableSeats();
    seats--;
    if (seats >= 0) {
      await reserveSeat(seats);
      if (seats === 0) {
        reservationEnabled = false;
      }
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
  res.json({ status: 'Queue processing' });
});

app.listen(port, async () => {
  console.log(`Server running at: http://localhost:${port}/`);
  await reserveSeat(50);
});