

const fs = require('fs')
const exec = require('child_process').exec
const ProgressBar = require('./progress-bar');

const myList = require('./classList')

const pb = new ProgressBar('下载进度', 50);

const classList = myList()
const items = classList.data.videos
// console.log(classList)

let commands = []
let classFileName = []
let pattern = /[`*()=|{}':;',\\\[\\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\s]/g
function getClass(items) {
  for (let index = items.length - 1; index >= 0; index--) {
    const element = items[index]
    let classNumber = (index + 1 > 9) ? index + 1 : '0' + (index + 1)
    let fileName = element.name.replace(pattern, '')
    commands.push(`curl --cookie "JSESSIONID=%7B%22persistedTime%22%3A1622731641649%2C%22" "${element.videoUrl}" --output "download/8${classNumber}-${element.name}.mp4" --limit-rate 1024K`)
    // commands.push(`curl --cookie "JSESSIONID=%7B%22persistedTime%22%3A1622731641649%2C%22" "${element.videoUrl}" --output "download/8${classNumber}-${fileName}.mp4"`)
    classFileName.push(`download/8${classNumber}-${fileName}.mp4`)
    // commands.push(`echo ${element.name}`)
  }
  // console.log(commands)
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
function noPromise (cmd) {
  return new Promise(function(resolve, reject) {
    
    // exec(cmd, function(err, stdout) {
    //   if (err) return reject(err);
    //   resolve(stdout);
    // });
  });
}

function isFileExisted(fileName) {
  return new Promise(function(resolve, reject) {
      fs.access('input.txt', (err) => {
          if (err) {
              reject(false);
          } else {
              resolve(true);
          }
      })
  })
}
var num = 0, total = commands.length;

commands.reduce(function (p, cmd, index) {
  // console.log(p, cmd, index, items[index].name);
  let fileName = classFileName[index]
  // let fileStatus = isFileExisted(fileName)
  return p.then(function (results) {
    pb.render({ completed: num, total: total - 1,  name: fileName });
    num++
    // if (fileStatus){
    //   console.log('download')
    //   // return execPromise(cmd).then(function(stdout) {
    //   //   results.push(stdout);
    //   //   return results;
    //   // });
    // }else{
    //   console.log('not download')
    //   // return noPromise(cmd).then(function(stdout) {
    //   //   results.push(stdout);
    //   //   return results;
    //   // });
    // }
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
