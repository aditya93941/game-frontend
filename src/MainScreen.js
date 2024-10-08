import React, { Component } from 'react';
import io from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';


class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      const message = `${data.result === 'correct' ? 'Congratulations!' : 'Wrong Answer. Retry!'}`;
      this.setState({ result: message });
    });

    this.socket.on('end_game', (data) => {
      this.setState({ gameEnded: true, result: data.message });
    });
  }

  render() {
    const { currentQuestion, result, gameEnded } = this.state;
    const qrCodeUrl = 'https://game-frontend-gamma.vercel.app/player';

    if (gameEnded) {
      return <h1 className="game-end">{result}</h1>;
    }

    return (
      <div className="container">
        <h1>Main Screen</h1>
        {currentQuestion && (
          <div>
            <h2>{currentQuestion.question}</h2>
            <ul>
              {currentQuestion.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
        )}
        {result && <h3>{result}</h3>}
        <div className="qr-code-container">
          <QRCodeCanvas value={qrCodeUrl} />
        </div>
      </div>
    );
  }
}

export default MainScreen;
