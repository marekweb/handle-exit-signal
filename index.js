let exitSignalPromise;
let resolveExitSignal;

module.exports = function waitForExitSignal(timeout) {
  function receiveExitSignal(signalName, signalCode) {
    if (signalCode !== undefined) {
      process.exitCode = 128 + signalCode;
    }
    resolveExitSignal(signalName);
  }

  if (!exitSignalPromise) {
    exitSignalPromise = new Promise((resolve, reject) => {
      resolveExitSignal = resolve;

      process.on('SIGINT', () => {
        receiveExitSignal('SIGINT', 2);
      });

      process.on('SIGTERM', () => {
        receiveExitSignal('SIGTERM', 15);
      });
    });

    exitSignalPromise.exit = receiveExitSignal;
  }

  // Stop waiting after a delay and force the termination of the process.
  // This is equivalent to having another process send SIGKILL after a delay.
  if (timeout) {
    setTimeout(function() {
      process.exit();
    }, timeout).unref();
  }

  return exitSignalPromise;
};
