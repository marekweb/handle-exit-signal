# exit-signal

Listen to exit signals, providing an opportunity to exit gracefully when the
process is being signalled to shut down.

This module attaches listeners to `SIGINT` and `SIGTERM`. Normally when  no
listeners are attached, these events  make the process exit immediately. This
behavior changes when listeners are attached: the process will no longer exit,
but instead the exit signal promise allows the process to do its own cleanup
and shut itself down.

`exit-signal` creates a promise which resolves as soon as an exit signal is
received. You can attach a `then` handle to this promise at any point in the
lifetime of the process, even after the an exit signal is received, and the
handler will be called.

The advantage of using a promise instead of a plain event handler is that your
handlers won't miss an exit signal that happened before they were attached.

## Installation

```
npm i handle-exit-signal
```

## Usage

```js
const handleExitSignal = require('handle-exit-signal');

const exitSignalPromise = handleExitSignal();

const server = app.listen(4000, () => {

  console.log('Server listening on port 4000');

  exitSignalPromise.then(() => {
    console.log('Server stopping listening');
    server.close();
  });
});
```

