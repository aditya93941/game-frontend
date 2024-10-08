import React, { Component } from 'react';
import io from 'socket.io-client';

class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      currentQuestion: null,
      selectedAnswer: '',
      result: '',
      gameEnded: false,
    };
    this.socket = io('https://kbc-game-backend-xqwf.onrender.com');
  }

  componentDidMount() {
    const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
      this.setState({ playerName: savedPlayerName });
    }
    if (savedQuestionIndex) {
      this.socket.emit('resume_game', { questionIndex: savedQuestionIndex });
    }

    this.socket.on('question', (question) => {
      this.setState({ currentQuestion: question, result: '' });
      localStorage.setItem('currentQuestionIndex', question.index);
    });

    this.socket.on('result', (data) => {
      this.setState({ result: data.result === 'correct' ? 'Congratulations!' : 'Wrong Answer. Retry!' });
    });

    this.socket.on('end_game', (data) => {
      const message = `${data.message} Player: ${this.state.playerName}`;
      this.setState({ gameEnded: true, result: message });
      localStorage.removeItem('currentQuestionIndex');
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedAnswer, playerName } = this.state;

    if (!selectedAnswer) {
      this.setState({ result: 'Please select an answer!' });
      return;
    }

    if (!playerName) {
      this.setState({ result: 'Please enter your name!' });
      return;
    }

    this.socket.emit('submit_answer', { answer: selectedAnswer });
  };

  handleAnswerChange = (e) => {
    this.setState({ selectedAnswer: e.target.value });
  };

  handleNameChange = (e) => {
    this.setState({ playerName: e.target.value });
    localStorage.setItem('playerName', e.target.value); // Store the name in local storage
  };

  render() {
    const { currentQuestion, result, gameEnded, playerName } = this.state;

    if (gameEnded) {
      return <h1 className="game-end">{result}</h1>;
    }

    return (
      <div className="container">
        {!playerName && (
          <div>
            <h2>Enter your name</h2>
            <input
              type="text"
              value={playerName}
              onChange={this.handleNameChange}
              placeholder="Your Name"
            />
          </div>
        )}
        {currentQuestion && playerName && (
          <div>
            <h2>{currentQuestion.question}</h2>
            <form onSubmit={this.handleSubmit}>
              {currentQuestion.options.map((option, index) => (
                <div key={index}>
                  <label>
                    <input
                      type="radio"
                      value={option}
                      onChange={this.handleAnswerChange}
                      name="answer"
                    />
                    {option}
                  </label>
                </div>
              ))}
              <button type="submit">Submit Answer</button>
            </form>
            {result && <h3 className="result">{result}</h3>}
          </div>
        )}
      </div>
    );
  }
}

export default PlayerComponent;
