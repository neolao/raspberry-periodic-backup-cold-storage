const { execSync } = require("child_process");

module.exports = function unmountDisk(diskPath) {
  console.log("Unmount the disk");
  execSync(`veracrypt --dismount ${diskPath}`, { stdio: [null, null, null] });
}
