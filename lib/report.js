var npm = require('npm');
var request = require('superagent');
var util = require('util');
var _ = require('lodash');
var semver = require('semver');

var DEFAULT_OPTIONS = {
  depth: 0,
  renderHTML: renderHTML,
  from: 'npm outdated',
  color: 'yellow',
  ignorePreReleases: true,
  ignoredModules: []
};


/**
 * Goes through the list and returns a nicer object and removes ignored stuff
 * @param list the raw list returned by npm outdated
 * @param options the an options object. It can have the ignoredModules and ignorePreReleases properties
 */
function convertOutdatedList(list, options) {
  var out = {};
  list.forEach(function (p) {
    var ignoredModule = _.contains(options.ignoredModules, p[1]);
    var shouldIgnorePreRelease = options.ignorePreReleases && semver.parse(p[4]).prerelease.length !== 0;

    if (!shouldIgnorePreRelease && !ignoredModule) {
      out[p[1]] = { current: p[2], wanted: p[3], latest: p[4]
      }
    }
  });
  return out;
}

/**
 * Renders the html message to be sent to hipchat
 * @param outdated The info from npm outdated. An array of objects on the form of:
 * [
 *   {
 *     current: the current version installed
 *     wanted: the version wanted by package.json
 *     latest: the latest version on the registry
 *   }
 * ]
 * @param project The name of the project
 * @returns {string} a html-formatted string
 */
function renderHTML(outdated, project) {
  var html = "<p><strong>" + project + "</strong></p><br/>";
  Object.keys(outdated).forEach(function (moduleName) {
    var moduleInfo = outdated[moduleName];
    html += util.format(
        '<p><a href="https://www.npmjs.org/package/%s/">%s</a> (%s -> <strong>%s</strong>) </p><br/>',
        moduleName, moduleName, moduleInfo.current, moduleInfo.latest
    );
  });

  return html;
}

function report(options, callback) {
  if (!options) {
    throw new Error('No options specified');
  }

  options = _.merge(DEFAULT_OPTIONS, options);

  npm.load({
    depth: options.depth,
    json: true
  }, function () {
    npm.outdated(function (err, res) {
      if (!res || !res.length) {
        if (callback) {
          callback(null);
        }
        return;
      }

      var outdated = convertOutdatedList(res, options);
      if (!_.isEmpty(outdated)) {
        var url = util.format('https://api.hipchat.com/v1/rooms/message?auth_token=%s&format=json', options.token);
        var sendData = {
          room_id: options.roomId,
          from: options.from,
          color: options.color,
          message: options.renderHTML(outdated, options.project)
        };
        request
          .post(url)
          .send(sendData)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .end(function (err, res) {
            if (callback) {
              callback(err);
            }
          });
      }
    });

  });
}

module.exports = report;