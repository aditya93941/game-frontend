socket.on('submit_answer', (data) => {
  const { answer, playerName } = data; // Receiving player name and answer
  const correctAnswer = questions[currentQuestionIndex].correctAnswer;

  if (answer === correctAnswer) {
    io.emit('result', { result: 'correct', player: playerName, answer });

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      io.emit('question', questions[currentQuestionIndex]); 
    } else {
      io.emit('end_game', { message: `Game Completed. Thank you, ${playerName}!` }); // Include the player's name in the final message
    }
  } else {
    io.emit('result', { result: 'wrong', player: playerName, answer });
  }
});
