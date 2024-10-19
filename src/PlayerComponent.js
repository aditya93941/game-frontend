import React, { Component } from 'react';
import io from 'socket.io-client';
import './PlayerComponent.css'; // Import the CSS file for styling

class PlayerComponent extends Component {
  state = {
    playerName: '',
    currentQuestion: null,
    selectedAnswer: '',
    result: '',
    gameEnded: false,
    nameSubmitted: false,
  };

  socket = io('http://localhost:4000'); // Ensure your backend URL is correct

  componentDidMount() {
    // Listen for the current question from the server
    this.socket.on('question', (question) => {
      this.setState({ currentQuestion: question, result: '' });
    });

    // Listen for the result of the answer
    this.socket.on('result', (data) => {
      this.setState({
        result: `${data.result === 'correct' ? 'Congratulations!' : 'Wrong Answer. Try again!'}`,
      });
    });

    // Listen for the end of the game event
    this.socket.on('end_game', (data) => {
      this.setState({ gameEnded: true, result: data.message });
    });
  }

  // Handle form submission for the answer
  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedAnswer, playerName, nameSubmitted } = this.state;

    // Ensure a name has been entered
    if (!nameSubmitted || !playerName.trim()) {
      this.setState({ result: 'Please enter your name first!' });
      return;
    }

    // Ensure an answer has been selected
    if (!selectedAnswer) {
      this.setState({ result: 'Please select an answer!' });
      return;
    }

    // Submit the answer and the player's name to the backend
    this.socket.emit('submit_answer', { playerName, answer: selectedAnswer });
  };

  // Handle name input
  handleNameChange = (e) => {
    this.setState({ playerName: e.target.value });
  };

  // Handle answer selection
  handleAnswerChange = (e) => {
    this.setState({ selectedAnswer: e.target.value });
  };

  // Handle name submission
  handleNameSubmit = () => {
    const { playerName } = this.state;

    if (!playerName.trim()) {
      this.setState({ result: 'Name cannot be empty!' });
      return;
    }

    this.setState({ nameSubmitted: true, result: '' });
  };

  render() {
    const { currentQuestion, result, playerName, gameEnded, nameSubmitted } = this.state;

    if (gameEnded) {
      // Display the final thank you message after the game ends
      return <h1 className="game-end">{`Thank you, ${playerName}! ${result}`}</h1>;
    }

    return (
      <div className="container">
        {/* Name input section (only visible if the name hasn't been submitted yet) */}
        {!nameSubmitted && (
          <div className="name-input-section">
            <h2>Enter your name</h2>
            <input
              type="text"
              onChange={this.handleNameChange}
              value={playerName}
              placeholder="Your name"
              className="input-field"
            />
            <button className="submit-btn" onClick={this.handleNameSubmit}>
              Submit Name
            </button>
            {result && <h3 className="error-message">{result}</h3>}
          </div>
        )}

        {/* Question and answer section (visible after the name is submitted) */}
        {nameSubmitted && currentQuestion && (
          <div className="question-section">
            <h2>{currentQuestion.question}</h2>
            <form onSubmit={this.handleSubmit}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option-container">
                  <label>
                    <input
                      type="radio"
                      value={option}
                      onChange={this.handleAnswerChange}
                      name="answer"
                      className="radio-input"
                    />
                    {option}
                  </label>
                </div>
              ))}
              <button className="submit-btn" type="submit">
                Submit Answer
              </button>
            </form>
            {result && <h3 className="result-message">{result}</h3>}
          </div>
        )}
      </div>
    );
  }
}

export default PlayerComponent;
