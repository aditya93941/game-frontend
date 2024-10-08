import React, { Component } from 'react';
import io from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';


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
      this.setState({ result: `${data.player} answered ${data.result === 'correct' ? 'correctly' : 'wrongly'}` });
    });

    this.socket.on('end_game', (data) => {
      this.setState({ gameEnded: true, result: data.message });
    });
  }

  render() {
    const { currentQuestion, result, gameEnded } = this.state;
    const qrCodeUrl = 'https://kbcgame-drab.vercel.app/player';

    if (gameEnded) {
      return <h1>{result}</h1>;
    }

    return (
      <div>
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
        <h2>Scan to Join</h2>
        <QRCodeCanvas value={qrCodeUrl} />
      </div>
    );
  }
}

export default MainScreen;
