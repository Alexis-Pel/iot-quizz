import React from 'react';

const End = (winner) => {
  return (
      <div className='App'>
        <h1>Victoire</h1>
        <div className='winner'>
          <p>
            BRAVO ! <p id='winner_name'>{winner}</p> est le VAINCOEUR !
          </p>
        </div>
        <button onClick={() => {window.location.reload()}}>Nouvelle partie !</button>
      </div>

  );
};

export default End;
