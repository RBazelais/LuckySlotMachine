import React, { useState, useCallback } from "react";
import { Play, TrendingUp } from "lucide-react";

const SlotMachine = () => {
	const [credits, setCredits] = useState(1000);
	const [bet, setBet] = useState(10);
	const [reels, setReels] = useState([0, 0, 0]);
	const [isSpinning, setIsSpinning] = useState(false);
	const [winAmount, setWinAmount] = useState(0);
	const [lastWin, setLastWin] = useState(0);
	const [gameHistory, setGameHistory] = useState([]);
	const [spinCount, setSpinCount] = useState(0);

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
		const totalWeight = symbolWeights.reduce((sum, weight) => sum + weight, 0);
		let random = Math.random() * totalWeight;

		for (let i = 0; i < symbols.length; i++) {
			random -= symbolWeights[i];
			if (random <= 0) return i;
		}
		return 0; // Fallback in case of rounding errors
	}, []);

	// Enhanced win calculation
	const calculateWin = useCallback((reelResults: number[]) => {
		const symbolCounts: Record<string, number> = {};
		reelResults.forEach((symbolIndex) => {
			const symbol = symbols[symbolIndex];
			symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
		});
	
		let totalWin = 0;
		Object.entries(symbolCounts).forEach(([symbol, count]) => {
			if (count >= 2 && payouts[symbol as keyof typeof payouts]) {
				const payout = payouts[symbol as keyof typeof payouts];
				totalWin += payout[count as keyof typeof payout] * bet;
			}
		});
	
		return totalWin;
	}, [bet, symbols]);

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
			setLastWin(winnings);
			
			if (winnings > 0) {
			setCredits(prev => prev + winnings);
			}
	
			// Update game history
			setGameHistory(prev => [...prev.slice(-9), {
			spin: spinCount + 1,
			bet,
			win: winnings,
			symbols: newReels.map(i => symbols[i])
			}]);
	
			setSpinCount(prev => prev + 1);
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
				<p className="text-gray-300 text-lg">Premium Casino Experience</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Game Area */}
				<div className="lg:col-span-2">
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

						{/* Game Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6">
							<div className="bg-gray-700 p-3 rounded-lg">
								<div className="text-2xl font-bold text-yellow-400">
									{spinCount}
								</div>
								<div className="text-sm text-gray-300">Spins</div>
							</div>
							<div className="bg-gray-700 p-3 rounded-lg">
								<div className="text-2xl font-bold text-green-400">
									${lastWin}
								</div>
								<div className="text-sm text-gray-300">
									Last Win
								</div>
							</div>
							<div className="bg-gray-700 p-3 rounded-lg">
								<div className="text-2xl font-bold text-blue-400">
									{Math.round(
										(gameHistory.reduce(
											(sum, game) => sum + game.win,
											0,
										) /
											Math.max(gameHistory.length * bet, 1)) *
											100,
									)}
									%
								</div>
								<div className="text-sm text-gray-300">RTP</div>
							</div>
							<div className="bg-gray-700 p-3 rounded-lg">
								<div className="text-2xl font-bold text-purple-400">
									$
									{gameHistory.reduce(
										(sum, game) => sum + game.win,
										0,
									)}
								</div>
								<div className="text-sm text-gray-300">
									Total Won
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Recent Games */}
					<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
						<h2 className="text-xl font-bold text-white mb-4 flex items-center">
							<TrendingUp className="w-5 h-5 mr-2 text-green-400" />
							Recent Games
						</h2>
						<div className="space-y-3 max-h-64 overflow-y-auto">
							{gameHistory
								.slice(-8)
								.reverse()
								.map((game, index) => (
									<div
										key={index}
										className="bg-gray-700 p-3 rounded-lg"
									>
										<div className="flex justify-between items-center mb-1">
											<span className="text-sm text-gray-300">
												Spin #{game.spin}
											</span>
											<span
												className={`text-sm font-bold ${game.win > 0 ? "text-green-400" : "text-red-400"}`}
											>
												{game.win > 0 ? "+" : "-"}$
												{game.win || game.bet}
											</span>
										</div>
										<div className="flex justify-center space-x-1">
											{game.symbols.map((symbol, i) => (
												<span key={i} className="text-lg">
													{symbol}
												</span>
											))}
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

);
};

export default SlotMachine;
