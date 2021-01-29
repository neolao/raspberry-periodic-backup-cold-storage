const { execSync } = require("child_process");

module.exports = async function mountDisk(diskPath, mountPath, keyFiles) {
  console.log("Mount the disk");
  execSync(`veracrypt --protect-hidden=no --pim=0 --password="" -k ${keyFiles.join(",")} ${diskPath} ${mountPath}`);
}
