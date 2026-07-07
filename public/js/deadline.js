export function getDeadlineTime() {
  // Today at 6:30 PM IST (Asia/Kolkata)
  // 2026-07-07T18:30:00+05:30
  return new Date('2026-07-07T18:30:00+05:30').getTime();
}

export function isClosed() {
  return Date.now() >= getDeadlineTime();
}

export function setupTimer(callback) {
  // Run once immediately
  callback(isClosed());
  // Setup interval to check every second
  const interval = setInterval(() => {
    const closed = isClosed();
    callback(closed);
    if (closed) {
      clearInterval(interval);
    }
  }, 1000);
  return interval;
}
