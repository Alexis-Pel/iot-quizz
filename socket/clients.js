const clients = require('mqtt')
const client = clients.connect('mqtt://test.mosquitto.org')
require('dotenv').config()
const TOPIC = process.env.TOPIC;
import {playersList} from './server'

// SERVER
function initMqtt() {
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

  // Switch
  switch (message.toString()){
    // New game
    case `${TOPIC}/NewGame`:
      // START A NEW GAME
      break;

    // Good Answer
    case `${TOPIC}/GoodAnswer`:
      // TEST IF IT AFFECT THE OG ARRAY
      const found = playersList.find(player => player.color === message)
      if(found !== undefined){
        found.addScore();
      }
      break;

      // Pass the question
      case `${TOPIC}/pass`:
      // reset the hasAlreadyAnswered
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
