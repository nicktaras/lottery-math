const csvFilePath = './data.csv';
const csv = require('csvtojson')

/*
 output example { '41': 160, '23': 205, }
*/
const getMostDrawnKeyValueObject = (data) => {
  let outputData = {};
  const keyCheck = ["N1", "N2", "N3", "N4", "N5", "N6", "BN"];
  data.map((r) => {
    for (var k in r) {
      if (keyCheck.indexOf(k) > -1) {
        if (!outputData[r[k]]) outputData[r[k]] = 1;
        else outputData[r[k]]++;
      }
    }
  })
  return outputData;
}

const commonPairs = (data, jsonObj) => {
  var array = data;
  // ALL PAIRS
  var pairs = array.flatMap(
    (v, i) => array.slice(i + 1).map(w => [v.number, w.number])
  );
  // DRAWS
  const keyCheck = ["N1", "N2", "N3", "N4", "N5", "N6", "BN"];
  let draws = [];
  data.map((r) => {
    for (var k in r) {
      if (keyCheck.indexOf(k) > -1) {
        draws.push(outputData[r[k]])
      }
    }
  })
  // pairs
  // DRAW...
  return pairs;
}

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    const drawLength = jsonObj.length;
    const output = getMostDrawnKeyValueObject(jsonObj);
    var arr = [];
    for (var key in output) {
      var chance = (Number(output[key]) / drawLength * 100) + " %";
      arr.push({ number: key, times: output[key], chance: chance + " chance" });
    }
    var orderedOutput = arr.sort(function (a, b) { return a.times - b.times });
    // Highest odd strategy
    var highestOdds = orderedOutput.slice(Math.max(arr.length - 6, 0));
    // 2 lowest, 2 Mid, 2 Highest Odds strategy
    var lowMidHigh = [
      orderedOutput[0],
      orderedOutput[1],
      orderedOutput[Math.round(orderedOutput.length / 2) - 1],
      orderedOutput[Math.round(orderedOutput.length / 2)],
      orderedOutput[orderedOutput.length - 2],
      orderedOutput[orderedOutput.length - 1],
    ]
    // 3 of the most drawn numbers and 3 of the most likely pairs strategy
    //
    // Three Common Pairs strategy (127 combinations)
    // [20, 40, 10, 12, 15, 21, 29];
    // [20, 41, 10, 12, 15, 21, 41];
    // 20-40, 20-10, 20-12, 20-15, 20-21, 20-29 //
    // 40-10, 40-12, 40-15, 40-21, 40-29 //
    // 10-12, 10-15, 10-21, 10-29 //
    // 12-15, 12-21, 12-29 //
    // 15-21, 15-29 //
    // 21-29 //
    var ThreeMostCommonPairs = commonPairs(orderedOutput, jsonObj);
    // ...
    // output
    var out = {
      drawLength,
      highestOdds,
      lowMidHigh,
      ThreeMostCommonPairs
    };
    console.log(out);
  })

module.exports = async () => {
  await csv().fromFile(csvFilePath);
};