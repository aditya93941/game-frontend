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
    this.socket.on('question', (question) => {
      this.setState({ currentQuestion: question, result: '' });
    });

    this.socket.on('result', (data) => {
      this.setState({ result: `${data.result === 'correct' ? 'Congratulations!' : 'Wrong Answer. Retry!'}` });
    });

    this.socket.on('end_game', (data) => {
      this.setState({ gameEnded: true, result: data.message });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedAnswer } = this.state;

    if (!selectedAnswer) {
      this.setState({ result: 'Please select an answer!' });
      return;
    }

    this.socket.emit('submit_answer', { playerName: this.state.playerName, answer: selectedAnswer });
  };

  handleAnswerChange = (e) => {
    this.setState({ selectedAnswer: e.target.value });
  };

  render() {
    const { currentQuestion, result, playerName, gameEnded } = this.state;

    if (gameEnded) {
      return <h1 className="game-end">{result}</h1>;
    }

    return (
      <div className="container">
        {!playerName && (
          <div>
            <h2>Enter your name</h2>
            <input type="text" onChange={(e) => this.setState({ playerName: e.target.value })} />
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
