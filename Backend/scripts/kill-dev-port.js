const killPort = require("kill-port");

const port = Number(process.env.PORT) || 5000;

killPort(port)
  .then(() => {
    console.log(`Freed port ${port}`);
  })
  .catch(() => {
    // Port was not in use — safe to continue
  })
  .finally(() => {
    process.exit(0);
  });
