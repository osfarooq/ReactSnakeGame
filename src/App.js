import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = "RIGHT";

const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
};

const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [apple, setApple] = useState(generateRandomPosition);
  const direction = useRef(INITIAL_DIRECTION);
  const gameLoopInterval = useRef();
  const [gameStarted, setGameStarted] = useState(false); // Add gameStarted state variable
  const [gameOver, setGameOver] = useState(false); // Add gameOver state variable

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (!gameStarted) return; // Ignore key presses if game not started
      if (key === "ArrowLeft" && direction.current !== "RIGHT") {
        direction.current = "LEFT";
      } else if (key === "ArrowUp" && direction.current !== "DOWN") {
        direction.current = "UP";
      } else if (key === "ArrowRight" && direction.current !== "LEFT") {
        direction.current = "RIGHT";
      } else if (key === "ArrowDown" && direction.current !== "UP") {
        direction.current = "DOWN";
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted]); // Include gameStarted in the dependency array

  useEffect(() => {
    checkCollision();
  }, [snake]);

  const startGame = () => {
    setGameStarted(true); // Set gameStarted to true when start button is clicked
    gameLoopInterval.current = setInterval(() => {
      moveSnake();
    }, 100);
  };

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      const currentDirection = direction.current;

      switch (currentDirection) {
        case "RIGHT":
          head.x = (head.x + 1) % GRID_SIZE;
          break;
        case "LEFT":
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case "UP":
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case "DOWN":
          head.y = (head.y + 1) % GRID_SIZE;
          break;
        default:
          break;
      }

      newSnake.unshift(head);
      newSnake.pop();

      return newSnake;
    });
  };

  const checkCollision = () => {
    const head = snake[0];
    const body = snake.slice(1);

    // Check if the snake's head collides with the apple
    if (head.x === apple.x && head.y === apple.y) {
      setApple(generateRandomPosition());
      growSnake();
    }

    // Check if the snake's head collides with its body
    if (body.some((segment) => segment.x === head.x && segment.y === head.y)) {
      resetGame();
    }
  };

  const resetGame = () => {
    clearInterval(gameLoopInterval.current);
    setSnake(INITIAL_SNAKE);
    setApple(generateRandomPosition());
    direction.current = INITIAL_DIRECTION;
    setGameStarted(false); // Reset gameStarted to false when game ends
  };

  const growSnake = () => {
    setSnake((prevSnake) => {
      const tail = prevSnake[prevSnake.length - 1];
      const newTail = { ...tail };
      prevSnake.push(newTail);
      return prevSnake;
    });
  };

  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    setShowHeader(true);
  }, []);

  return (
    <div className="container">
      <div className="game-container">
        <header className={`app-header ${showHeader ? "fade-in" : ""}`}>
          <h1>Snake Game</h1>
        </header>
        <div className="grid">
          {Array.from(Array(GRID_SIZE), (_, row) =>
            Array.from(Array(GRID_SIZE), (_, col) => {
              const isSnake = snake.some(
                (segment) => segment.x === col && segment.y === row
              );
              const isApple = apple.x === col && apple.y === row;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isSnake ? "snake" : ""} ${
                    isApple ? "apple" : ""
                  }`}
                ></div>
              );
            })
          )}
        </div>
        {!gameStarted && (
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        )}
        {gameStarted && !gameOver && (
          <div className="score">Score: {snake.length * 10}</div>
        )}
        {gameOver && <div className="game-over">Game Over</div>}
      </div>
    </div>
  );
};

export default App;
