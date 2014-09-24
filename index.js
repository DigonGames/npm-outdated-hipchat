var argv = require('minimist')(process.argv.slice(2));
var report = require('./lib/report');

function run() {
  var project = argv.project;
  var token = argv.token;
  var roomId = argv.roomId;
  if (!project) {
    console.error('No project specified. Please specify it with --project');
    process.exit(-1);
  }

  if (!token) {
    console.error('No HipChat API token specified. Please specify it with --token');
    process.exit(-1);
  }

  if (!roomId) {
    console.error('No Room ID specified. Please specify it with --roomId');
    process.exit(-1);
  }

  report(argv, function (err) {
    if (err) {
      console.error('Failed sending info');
      console.error(err);
      process.exit(-1);
    }

    process.exit(0);
  });
}

if (require.main === module) { // being run by node
  run();
}
else { //being required
  module.exports = report;
}