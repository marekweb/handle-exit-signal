const t = require('tap');
const exitSignal = require('.');

t.test(t => {
  t.plan(2);

  let shuttingDown = false;
  function longRunningTimer() {
    if (shuttingDown) {
      //   console.log('timer stopping');
      return;
    }
    // console.log('timer running');
    setTimeout(longRunningTimer, 10);
  }

  longRunningTimer();

  const exitSignalPromise = exitSignal();

  exitSignalPromise.then(signal => {
    // console.log('We got the message:', signal);
    shuttingDown = true;
    t.equal(signal, 'SIGTERM');
    t.equal(process.exitCode, 143);

    // Unset the exit code so that the test isn't considrered a failure.
    process.exitCode = 0;
    t.end();
  });

  process.kill(process.pid, 'SIGTERM');
});
