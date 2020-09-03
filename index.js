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

const getDrawsArray = (data) => {
  let outputData = [];
  const keyCheck = ["N1", "N2", "N3", "N4", "N5", "N6", "BN"];
  data.map((r) => {
    var res = [];
    for (var k in r) {
      if (keyCheck.indexOf(k) > -1) {
        res.push(r[k]);
      }
    }
    outputData.push(res);
  })
  return outputData;
}

// All Combinations for one draw Pairs
// for (var i = 0; i <= 6; i++) {
//   for (var j = 0; j <= 6; j++) {
//     if (i < j) {
//       console.log(i + '-' + j);
//       var x = [mock[0][j], mock[0][i]].sort().toString();
//       if (!output[x]) output[x] = 1;
//       else { output[x]++; };
//     }
//   }
// }

const commonPairs = (draws) => {
  // Input:
  var output = {};
  // output all combinations found each draw
  console.log(draws.length);
  for (var z = 0; z < draws.length; z++) {
    var draw = draws[z];
    for (var i = 0; i <= 6; i++) {
      for (var j = 0; j <= 6; j++) {
        if (i < j) {
          var x = [draw[j], draw[i]].sort().toString();
          if (!output[x]) output[x] = 1;
          else { output[x]++; };
        }
      }
    }
  }
  return output;
}

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    // Get the length of draws
    const drawLength = jsonObj.length;
    // Simple Strategy
    const output = getMostDrawnKeyValueObject(jsonObj);
    var arr = [];
    // Output: { number: n, times: n, chance: n + " chance" }
    for (var key in output) {
      var chance = (Number(output[key]) / drawLength * 100) + " %";
      arr.push({ number: key, times: output[key], chance: chance + " chance" });
    }
    // Sort the array - low to high
    var orderedOutput = arr.sort(function (a, b) { return a.times - b.times });
    // Highest odd strategy - Select the top 6 results
    var highestOdds = orderedOutput.slice(Math.max(arr.length - 6, 0));
    // Low mid high strategy - Select 2 lowest, 2 Mid, 2 Highest Odds strategy
    var lowMidHigh = [
      orderedOutput[0],
      orderedOutput[1],
      orderedOutput[Math.round(orderedOutput.length / 2) - 1],
      orderedOutput[Math.round(orderedOutput.length / 2)],
      orderedOutput[orderedOutput.length - 2],
      orderedOutput[orderedOutput.length - 1],
    ]
    // Get all Draws Key Values
    var draws = getDrawsArray(jsonObj);
    // 3 of the most drawn numbers and 3 of the most likely pairs strategy
    var ThreeMostCommonPairs = commonPairs(draws); //.slice(Math.max(arr.length - 6, 0));
    var arr3 = [];
    // Output: { number: n, times: n, chance: n + " chance" }
    for (var key in ThreeMostCommonPairs) {
      var chance = (Number(ThreeMostCommonPairs[key]) / drawLength * 100) + " %";
      arr3.push({ number: key, times: ThreeMostCommonPairs[key], chance: chance + " chance" });
    }
    // Sort the array - low to high
    var orderedOutput3 = arr3.sort(function (a, b) { return a.times - b.times });
    // Highest odd strategy - Select the top 6 results
    var highestOdds3 = orderedOutput3.slice(Math.max(arr3.length - 6, 0));
    // output
    var out = {
      drawLength,
      highestOdds,
      lowMidHigh,
      // ThreeMostCommonPairs
      highestOdds3
    };
    console.log(out);
  })

module.exports = async () => {
  await csv().fromFile(csvFilePath);
};