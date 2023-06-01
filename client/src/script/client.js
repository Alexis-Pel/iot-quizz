//import {useEffect, useState} from 'react';
import React, { Component } from 'react';
import mqtt from 'mqtt';
const TOPIC = process.env.TOPIC;


class MQTTComponent extends Component {
    client;
  componentDidMount() {
    // Créer une instance MQTT et se connecter au broker MQTT
    this.client = mqtt.connect('mqtt://test.mosquitto.org');

    // Gérer les événements de connexion et d'erreur
    this.client.on('connect', () => {
      console.log('Connecté au broker MQTT');
      // Souscrire à des sujets MQTT
      this.client.subscribe(`${TOPIC}/+`);

    });

    this.client.on('error', (error) => {
      console.log('Erreur de connexion MQTT :', error);
    });

    // Gérer les messages MQTT entrants
    this.client.on('message', (topic, message) => {
      console.log('Message MQTT reçu :', topic, message.toString());
      // Traitez le message MQTT reçu ici
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
    });
  }

  componentWillUnmount() {
    // Déconnectez-vous du broker MQTT lors de la suppression du composant
    if (this.client) {
      this.client.end();
    }
  }

  render() {
    return (
      <div>
              <h1>Quizzoeur</h1>
      <div>
        <div className='Bleu'>
          <div className='IconPlayerBleu'>
            P
          </div>
          <div className='NamePlayer'>
            Nouveau Joueur
          </div>
          <div className='style-bullet'>
            •
          </div>
          <div className='ColorPlayer'>
            Bleu
          </div>
        </div> 


        <div className='Vert'>
          <div className='IconPlayerVert'>
            P
          </div>
          <div className='NamePlayer'>
            Nouveau Joueur
          </div>
          <div className='style-bullet'>
            •
          </div>
          <div className='ColorPlayer'>
            Vert
          </div>
        </div>


        <div className='Jaune'>
          <div className='IconPlayerJaune'>
            P
          </div>
          <div className='NamePlayer'>
            Nouveau Joueur
          </div>
          <div className='style-bullet'>
            •
          </div>
          <div className='ColorPlayer'>
            Jaune
          </div>
        </div>
      </div>
      <button>Lancer le Quizzoeur !</button>
      </div>
    );
  }
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
  
//   function new_game(){
//       client.publish(`${TOPIC}/newGame`, 'new Game')
//   }
  
//   function goodAnswer(id){
//     client.publish(`${TOPIC}/GoodAnswer`, id)
//   }
  
//   function pass(){
//       client.publish(`${TOPIC}/pass`, 'PASS')
//   }