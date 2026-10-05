'use client';

import { useEffect, useRef, useState } from 'react';

const SIZE = 16;
type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';
type Phase = 'ready' | 'playing' | 'paused' | 'over';
type Game = { snake: Point[]; food: Point; score: number; phase: Phase };

const delta: Record<Direction, Point> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};
const opposite: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };

function initialGame(): Game {
  return { snake: [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }], food: { x: 11, y: 8 }, score: 0, phase: 'ready' };
}

function nextFood(snake: Point[]): Point {
  const free: Point[] = [];
  for (let y = 0; y < SIZE; y += 1) for (let x = 0; x < SIZE; x += 1) {
    if (!snake.some((part) => part.x === x && part.y === y)) free.push({ x, y });
  }
  return free[Math.floor(Math.random() * free.length)] || { x: -1, y: -1 };
}

export function SnakeGame({ active }: { active: boolean }) {
  const [game, setGame] = useState<Game>(initialGame);
  const direction = useRef<Direction>('right');
  const lastDirection = useRef<Direction>('right');

  const restart = () => {
    direction.current = 'right';
    lastDirection.current = 'right';
    setGame({ ...initialGame(), phase: 'playing' });
  };
  const turn = (next: Direction) => {
    if (next !== opposite[lastDirection.current]) direction.current = next;
  };

  useEffect(() => {
    if (!active || game.phase !== 'playing') return;
    const timer = window.setInterval(() => {
      setGame((current) => {
        if (current.phase !== 'playing') return current;
        const heading = direction.current;
        lastDirection.current = heading;
        const move = delta[heading];
        const head = { x: current.snake[0].x + move.x, y: current.snake[0].y + move.y };
        const ate = head.x === current.food.x && head.y === current.food.y;
        const body = ate ? current.snake : current.snake.slice(0, -1);
        if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || body.some((part) => part.x === head.x && part.y === head.y)) return { ...current, phase: 'over' };
        const snake = [head, ...body];
        return { snake, food: ate ? nextFood(snake) : current.food, score: current.score + (ate ? 10 : 0), phase: snake.length === SIZE * SIZE ? 'over' : 'playing' };
      });
    }, 145);
    return () => window.clearInterval(timer);
  }, [active, game.phase]);

  useEffect(() => {
    if (!active) return;
    const keyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const keys: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
      if (keys[event.key]) { event.preventDefault(); turn(keys[event.key]); }
      if (event.code === 'Space') { event.preventDefault(); setGame((current) => ({ ...current, phase: current.phase === 'playing' ? 'paused' : current.phase === 'paused' ? 'playing' : current.phase })); }
    };
    window.addEventListener('keydown', keyDown);
    return () => window.removeEventListener('keydown', keyDown);
  }, [active]);

  const snakeCells = new Set(game.snake.map((part) => `${part.x},${part.y}`));
  return <div className="snake-app has-scrollbar">
    <div className="snake-toolbar"><strong>Snake</strong><span>Score: {game.score}</span><button type="button" onClick={game.phase === 'ready' || game.phase === 'over' ? restart : () => setGame((current) => ({ ...current, phase: current.phase === 'playing' ? 'paused' : 'playing' }))}>{game.phase === 'ready' ? 'Start game' : game.phase === 'over' ? 'Play again' : game.phase === 'playing' ? 'Pause' : 'Resume'}</button></div>
    <div className="snake-board" role="img" aria-label={`Snake game board. Score ${game.score}. ${game.phase}.`}>
      {Array.from({ length: SIZE * SIZE }, (_, index) => {
        const x = index % SIZE;
        const y = Math.floor(index / SIZE);
        const kind = game.snake[0].x === x && game.snake[0].y === y ? 'head' : snakeCells.has(`${x},${y}`) ? 'snake' : game.food.x === x && game.food.y === y ? 'food' : '';
        return <span className={`snake-cell ${kind}`} key={index} />;
      })}
      {game.phase !== 'playing' && <div className="snake-overlay"><strong>{game.phase === 'ready' ? 'Ready to play?' : game.phase === 'over' ? 'Game over' : 'Paused'}</strong><span>{game.phase === 'ready' ? 'Press Start game' : game.phase === 'over' ? `Final score: ${game.score}` : 'Press Resume or Space'}</span></div>}
    </div>
    <div className="snake-controls"><span>Arrow keys or WASD to move · Space to pause</span><div><button type="button" onClick={() => turn('left')} aria-label="Move left">←</button><button type="button" onClick={() => turn('up')} aria-label="Move up">↑</button><button type="button" onClick={() => turn('down')} aria-label="Move down">↓</button><button type="button" onClick={() => turn('right')} aria-label="Move right">→</button></div></div>
  </div>;
}
