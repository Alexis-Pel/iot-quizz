var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
const functions = require("./clients");
var C = xbee_api.constants;
//var storage = require("./storage")
require('dotenv').config()
functions.initMqtt(getVariable, setVariable,resetAll,turnOfAllD0)



let playersWhoBuzzed = []
class Player {

  remote64;
  hasAlreadyAnswer = false
  score = 0;
  color;

  constructor(remote64,color){
      this.remote64 = remote64;
      this.color = color;
  }

  addScore(){
    let diode = ""
    
      this.score++
      for(let i = 1; i<= this.score;i++){
        diode = `D${i}`
        let frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: this.remote64,
          command: diode,
          commandParameter: [5],
        };
        if(this.score === 3){
          functions.send_winner(this.color);
        }

        xbeeAPI.builder.write(frame_obj);
      }
    
  }

}
const SERIAL_PORT = process.env.SERIAL_PORT;
let playersList = []
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {
  resetAll();
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

});

// All frames parsed by the XBee will be emitted here

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))

//var ledOn = false;
xbeeAPI.parser.on("data", function (frame) {

  //on new device is joined, register it

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);

  }

  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    // let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
    
    let newPlayer = new Player(frame.remote64,frame.nodeIdentifier)
    playersList.push(newPlayer);
    console.log("NODE_IDENTIFICATION");
    functions.player_join(frame.nodeIdentifier);
    //playersList[0].addScore();
    //storage.registerSensor(frame.remote64)

  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    console.log("ZIGBEE_IO_DATA_SAMPLE_RX")
      
      //console.log( typeof playersList[0].remote64)
      if(frame.digitalSamples.DIO4 === 0){
        
        let playerWhoBuzzed = playersList.filter((player)=>
        player.remote64 === frame.remote64
      )
      if(!playerWhoBuzzed[0].hasAlreadyAnswer){
        playersWhoBuzzed.push(playerWhoBuzzed[0]);
      }
      if(playersWhoBuzzed[0]){
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: playersWhoBuzzed[0].remote64,
          command: "D0",
          commandParameter: [5],
        };
        xbeeAPI.builder.write(frame_obj);
        playersWhoBuzzed[0].hasAlreadyAnswer = true;
        functions.pop_up(playersWhoBuzzed[0].color, playersWhoBuzzed[0].remote64)
        playersWhoBuzzed = [];
      }
    }

  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    if(frame.command === "NI"){
      let newPlayer = new Player(frame.remote64,dataReceived)
      playersList.push(newPlayer);
      functions.player_join(newPlayer.color)
    }
   
    
    console.log("REMOTE_COMMAND_RESPONSE", dataReceived);
  } else {

    console.debug(frame);

    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    
  }

});

function turnOfAllD0(){
  console.log("ui")
  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: 'FFFFFFFFFFFFFFFF',
    command: "D0",
    commandParameter: [4],
  };
  xbeeAPI.builder.write(frame_obj);
  newQuestion();
}

function getVariable(){
  return playersList
}

function setVariable(variable){
  playersList = variable
}

function goodAnswer(player){
  console.log(player)
  player.addScore();
}

function newQuestion(){
  
  for(let i = 0; i <= playersList.length-1; i++){
    playersList[i].hasAlreadyAnswer = false;
  }
}

function resetAll(){
  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: 'FFFFFFFFFFFFFFFF',
    command: "D0",
    commandParameter: [4],
  };
  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: 'FFFFFFFFFFFFFFFF',
    command: "D1",
    commandParameter: [4],
  };
  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: 'FFFFFFFFFFFFFFFF',
    command: "D2",
    commandParameter: [4],
  };
  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: 'FFFFFFFFFFFFFFFF',
    command: "D3",
    commandParameter: [4],
  };
  xbeeAPI.builder.write(frame_obj);

  for(let i = 0; i <= playersList.length-1; i++){
    playersList[i].Score = 0;
  }
  
}