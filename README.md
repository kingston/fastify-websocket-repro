Fastify Websocket Close Failure Repro
===

This repository contains reproduction instructions for an issue
with Fastify websockets where closing the Fastify instance
does not trigger the preClose or close events and causes
the server to hang indefinitely.

The root cause appears to be having a live websocket connection
to a secondary binding which causes the close hooks to pause
indefinitely while the connection is live. This causes
the shutdown process to timeout and fail.

Reproduction
===

1) Run `node index.js`
2) Open `index.html`
3) Ctrl-C the node process

Expected: Fastify shuts down cleanly
Observed: Fastify hangs and has to force a shutdown through process.exit(1)

