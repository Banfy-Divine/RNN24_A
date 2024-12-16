import React, { useState, useEffect } from 'react';
import './App.css';

const PROGRAMMING_LANGUAGES = [
  { name: 'JavaScript', color: 'yellow' },
  { name: 'Python', color: 'blue' },
  { name: 'Java', color: 'orange' },
  { name: 'C++', color: 'navy' },
  { name: 'Ruby', color: 'red' },
  { name: 'Go', color: 'cyan' },
  { name: 'Rust', color: 'black' },
  { name: 'Swift', color: 'coral' },
  { name: 'Kotlin', color: 'purple' },
  { name: 'TypeScript', color: 'dodgerblue' }
];

function App() {
  const [languages, setLanguages] = useState([]);
  const [showLanguages, setShowLanguages] = useState(true);
  const [languageInput, setLanguageInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Success and failure sound effects
  const successSound = new Audio('./sounds/yay.mp3');
  const failureSound = new Audio('./sounds/game-over.mp3');

  useEffect(() => {
    // Randomly select 10 unique languages
    const selectedLanguages = PROGRAMMING_LANGUAGES
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    
    setLanguages(selectedLanguages);

    // Hide languages after 4 seconds
    const timer = setTimeout(() => {
      setShowLanguages(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check game over conditions
    if (
      attempts.filter(a => a.status === 'failed').length >= 5 ||
      attempts.length >= 20
    ) {
      setGameOver(true);
    }
  }, [attempts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if language was already used
    if (attempts.some(a => a.language === languageInput)) {
      playFailureSound();
      recordAttempt(languageInput, colorInput, 'failed');
      return;
    }

    // Find the correct language
    const targetLanguage = languages.find(l => l.name === languageInput);

    if (targetLanguage) {
      // Check if color matches
      if (targetLanguage.color.toLowerCase() === colorInput.toLowerCase()) {
        playSuccessSound();
        recordAttempt(languageInput, colorInput, 'success');
      } else {
        playFailureSound();
        recordAttempt(languageInput, colorInput, 'failed');
      }
    } else {
      playFailureSound();
      recordAttempt(languageInput, colorInput, 'failed');
    }

    // Clear inputs
    setLanguageInput('');
    setColorInput('');
  };

  const playSuccessSound = () => {
    try {
      successSound.play();
    } catch (error) {
      console.error('Error playing success sound', error);
    }
  };

  const playFailureSound = () => {
    try {
      failureSound.play();
    } catch (error) {
      console.error('Error playing failure sound', error);
    }
  };

  const recordAttempt = (language, color, status) => {
    setAttempts(prev => [...prev, { 
      number: prev.length + 1, 
      language, 
      color, 
      status 
    }]);
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <h1>Programming Language Color Game</h1>
      
      {showLanguages && (
        <div className="language-preview">
          {languages.map((lang, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: lang.color, 
                padding: '10px', 
                margin: '5px',
                color: 'white'
              }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}

      {!showLanguages && !gameOver && (
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Programming Language" 
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Color Name" 
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            required
          />
          <button type="submit">Submit Guess</button>
        </form>
      )}

      {gameOver && (
        <div>
          <h2>Game Over!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Attempt</th>
            <th>Language</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt, index) => (
            <tr key={index}>
              <td>{attempt.number}</td>
              <td style={{ backgroundColor: attempt.color }}>{attempt.language}</td>
              <td style={{ 
                backgroundColor: attempt.status === 'success' ? 'green' : 'red',
                color: 'white'
              }}>
                {attempt.status === 'success' ? '✓' : '✗'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;