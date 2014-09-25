npm-outdated-hipchat
====================

A small utility to report the result of npm outdated to a hipchat room. If you want your CI server to report what module dependencies are outdated to HipChat this tool is for you.


# Usage 

You can use this on the command line. All you have to do is run the following from your project's directory
```
npm install npm-outdated-hipchat
node_modules/.bin/npm-outdated-hipchat --project your_project_name --token your_hipchat_token --roomId your_hipchat_room_id
```

And you will get a message in your hipchat room like the following:
```
your_project_name
express (3.5.0 -> 4.9.4)
```
If you have a dependency to epxress set at 3.5.0 and 4.94 is available.

## Options

You can specify some options on the command-line:

* project
  *  *Required*. You need to specify the name of your project
* token
  *  *Required*. The API token you've got from HipChat.
* roomId
  *  *Required*. The ID of your Hipchat room
* color
  *  The color the message will get in HipChat. default value: 'yellow'
* from
  *  The name of the sender. default value: 'npm outdated'
*  depth
  *  Max depth for checking dependency tree. See the documentation for [npm outdated](https://www.npmjs.org/doc/cli/npm-outdated.html). default value: 0
* ignorePreReleases
  *  If the latest version is a pre-release, it is ignored. default value: true
* ignoredModules
  *  A comma-separated list of modules to ignore from the check