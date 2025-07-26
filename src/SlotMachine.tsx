import React, { useEffect } from "react";
import { Play, Pause, RotateCcw, TrendingUp, Star, Zap } from "lucide-react";
import useSlotMachineStore from "./slotMachineStore";

const SlotMachine = () => {
	const {
		// State
		credits,
		bet,
		reels,
		isSpinning,
		winAmount,
		lastWin,
		gameHistory,
		spinCount,
		autoPlay,
		showWinAnimation,

		// Constants
		symbols,
		payouts,

		// Actions
		adjustBet,
		spin,
		resetGame,
		setAutoPlay,

		// Computed values
		getRTP,
		getTotalWon,
		canSpin,
	} = useSlotMachineStore();

	// Auto-play effect
	useEffect(() => {
		if (!autoPlay) return;

		if (!canSpin()) {
			setAutoPlay(false);
			return;
		}

		const timer = setTimeout(() => {
			if (!isSpinning) {
				spin();
			}
		}, 2000);

		return () => clearTimeout(timer);
	}, [autoPlay, canSpin, isSpinning, spin, setAutoPlay]);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 bg-cover bg-center p-4">
			<div className="max-w-4xl w-full mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
						⭐ LUCKY SLOTS ⭐
					</h1>
					<p className="text-gray-300 text-lg">
						Premium Casino Experience
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center min-h-[500px]">
					{/* Main Game Area */}
					<div className="lg:col-span-2 flex flex-col items-center justify-center">
						<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 min-h-[500px] flex flex-col justify-center">
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
										onClick={() => adjustBet(-5)}
										className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
										disabled={isSpinning}
									>
										-$5
									</button>
									<button
										onClick={() => adjustBet(5)}
										className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
										disabled={isSpinning}
									>
										+$5
									</button>
								</div>
							</div>

							{/* Slot Machine */}
							<div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl mb-6 w-[400px] mx-auto">
								<div className="bg-black p-4 rounded-lg w-full">
									<div className="flex justify-center space-x-4 w-full">
									{Array.isArray(reels) && reels.map((symbolIndex, index) => (
										// Display each reel symbol with animation effects based on game state
											<div
												key={index}
												className={`w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl font-bold shadow-inner transition-all duration-300 ${
													isSpinning
														? "animate-bounce"
														: ""
												} ${showWinAnimation ? "animate-pulse scale-110" : ""}`}
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

							{/* Control Buttons */}
							<div className="flex justify-center space-x-4 mb-6">
								<button
									onClick={spin}
									disabled={!canSpin()}
									className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
										!canSpin()
											? "bg-gray-600 cursor-not-allowed"
											: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105"
									} text-white shadow-lg`}
								>
									<Play className="w-5 h-5" />
									<span>
										{isSpinning ? "SPINNING..." : "SPIN"}
									</span>
								</button>

								<button
									onClick={() => setAutoPlay(!autoPlay)}
									className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
										autoPlay
											? "bg-red-600 hover:bg-red-700"
											: "bg-blue-600 hover:bg-blue-700"
									} text-white shadow-lg`}
								>
									{autoPlay ? (
										<Pause className="w-5 h-5" />
									) : (
										<Zap className="w-5 h-5" />
									)}
									<span>
										{autoPlay ? "STOP AUTO" : "AUTO PLAY"}
									</span>
								</button>

								<button
									onClick={resetGame}
									className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-all duration-200 shadow-lg"
								>
									<RotateCcw className="w-5 h-5" />
									<span>RESET</span>
								</button>
							</div>

							{/* Game Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6">
								<div className="bg-gray-700 p-3 rounded-lg">
									<div className="text-2xl font-bold text-yellow-400">
										{spinCount}
									</div>
									<div className="text-sm text-gray-300">
										Spins
									</div>
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
										{getRTP()}%
									</div>
									<div className="text-sm text-gray-300">
										RTP
									</div>
								</div>
								<div className="bg-gray-700 p-3 rounded-lg">
									<div className="text-2xl font-bold text-purple-400">
										${getTotalWon()}
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
						{/* Paytable */}
						<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
							<h2 className="text-xl font-bold text-white mb-4 flex items-center">
								<Star className="w-5 h-5 mr-2 text-yellow-400" />
								Paytable
							</h2>
							<div className="space-y-2">
								{Object.entries(payouts).map(
									([symbol, payout]) => (
										<div
											key={symbol}
											className="flex justify-between items-center text-sm"
										>
											<span className="flex items-center">
												<span className="text-xl mr-2">
													{symbol}
												</span>
												<span className="text-gray-300">
													x3
												</span>
											</span>
											<span className="text-yellow-400 font-bold">
												${payout[3] * bet}
											</span>
										</div>
									),
								)}
							</div>
						</div>

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
												{game.symbols.map(
													(symbol, i) => (
														<span
															key={i}
															className="text-lg"
														>
															{symbol}
														</span>
													),
												)}
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
