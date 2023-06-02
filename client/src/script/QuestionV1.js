import '../css/App.css';

function QuestionV1() {
  return (
    <div className="App">
      <h1>Quizzoeur</h1>
      <div>
      <div className='Bleu'>
          <div className='IconPlayerBleu'>
            Q
          </div>
          <div className='text-question'>
            Combien de seconde y-a-t'il dans une heure ?
          </div>
     </div> 
     <div className='Vert mt-5'>
          <div className='IconPlayerVert'>
            ✓
          </div>
          <div className='text-response'>
            Il y a 3600 secondes dans une heure.
          </div>
        </div>
      </div>
      <button className='next'>Suivante !</button>
    </div>


  );
}

export default QuestionV1; 
