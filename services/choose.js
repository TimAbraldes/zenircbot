var api = require('zenircbot-api');
var zen = new api.ZenIRCBot();

var channels = ['#pdxbots'];

var commands =
  [
    {
      name: "help",
      description: "Gives basic information about using the commands.",
      regex: new RegExp("^!help$"),
      handler: onHelp
    }, {
      name: "choose",
      description: "Chooses between provided options.",
      regex: new RegExp("^!choose"),
      handler: onChoose
    }
  ];

zen.register_commands(
  "misc.js",
  commands
);

var filtered = zen.filter({version: 1, type: 'directed_privmsg'});
filtered.on('data', function(msg) {
  if (channels.indexOf(msg.data.channel) == -1) {
    return;
  }

  commands.forEach(function(aCommand) {
    if (aCommand.regex.test(msg.data.message)) {
      aCommand.handler(msg);
    }
  });
});

function onHelp(aMsg) {
  commands.forEach(function(aCommand) {
    if (aCommand.name != "help") {
      zen.send_privmsg(aMsg.data.channel, aCommand.name + ": " + aCommand.description);
    }
  });
}

function onChoose(aMsg) {
  var choiceStr = aMsg.data.message.slice(8);
  var choices = choiceStr.split(' or ');
  var choice = choices[Math.floor(Math.random() * (choices.length-1))];
  zen.send_privmsg(aMsg.data.channel, choice.trim());
}
