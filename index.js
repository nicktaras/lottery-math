const csvFilePath = './data.csv';
const csv = require('csvtojson')
let drawsLength = 0;

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    drawsLength = jsonObj.length;
    let output = {};
    jsonObj.map((result) => {
      const keyCheck = ["N1", "N2", "N3", "N4", "N5", "N6", "BN"];
      for (var key in result) {
        if (keyCheck.indexOf(key) > -1) {
          if (!output[result[key]]) {
            output[result[key]] = 1;
          } else {
            output[result[key]]++;
          }
        }
      }
    })
    var arr = [];
    for (var key in output) {
      var chance = (Number(output[key]) / drawsLength * 100) + " %";
      arr.push({ number: key, times: output[key], chance: chance + " chance" });
    }
    keysSorted = arr.sort(function (a, b) { return a.times - b.times })
    console.log('output', {
      drawLength: drawsLength,
      data: keysSorted
    });
  })

// Async / await usage
module.exports = async () => {
  const jsonArray = await csv().fromFile(csvFilePath);
};