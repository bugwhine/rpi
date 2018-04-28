const fs = require('fs');
const debug = require('debug')('temperature');

function getTemperature(devicePath, callback) {
  var temperature;

  fs.readFile(devicePath, 'utf8', (err, data) => {
    if (err) callback(err, null);

    debug(data);

    // The file should include a 2-line response as below -
    // 69 01 4b 46 7f ff 0c 10 7d : crc=7d YES
    // 69 01 4b 46 7f ff 0c 10 7d t=22562

    var validRegEx = /YES/;
    if (validRegEx.test(data)) {
      var extractRegEx = /.*t=(\d*)\D/g;
      var match = extractRegEx.exec(data);
      var temperature = Number(match[1])/1000;

      callback(null, temperature);
    }
  });
}

function main() {
  getTemperature('/sys/bus/w1/devices/28-0217c0464bff/w1_slave', function(err, temp) {
    if (err) throw err;
    console.log(new Date() + ': ' + temp);
  });
}

setInterval(main, 5000);
