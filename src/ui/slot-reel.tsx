import { useEffect, useState } from "react";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "K", "Q", "J", "10"];
export const CARD_TYPES = SUITS.flatMap((suit) =>
  RANKS.map((rank) => ({ rank, suit }))
);

export function SlotReel({
  card,
  isSpinning,
  delay = 0,
}: {
  card: { rank: string; suit: string } | null;
  isSpinning: boolean;
  delay: number;
}) {
  const [displayCards, setDisplayCards] = useState<
    Array<{ rank: string; suit: string }>
  >([]);

  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setDisplayCards(
          Array(5)
            .fill(null)
            .map(
              () => CARD_TYPES[Math.floor(Math.random() * CARD_TYPES.length)]
            )
        );
      }, 50);

      setTimeout(() => clearInterval(interval), 1200 + delay);

      return () => clearInterval(interval);
    }
  }, [isSpinning, delay]);

  const getSuitColor = (suit: string) => {
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-gray-800";
  };

  const finalCard = card || displayCards[0];

  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-xl overflow-hidden border-4 border-yellow-500/50 shadow-xl">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-yellow-500/5 to-transparent pointer-events-none" />

      <div
        className={`h-full flex flex-col justify-center items-center transition-all duration-300 ${
          isSpinning ? "animate-slot-spin" : ""
        }`}
      >
        {isSpinning ? (
          <div className="space-y-2">
            {displayCards.slice(0, 3).map((c, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-100 rounded-md sm:rounded-lg p-1 w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 flex flex-col items-center justify-center shadow-lg opacity-70"
              >
                <div
                  className={`text-xl sm:text-2xl md:text-3xl font-bold ${getSuitColor(
                    c.suit
                  )}`}
                >
                  {c.rank}
                </div>
                <div
                  className={`text-lg sm:text-xl md:text-2xl ${getSuitColor(
                    c.suit
                  )}`}
                >
                  {c.suit}
                </div>
              </div>
            ))}
          </div>
        ) : finalCard ? (
          <div className="bg-white dark:bg-gray-100 rounded-lg sm:rounded-xl p-2 w-full h-full flex flex-col items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
            <div
              className={`text-3xl sm:text-4xl md:text-5xl font-bold ${getSuitColor(
                finalCard.suit
              )}`}
            >
              {finalCard.rank}
            </div>
            <div
              className={`text-2xl sm:text-3xl md:text-4xl mt-1 sm:mt-2 ${getSuitColor(
                finalCard.suit
              )}`}
            >
              {finalCard.suit}
            </div>
          </div>
        ) : (
          <div className="text-4xl text-gray-500">?</div>
        )}
      </div>

      <style jsx>{`
        @keyframes slot-spin {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-slot-spin {
          animation: slot-spin 0.1s linear infinite;
        }
      `}</style>
    </div>
  );
}
