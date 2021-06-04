let myList = require('./classList')
var exec = require('child_process').exec
var ProgressBar = require('./progress-bar');
var pb = new ProgressBar('下载进度', 50);

let classList = myList()
let items = classList.data.videos
// console.log(classList)

let commands = []

function getClass(items) {
  for (let index = 0; index < items.length; index++) {
    const element = items[index]
    let classNumber = (index + 1 > 9) ? index + 1 : '0' + (index + 1)
    commands.push(`curl --cookie "JSESSIONID=%7B%22persistedTime%22%3A1622731641649%2C%22" "${element.videoUrl}" --output "download/8${classNumber}-${element.name}.mp4" --limit-rate 1024K`)
    // commands.push(`echo ${element.name}`)
  }
  console.log(commands)
}

getClass(items)

function execPromise (cmd) {
  return new Promise(function(resolve, reject) {
    exec(cmd, function(err, stdout) {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}
var num = 0, total = commands.length;
commands.reduce(function (p, cmd, index) {
  console.log(p, cmd, index, items[index].name);
  let fileName = items[index].name
  return p.then(function (results) {
    pb.render({ completed: num, total: total - 1,  name: fileName });
    num++
    return execPromise(cmd).then(function(stdout) {
      results.push(stdout);
      return results;
    });
  });
}, Promise.resolve([])).then(function(results) {
  // all done here, all results in the results array
}, function(err) {
  // error here
})
