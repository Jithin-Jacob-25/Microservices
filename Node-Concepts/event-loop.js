// Event Loop is a core mechanism in NodeJs that will allow us to perform non-blocking I/O operations
// Event Loop goes through follwoing phases:
/*
Timers: This phase executes callbacks scheduled by setTimeout() and setInterval().
Pending Callbacks: This phase executes I/O callbacks deferred to the next loop iteration.
Idle, Prepare: This phase is used internally by Node.js.
Poll: This phase retrieves new I/O events; node will block here when appropriate.
Check: This phase executes callbacks scheduled by setImmediate().
Close Callbacks: This phase executes close event callbacks, e.g. socket.on('close', ...).
Microtasks: This phase executes microtasks, which include process.nextTick() and Promises.
Macrotasks: This phase includes tasks scheduled by setTimeout(), setInterval(), and setImmediate().
*/
/*In short:

The Event Loop is like a robot that:

🔁 Keeps checking what to do next

⚡ Finishes tiny urgent jobs first

⏱ Does timer jobs when time is up

📬 Answers I/O when ready

✅ Runs setImmediate when told

🚪 Cleans up when something closes

And then… starts again!*/

/*🎮 Real-Life Story — “Baking Cookies & Calling Friends” 🍪📱

Imagine you are at home on a Saturday. You’re doing many things at once, but you’re smart like Node.js — you don’t sit around wasting time.

Step 1 — Microtasks (super urgent little things) ⚡

Mom says: “Pick up your socks right now.” (process.nextTick)

You promise your little sister: “As soon as cookies are ready, I’ll shout YAY!” (Promise.then)

👉 These are tiny VIP jobs. You do them before anything else.

Step 2 — Timers ⏱

You put cookies in the oven and set a timer: “Ding after 5 minutes.” (setTimeout)

While waiting, you don’t just stare at the oven — you do other stuff.

Step 3 — Pending Callbacks 📬

The washing machine finished earlier and left a “done” light blinking.

You go press the button to acknowledge it. (I/O callbacks)

Step 4 — Idle / Prepare 🛌

Quick stretch break 😴. Robot brain recharges.

Step 5 — Poll (waiting room) 🎣

You’re waiting for your friend to reply to your text: “Wanna play video games?”

If they reply now → you read and answer.

If not → you wait a bit, but if the oven timer rings, you stop waiting and go handle that.

Step 6 — Check ✅

Mom reminds you: “Call Grandma after checking your messages.” (setImmediate)

You grab the phone and call Grandma.

Step 7 — Close Callbacks 🚪

Done playing with remote-control car? → Close the garage door. (close event callback)

🔄 Then the loop starts again!

You keep checking: urgent tasks → timers → messages → reminders → cleanups…

That’s the Event Loop in real life. 🧑‍🍳📱*/

const fs = require('fs');
const crypto = require('crypto');

console.log('1. Script Start');

setTimeout(() => {
  console.log('2. SetTimeout 0s Callback (macrotask) ');
}, 0);

setTimeout(() => {
  console.log('3. SetTimeout 0s Callback (macrotask) ');
}, 0);

setImmediate(() => {
  console.log('4. SetImmediate Callback (Check phase)');
});

Promise.resolve().then(() => {
  console.log('5. Promise Resolved (microtask)');
});

process.nextTick(() => {
  console.log('6. Process Next Tick callback (microtask)');
});

fs.readFile(__filename, () => {
  console.log('7. File Read Callback (I/O Poll phase)');

//   setTimeout(() => {
//     console.log('8. SetTimeout inside File Read Callback (macrotask)');
//   }, 0);

//   setImmediate(() => {
//     console.log('9. SetImmediate inside File Read Callback (Check phase)');
//   });

//   Promise.resolve().then(() => {
//     console.log('10. Promise inside File Read Callback (microtask)');
//   });

//   process.nextTick(() => {
//     console.log('11. Process Next Tick inside File Read Callback (microtask)');
//   });
});

// Cpu Intensive Operations in step 7 that takes much CPU usage so use crypto module

crypto.pbkdf2('secret', 'salt', 10000, 64, 'sha512', (err, key) => {
    if (err) throw err;
  console.log('8. pbkdf2 operation Completed (CPU INTENSIVE TASK)');
});

console.log('9. Script End');

/*
Step-by-step flow (what Node does)

1. Synchronous setup runs first

    console.log('1. Script Start')

    You schedule two setTimeout(..., 0) (macrotasks for the Timers phase)

    You schedule one setImmediate(...) (macrotask for the Check phase)

    You schedule a Promise.then(...) (a microtask)

    You schedule a process.nextTick(...) (a microtask, higher priority than Promise)

    You start fs.readFile(__filename, …) (I/O handled by libuv → callback will run in Poll phase when ready)

    You start crypto.pbkdf2(...) (CPU-bound work on libuv threadpool → callback also lands in Poll phase when done)

    console.log('9. Script End')

2. Microtasks queue drains immediately (before moving to the next phase)

    process.nextTick(...) runs before Promise callbacks.

    Then Promise.then(...) runs.

3. Next event-loop tick → Timers phase

    Both setTimeout(..., 0) are due → they run (in insertion order).

4. Pending callbacks phase

    (OS-level deferred I/O callbacks, if any—usually nothing here for this code.)

5. Poll phase

    Node checks for completed I/O. If fs.readFile is done, its callback runs.

    If pbkdf2 finished on the threadpool, its callback runs here too.

    (Order between these two depends on which completes first.)

6. Check phase

    setImmediate(...) runs here.

7. Close callbacks phase

    (Not used in this snippet.)
*/