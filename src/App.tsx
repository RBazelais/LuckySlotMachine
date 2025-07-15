import React, { useState, useCallback } from "react";
import { Play } from "lucide-react";

const SlotMachine = () => {
	const [credits, setCredits] = useState(1000);
	const [bet, setBet] = useState(10);
	const [reels, setReels] = useState([0, 0, 0]);
	const [isSpinning, setIsSpinning] = useState(false);
	const [winAmount, setWinAmount] = useState(0);

	// Slot symbols with different probabilities
	const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "🔔", "7️⃣"];
	const symbolWeights = [25, 20, 18, 15, 12, 5, 3, 2]; // Higher = more common

	// Enhanced payout table
	const payouts = {
		"🍒": { 2: 2, 3: 5 },
		"🍋": { 2: 3, 3: 10 },
		"🍊": { 2: 4, 3: 15 },
		"🍇": { 2: 5, 3: 20 },
		"⭐": { 2: 10, 3: 50 },
		"💎": { 2: 25, 3: 100 },
		"🔔": { 2: 50, 3: 200 },
		"7️⃣": { 2: 100, 3: 500 },
	};

	// Weighted random symbol selection
	const getRandomSymbol = useCallback(() => {
		const totalWeight = symbolWeights.reduce(
			(sum, weight) => sum + weight,
			0,
		);
		let random = Math.random() * totalWeight;

		for (let i = 0; i < symbols.length; i++) {
			random -= symbolWeights[i];
			if (random <= 0) return i;
		}
		return 0;
	}, []);

	// Enhanced win calculation
	const calculateWin = useCallback(
		(reelResults) => {
			const symbolCounts = {};
			reelResults.forEach((symbolIndex) => {
				const symbol = symbols[symbolIndex];
				symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
			});

			let totalWin = 0;
			Object.entries(symbolCounts).forEach(([symbol, count]) => {
				if (count >= 2 && payouts[symbol]) {
					totalWin += payouts[symbol][count] * bet;
				}
			});

			return totalWin;
		},
		[bet],
	);

	// Enhanced spin with staggered reel animation
	const spin = useCallback(async () => {
		if (credits < bet || isSpinning) return;

		setIsSpinning(true);
		setCredits((prev) => prev - bet);
		setWinAmount(0);

		// Simulate realistic reel spinning with staggered stops
		const newReels = [0, 0, 0];
		const spinDurations = [800, 1200, 1600]; // Different timing for each reel

		// Animate each reel
		for (let reel = 0; reel < 3; reel++) {
			const duration = spinDurations[reel];
			const startTime = Date.now();

			const animateReel = () => {
				const elapsed = Date.now() - startTime;
				if (elapsed < duration) {
					setReels((prev) => {
						const updated = [...prev];
						updated[reel] = Math.floor(
							Math.random() * symbols.length,
						);
						return updated;
					});
					requestAnimationFrame(animateReel);
				} else {
					// Final result
					newReels[reel] = getRandomSymbol();
					setReels((prev) => {
						const updated = [...prev];
						updated[reel] = newReels[reel];
						return updated;
					});
				}
			};

			requestAnimationFrame(animateReel);
		}

		// Calculate results after all reels stop
		setTimeout(() => {
			const winnings = calculateWin(newReels);
			setWinAmount(winnings);

			if (winnings > 0) {
				setCredits((prev) => prev + winnings);
			}

			setIsSpinning(false);
		}, 1800);
	}, [credits, bet, isSpinning, getRandomSymbol, calculateWin]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
						⭐ LUCKY SLOTS ⭐
					</h1>
					<p className="text-gray-300 text-lg">
						Premium Casino Experience
					</p>
				</div>

				{/* Main Game Container */}
				<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
					{/* Credits & Bet Controls */}
					<div className="flex justify-between items-center mb-6">
						<div className="flex items-center space-x-4">
							<div className="bg-green-600 px-4 py-2 rounded-lg">
								<span className="text-white font-bold">
									Credits: ${credits}
								</span>
							</div>
							<div className="bg-blue-600 px-4 py-2 rounded-lg">
								<span className="text-white font-bold">
									Bet: ${bet}
								</span>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<button
								onClick={() => setBet(Math.max(1, bet - 5))}
								className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
								disabled={isSpinning}
							>
								-$5
							</button>
							<button
								onClick={() => setBet(Math.min(100, bet + 5))}
								className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
								disabled={isSpinning}
							>
								+$5
							</button>
						</div>
					</div>

					{/* Slot Machine */}
					<div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl mb-6">
						<div className="bg-black p-4 rounded-lg">
							<div className="flex justify-center space-x-4">
								{reels.map((symbolIndex, index) => (
									<div
										key={index}
										className={`w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl font-bold shadow-inner transition-all duration-300 ${
											isSpinning ? "animate-bounce" : ""
										}`}
									>
										{symbols[symbolIndex]}
									</div>
								))}
							</div>
						</div>

						{/* Win Amount Display */}
						{winAmount > 0 && (
							<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-full font-bold text-xl animate-bounce">
								WIN: ${winAmount}!
							</div>
						)}
					</div>

					{/* Spin Button */}
					<div className="flex justify-center">
						<button
							onClick={spin}
							disabled={isSpinning || credits < bet}
							className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
								isSpinning || credits < bet
									? "bg-gray-600 cursor-not-allowed"
									: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105"
							} text-white shadow-lg`}
						>
							<Play className="w-5 h-5" />
							<span>{isSpinning ? "SPINNING..." : "SPIN"}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SlotMachine;
