import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job';
import { expect } from 'chai';

describe('createPushNotificationsJobs', () => {
  let notificationQueue;

  before(() => {
    notificationQueue = createQueue({ name: 'push_notification_code_test' });
    notificationQueue.testMode.enter();
  });

  after(() => {
    notificationQueue.testMode.exit();
    notificationQueue.shutdown(1000, error => {
      if (error) {
        console.error('Error shutting down Kue queue:', error);
      } else {
        console.log('Kue queue shut down successfully');
      }
    });
  });

  afterEach(() => {
    
    notificationQueue.testMode.clear();
  });

  it('creates a job for each input object', () => {
    const jobData = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
      {
        phoneNumber: '4153518743',
        message: 'This is the code 4321 to verify your account',
      },
      {
        phoneNumber: '4153538781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobData, notificationQueue);

    notificationQueue.on('job complete', (id, data) => {
      notificationQueue.testMode.jobs((err, jobs) => {
        if (err) throw err;

          expect(jobs.length).to.be.equal(4);
          
        jobs.forEach(job => {
          expect(job.type).to.be.equal('push_notification_code_3');
          expect(job.data.phoneNumber).to.be.defined;
          expect(job.data.message).to.be.defined;
        });
      });
    });
  });

  it('throws an error if jobs is not an array', () => {
    expect(() => {
      createPushNotificationsJobs({}, notificationQueue);
    }).to.throw('Jobs is not an array');
  });
});
