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
      const found = playersList.find(player => player.color === message)
      if(found !== undefined){
        found.addScore();
      }
      break;

      case `${TOPIC}/BadAnswer`:
      // Bad ANSWER
      break;
  }
})
}
// WINNER A -> C
// POP-UP QUESTION A -> C
// JOUEUR A REJOINT A -> C

// REPONSE BONNE C -> A
// REPONSE FAUSSE C -> A
// New Game C -> A

function send_winner(winner){
    client.publish(`${TOPIC}/winner`, winner)
}

module.exports = initMqtt

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
  //client.end()
})
}
