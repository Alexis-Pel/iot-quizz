const clients = require('mqtt')
const {messaging} = require("firebase-admin");
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
  switch (topic){
    // New game
    case `${TOPIC}/NewGame`:
      // START A NEW GAME
      break;

    // Good Answer
    case `${TOPIC}/GoodAnswer`:
      const found = playersList.find(player => player.remote64 === message.toString())
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
  // SWITCH
  switch (topic){
    // Player joined
    case `${TOPIC}/player`:
      console.log(`${message.toString()} joined`)
      break;

      // Pop Up
    case `${TOPIC}/pop_up`:
      const message_array = message.toString().split('|')
      const player = message_array[0]
      const id = message_array[1]
      console.log('SHOW POP UP SCREEN FOR PLAYER: ' + player + ' WITH ID: ' + id)
      break;

    case `${TOPIC}/winner`:
      console.log('WINNER IS PLAYER: ' + message.toString())
  }
})
}

function new_game(){
    client.publish(`${TOPIC}/newGame`, 'new Game')
}

function goodAnswer(id){
  client.publish(`${TOPIC}/GoodAnswer`, id)
}

function pass(){
    client.publish(`${TOPIC}/pass`, 'PASS')
}
