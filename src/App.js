import './App.css';
import Tictactoe from './components/Tictactoe.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic-Tac-Toe AI</h1>
        <p>Play Tic-Tac-Toe against the AI. (PD. You'll never win).</p>
        <Tictactoe />
      </header>
      <p>Made by <a href="https://github.com/davidhelo/">Davidhelo</a>. See source code for this project <a href="https://github.com/davidhelo/tictactoeAI">here</a>.</p>
    </div>
  );
}

export default App;
