const fs = require("fs");
const sleep = require("./sleep");

module.exports = async function waitForDisk(diskPath) {
  console.log("Wait for connected disk...");
  let attempts = 30;
  while (!fs.existsSync(diskPath)) {
    await sleep(1000);
    attempts--;
    if (attempts <= 0) {
      throw new Error(`Disk not found: ${diskPath}`);
    }
  }
}
