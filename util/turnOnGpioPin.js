const gpio = require('rpi-gpio');
const parameters = process.argv.slice(2);
if (parameters.length === 0) {
  console.error("Please provide a GPIO pin");
  process.exit(1);
}
const pin = parameters[0];

async function main() {
  gpio.setMode(gpio.MODE_BCM);
  await gpio.promise.setup(pin, gpio.DIR_OUT);
  await gpio.promise.write(pin, gpio.DIR_HIGH);
  process.exit(0);
}

main();
