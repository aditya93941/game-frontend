import React, { Component } from 'react';
import io from 'socket.io-client';

class PlayerComponent extends Component {
  state = {
    playerName: '', // The player's name
    currentQuestion: null, // Current question displayed
    selectedAnswer: '', // Selected answer for the current question
    result: '', // The result of the answer
    gameEnded: false, // Whether the game has ended or not
    nameSubmitted: false, // Tracks if the name has been submitted
  };

  socket = io('http://localhost:4000'); // Update this to your server's address

  componentDidMount() {
    // Listen for the current question from the server
    this.socket.on('question', (question) => {
      this.setState({ currentQuestion: question, result: '' });
    });

    // Listen for the result of the answer (whether it's correct or wrong)
    this.socket.on('result', (data) => {
      this.setState({ result: `${data.result === 'correct' ? 'Congratulations!' : 'Wrong Answer. Try again!'}` });
    });

    // Listen for the end of the game event
    this.socket.on('end_game', (data) => {
      this.setState({ gameEnded: true, result: data.message });
    });
  }

  // Handle form submission (answer submission)
  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedAnswer, playerName, nameSubmitted } = this.state;

    // Ensure the player has selected an answer and entered their name
    if (!selectedAnswer) {
      this.setState({ result: 'Please select an answer!' });
      return;
    }

    // Check if the player name is not submitted yet or if it's empty
    if (!nameSubmitted || !playerName.trim()) {
      this.setState({ result: 'Please enter your name!' });
      return;
    }

    // Emit the answer and player's name to the backend
    this.socket.emit('submit_answer', { playerName, answer: selectedAnswer });
  };

  // Handle player name input change
  handleNameChange = (e) => {
    this.setState({ playerName: e.target.value });
  };

  // Handle answer option selection
  handleAnswerChange = (e) => {
    this.setState({ selectedAnswer: e.target.value });
  };

  // Handle the name submission (when the player submits their name)
  handleNameSubmit = () => {
    const { playerName } = this.state;

    // Ensure the player name is not empty or just spaces
    if (!playerName.trim()) {
      this.setState({ result: 'Name cannot be empty!' });
      return;
    }

    // Set name as submitted and allow the player to proceed to answering questions
    this.setState({ nameSubmitted: true, result: '' });
  };

  render() {
    const { currentQuestion, result, playerName, gameEnded, nameSubmitted } = this.state;

    if (gameEnded) {
      // Display the final thank you message after the game ends
      return <h1>{result}</h1>;
    }

    return (
      <div className="container">
        {/* Name input section (only visible if name hasn't been submitted yet) */}
        {!nameSubmitted && (
          <div>
            <h2>Enter your name</h2>
            <input
              type="text"
              onChange={this.handleNameChange}
              value={playerName}
              placeholder="Your name"
            />
            <button onClick={this.handleNameSubmit}>Submit Name</button>
            {result && <h3>{result}</h3>}
          </div>
        )}

        {/* Question and answer section (visible only after the name is submitted) */}
        {nameSubmitted && currentQuestion && (
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
