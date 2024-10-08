import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';


class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      answer: '',
      currentQuestion: null,
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
      this.setState({ result: `${data.player} answered ${data.result === 'correct' ? 'correctly' : 'wrongly'}` });
    });

    this.socket.on('end_game', (data) => {
      this.setState({ gameEnded: true, result: data.message });
    });
  }

  handleNameChange = (e) => {
    this.setState({ playerName: e.target.value });
  };

  handleAnswerChange = (e) => {
    this.setState({ answer: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { playerName, answer } = this.state;
    this.socket.emit('submit_answer', { answer, playerName });
  };

  render() {
    const { currentQuestion, result, playerName, gameEnded } = this.state;

    if (gameEnded) {
      return <h1>{result}</h1>;
    }

    return (
      <div>
        {!playerName && (
          <div>
            <h2>Enter your name</h2>
            <input type="text" onChange={this.handleNameChange} value={playerName} />
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
            {result && <h3>{result}</h3>}
          </div>
        )}
      </div>
    );
  }
}

export default PlayerComponent;
