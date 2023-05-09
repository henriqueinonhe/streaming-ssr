const clientSharedBuffer = new SharedArrayBuffer(6);

window.clientSharedArray = new Int8Array(clientSharedBuffer);

const worker = new Worker("./client/worker.js");
worker.postMessage(clientSharedBuffer);
