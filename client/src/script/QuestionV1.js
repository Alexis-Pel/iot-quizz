import '../css/App.css';
import {pass} from './client'

function questions(question, client) {
  return (
    <div className="App">
      <h1>Quizzoeur</h1>
      <div>
      <div className='Bleu'>
          <div className='IconPlayerBleu'>
            Q
          </div>
          <div className='text-question'>
            {question.question}
          </div>
     </div>
     <div className='Vert mt-5'>
          <div className='IconPlayerVert'>
            P
          </div>
          <div className='text-response'>
            {question.answer}
          </div>
        </div>
      </div>
      <button className='next' onClick={()=>{pass()}}>Suivante !</button>
    </div>


  );
}

export default questions;


