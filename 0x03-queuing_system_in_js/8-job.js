const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach(job_data => {
    const jo = queue.create('push_notification_code_3', job_data);

    jo.on('enqueue', () => {
      console.log(`Notification job created: ${jo.id}`);
    });

    jo.on('complete', () => {
      console.log(`Notification job ${jo.id} completed`);
    });

    jo.on('failed', (errorMessage) => {
      console.log(`Notification job ${jo.id} failed: ${errorMessage}`);
    });

    jo.on('progress', (progress, _data) => {
      console.log(`Notification job ${jo.id} ${progress}% complete`);
    });

    jo.save();
  });
};