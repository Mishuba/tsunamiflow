const queue = [];

onmessage = (e) => {
    queue.push(e.data);
    processQueue();
};

function processQueue() {
    if (queue.length === 0) return;

    const task = queue.shift();

    // route task
    postMessage({ status: "done", task });
}