//import {useEffect, useState} from 'react';
import React, {Component, useEffect} from "react";
import {useState} from "react";
import mqtt from "precompiled-mqtt";
import {createRoot, render} from "react-dom";
import questions from "./QuestionV1";
import getQuestions from './questions'
import End from "./end";
//dotenv.config();
const TOPIC = "3c063038e425";
const client = mqtt.connect("mqtt://test.mosquitto.org:8080");


// Créer une instance MQTT et se connecter au broker MQTT
// Gérer les événements de connexion et d'erreur
client.on("connect", () => {
  // Souscrire à des sujets MQTT
  client.subscribe(`${TOPIC}/+`);
  //client.publish(`${TOPIC}/pop_up`, 'VERT|aa');
});

client.on("error", (error) => {
  console.log("Erreur de connexion MQTT :", error);
});

let listNames = []
const questions_json = getQuestions()
let message_cache = null
const root = createRoot(
  document.getElementById('root')
);

  let index = 1

function MQTTComponent() {
  let [list, setList] = useState([])
  let [game, setGame] = useState(false)

  useEffect(() => {
    // Gérer les messages MQTT entrants
    client.on("message", (topic, message) => {
      if (message_cache !== topic + message) {
        message_cache = topic + message
        console.log("Message MQTT reçu :", topic, message.toString());
        // Traitez le message MQTT reçu ici
        switch (topic) {
          // Player joined
          case `${TOPIC}/player`:
            if (!game) {
              let b = <li>
                <div className="Bleu">
                  <div className="IconPlayerBleu">P</div>
                  <div className="NamePlayer">Nouveau Joueur</div>
                  <div className="style-bullet">•</div>
                  <div className="ColorPlayer">{message.toString()}</div>
                </div>
              </li>

              const found = listNames.filter(value => value === message.toString())
              if (found.length === 0) {
                listNames.push(message.toString())
                list.push(b)
                setList([...list])
              }
            }
            break;

          // Pop Up
          case `${TOPIC}/pop_up`:
            const message_array = message.toString().split("|");
            const player = message_array[0];
            const id = message_array[1];
            console.log(
              "SHOW POP UP SCREEN FOR PLAYER: " + player + " WITH ID: " + id
            );
            root.render(pop_ip_ui(player, id))
            break;

          case `${TOPIC}/winner`:
            root.render(End(message.toString()))
            break;

          default:
            //console.log('')
            break;
        }
      }
      return () => {
        client.unsubscribe(topic, error => {
          if (error) {
            console.log('Unsubscribe error', error)
          }
        });
      }
    });

  }, [])

  if (game === false) {
    return lobby(list, setGame)
  } else {
    return game_page(index)
  }
}

function lobby(list, setGame) {
  return (<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
    <h1>Quizzoeur</h1>
    <div style={{height: '400px', overflowY: 'scroll',}}>
      {list}
    </div>
    <button onClick={() => {
      new_game();
      setGame(true)
    }}>Lancer le Quizzoeur !
    </button>
    <div id="test"></div>
  </div>)
}

function game_page(index, setGame) {
    let question = questions_json[`${index}`]
  if(question !== undefined){
      return (questions(question))
  }
  else{
    return <div><h1 className="noQ">Egalité</h1><button className='next' onClick={()=>{window.location.reload()}}>Menu</button></div>
  }
}

function pop_ip_ui(playerName, id) {
  return (<div className="flou">
    <div style={{
      width: "390px",
      height: "308px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: "#000000",
      borderRadius: "20px",
      justifyContent: 'space-around',
    }}>
      <div className="playerName"><p>{playerName} a buzzé</p></div>
      <div style={{width: '90%', display: 'flex', justifyContent: 'space-between'}}>
        <div className="wrong" onClick={() => {
          root.render(game_page(index))
        }}>
          <div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="7" fill="white"/>
              <path
                d="M25.3334 8.54663L23.4534 6.66663L16 14.12L8.54669 6.66663L6.66669 8.54663L14.12 16L6.66669 23.4533L8.54669 25.3333L16 17.88L23.4534 25.3333L25.3334 23.4533L17.88 16L25.3334 8.54663Z"
                fill="#CA1301"/>
            </svg>
          </div>
          <div id='incorrect_text'><p>Incorrect</p></div>
        </div>
        <div className="right" onClick={() => {
          goodAnswer(id)
          index += 1
          root.render(game_page(index))
        }}>
          <div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="9" fill="white"/>
              <path d="M12 21.56L6.43996 16L4.54663 17.88L12 25.3334L28 9.33337L26.12 7.45337L12 21.56Z"
                    fill="#43C901"/>
            </svg>
          </div>
          <div id="correct_text"><p>Correct</p></div>
        </div>
      </div>
    </div>
  </div>)
}

function new_game() {
  client.publish(`${TOPIC}/newGame`, 'new Game')
}

function goodAnswer(id) {
  client.publish(`${TOPIC}/GoodAnswer`, id)
}

export function pass() {
  client.publish(`${TOPIC}/pass`, 'PASS')
  index += 1
  root.render(game_page(index))
}

export default MQTTComponent;

// const clients = require('mqtt')

// require('dotenv').config()

// function MQTT() {
//     const [client, setClient] = useState(null);
//     setClient(clients.connect('mqtt://test.mosquitto.org'));
//     useEffect(() => {
//         if (client) {
//           console.log(client)
//           client.on('connect', () => {
//             console.log('CONNECTED')
//             //setConnectStatus('Connected');
//           });
//           client.on('error', (err) => {
//             console.error('Connection error: ', err);
//             client.end();
//           });
//           client.on('message', (topic, message) => {
//             //const payload = { topic, message: message.toString() };
//             //setPayload(payload);
//             switch (topic){
//                 // Player joined
//                 case `${TOPIC}/player`:
//                   console.log(`${message.toString()} joined`)
//                   break;

//                   // Pop Up
//                 case `${TOPIC}/pop_up`:
//                   const message_array = message.toString().split('|')
//                   const player = message_array[0]
//                   const id = message_array[1]
//                   console.log('SHOW POP UP SCREEN FOR PLAYER: ' + player + ' WITH ID: ' + id)
//                   break;

//                 case `${TOPIC}/winner`:
//                   console.log('WINNER IS PLAYER: ' + message.toString())
//               }
//           });
//         }
//       }, [client]);
// }

//   const mqttSub = (subscription) => {
//     if (client) {
//       const { topic, qos } = subscription;
//       client.subscribe(topic, { qos }, (error) => {
//         if (error) {
//           console.log('Subscribe to topics error', error)
//           return
//         }
//         setIsSub(true)
//       });
//     }
//   };

//   const mqttUnSub = (subscription) => {
//     if (client) {
//       const { topic } = subscription;
//       client.unsubscribe(topic, error => {
//         if (error) {
//           console.log('Unsubscribe error', error)
//           return
//         }
//         setIsSub(false);
//       });
//     }
//   };

//   const mqttPublish = (context) => {
//     if (client) {
//       const { topic, qos, payload } = context;
//       client.publish(topic, payload, { qos }, error => {
//         if (error) {
//           console.log('Publish error: ', error);
//         }
//       });
//     }
//   }

//   const mqttDisconnect = () => {
//     if (client) {
//       client.end(() => {
//         setConnectStatus('Connect');
//       });
//     }
//   }

/// CLIENT
// function clientMQTT() {
//     client.on('connect', function () {
//     client.subscribe(`${TOPIC}/+`, function (err) {
//       if(!err){
//         client.publish(TOPIC, 'Hello mqtt')
//       }
//     })
//   })

//   client.on('message', function (topic, message) {
//     // SWITCH
//     switch (topic){
//         // Player joined
//         case `${TOPIC}/player`:
//           console.log(`${message.toString()} joined`)
//           break;

//           // Pop Up
//         case `${TOPIC}/pop_up`:
//           const message_array = message.toString().split('|')
//           const player = message_array[0]
//           const id = message_array[1]
//           console.log('SHOW POP UP SCREEN FOR PLAYER: ' + player + ' WITH ID: ' + id)
//           break;

//         case `${TOPIC}/winner`:
//           console.log('WINNER IS PLAYER: ' + message.toString())
//       }
//   })
//   }

