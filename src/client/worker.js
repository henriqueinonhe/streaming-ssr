const serverEventSource = new EventSource("http://localhost:3000/sse");

let sharedArray;

self.onmessage = (e) => {
  sharedArray = new Int8Array(e.data);
};

serverEventSource.onmessage = (e) => {
  const id = e.data;
  const index = Number(id) - 1;

  sharedArray[index] = 1;
};
