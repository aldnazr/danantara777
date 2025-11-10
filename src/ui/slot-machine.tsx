"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { CARD_TYPES, SlotReel } from "./card-3d";

interface GameState {
  cards: (typeof CARD_TYPES)[0][];
  isSpinning: boolean;
  result: "win" | "lose" | null;
  tokens: number;
  history: Array<{ result: "win" | "lose"; timestamp: number }>;
  alwaysWin: boolean;
}

export default function SlotMachine() {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    isSpinning: false,
    result: null,
    tokens: 100,
    history: [],
    alwaysWin: false,
  });

  const generateRandomCards = () => {
    return Array.from({ length: 5 }, () => {
      return CARD_TYPES[Math.floor(Math.random() * CARD_TYPES.length)];
    });
  };

  const generateWinningCards = () => {
    const winningCard =
      CARD_TYPES[Math.floor(Math.random() * CARD_TYPES.length)];
    return Array.from({ length: 5 }, () => winningCard);
  };

  const checkWin = (cards: (typeof CARD_TYPES)[0][]) => {
    const firstCard = cards[0];
    return cards.every(
      (card) => card.rank === firstCard.rank && card.suit === firstCard.suit
    );
  };

  const handleSpin = () => {
    if (gameState.tokens < 10) {
      alert("Token tidak cukup! Minimal 10 token untuk bermain.");
      return;
    }

    if (gameState.isSpinning) return;

    setGameState((prev) => ({
      ...prev,
      isSpinning: true,
      result: null,
      tokens: prev.tokens - 10,
    }));

    setTimeout(() => {
      const newCards = gameState.alwaysWin
        ? generateWinningCards()
        : generateRandomCards();
      const isWin = checkWin(newCards);

      setGameState((prev) => ({
        ...prev,
        cards: newCards,
        isSpinning: false,
        result: isWin ? "win" : "lose",
        tokens: prev.tokens + (isWin ? 100 : 0),
        history: [
          { result: isWin ? "win" : "lose", timestamp: Date.now() },
          ...prev.history.slice(0, 19),
        ],
      }));
    }, 2000);
  };

  const wins = gameState.history.filter((h) => h.result === "win").length;
  const losses = gameState.history.filter((h) => h.result === "lose").length;
  const winRate =
    gameState.history.length > 0
      ? ((wins / gameState.history.length) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-black dark:via-purple-950 dark:to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 drop-shadow-2xl animate-pulse">
            🎰 DANANTARA777 🎰
          </h1>
          <p className="text-xl text-yellow-300 mt-2 font-semibold">
            Win BIG or Go Home!
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-yellow-400">
            <CardBody className="text-center py-6">
              <p className="text-sm font-semibold text-yellow-100">TOKENS</p>
              <p className="text-5xl font-bold text-white drop-shadow-lg">
                {gameState.tokens}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-400">
            <CardBody className="text-center py-6">
              <p className="text-sm font-semibold text-green-100">WIN RATE</p>
              <p className="text-5xl font-bold text-white drop-shadow-lg">
                {winRate}%
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-blue-400">
            <CardBody className="text-center py-6">
              <p className="text-sm font-semibold text-blue-100">TOTAL SPINS</p>
              <p className="text-5xl font-bold text-white drop-shadow-lg">
                {gameState.history.length}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Slot Machine */}
        <Card className="bg-gradient-to-b from-red-600 via-red-700 to-red-900 border-8 border-yellow-500 shadow-2xl">
          <CardBody className="p-8">
            <div className="bg-black/30 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-5 gap-3">
                {Array(5)
                  .fill(null)
                  .map((_, idx) => (
                    <SlotReel
                      key={idx}
                      card={gameState.cards[idx] || null}
                      isSpinning={gameState.isSpinning}
                      delay={idx * 200}
                    />
                  ))}
              </div>
            </div>

            {/* Result Banner */}
            {gameState.result && (
              <div
                className={`text-center py-8 rounded-xl border-4 mb-6 animate-bounce ${
                  gameState.result === "win"
                    ? "bg-green-500/90 border-green-300"
                    : "bg-red-500/90 border-red-300"
                }`}
              >
                <p className="text-6xl font-bold text-white drop-shadow-lg">
                  {gameState.result === "win"
                    ? "🎉 JACKPOT! 🎉"
                    : "💔 TRY AGAIN 💔"}
                </p>
                <p className="text-2xl text-white mt-2 font-semibold">
                  {gameState.result === "win"
                    ? "+100 TOKENS!"
                    : "Better luck next time!"}
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-4">
              <Button
                size="lg"
                onPress={handleSpin}
                disabled={gameState.isSpinning || gameState.tokens < 10}
                className="w-full h-20 text-3xl font-bold bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white border-4 border-green-400 shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gameState.isSpinning
                  ? "🎰 SPINNING... 🎰"
                  : "💰 SPIN (10 TOKENS) 💰"}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  onPress={() =>
                    setGameState((prev) => ({
                      ...prev,
                      tokens: prev.tokens + 50,
                    }))
                  }
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold border-2 border-yellow-400"
                >
                  +50 Tokens
                </Button>

                <Button
                  size="lg"
                  onPress={() =>
                    setGameState((prev) => ({
                      ...prev,
                      alwaysWin: !prev.alwaysWin,
                    }))
                  }
                  className={`font-bold border-2 ${
                    gameState.alwaysWin
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500"
                  }`}
                >
                  {gameState.alwaysWin ? "🎯 Always Win: ON" : "🎲 Normal Mode"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* History */}
        {gameState.history.length > 0 && (
          <Card className="bg-gray-800/50 border-2 border-gray-700">
            <CardHeader>
              <h3 className="text-2xl font-bold text-yellow-400">
                📊 Recent Spins
              </h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
                {gameState.history.slice(0, 10).map((record, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-center font-bold ${
                      record.result === "win"
                        ? "bg-green-500/80 text-white"
                        : "bg-red-500/80 text-white"
                    }`}
                  >
                    {record.result === "win" ? "W" : "L"}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
