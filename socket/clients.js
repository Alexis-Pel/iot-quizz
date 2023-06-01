const clients = require('mqtt')
const client = clients.connect('mqtt://test.mosquitto.org')
require('dotenv').config()
const TOPIC = process.env.TOPIC;

// SERVER
function initMqtt(getVariable, setVariable) {
  client.on('connect', function () {
  client.subscribe(TOPIC, function (err) {
    if(!err){
      client.publish(TOPIC, 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  let playersList = getVariable()

  // Switch
  switch (message.toString()){
    // New game
    case `${TOPIC}/NewGame`:
      // START A NEW GAME
      break;

    // Good Answer
    case `${TOPIC}/GoodAnswer`:
      const found = playersList.find(player => player.color === message)
      if(found !== undefined){
        found.addScore();
        setVariable(playersList)
      }
      break;

      // Pass the question
      case `${TOPIC}/pass`:
      playersList.forEach(player => player.hasAlreadyAnswer = false);
      setVariable(playersList)
      // Turn Off D0
      break;
  }
})
}
// WINNER A -> C
// POP-UP QUESTION A -> C
// JOUEUR A REJOINT A -> C


function send_winner(winner){
    client.publish(`${TOPIC}/winner`, winner)
}
function pop_up(player, id){
  client.publish(`${TOPIC}/pop_up`, `${player}|${id}`)
}

function player_join(player){
    client.publish(`${TOPIC}/player`, player)
}

module.exports.initMqtt = initMqtt
module.exports.send_winner = send_winner
module.exports.pop_up = pop_up
module.exports.player_join = player_join

/// CLIENT
function clientMQTT() {
  client.on('connect', function () {
  client.subscribe(TOPIC, function (err) {
    if(!err){
      client.publish(TOPIC, 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic, message.toString())
  switch (message.toString()){
    // New game
    case `${TOPIC}/NewGame`:
      // START A NEW GAME
      break;
  }
})
}
