import React, { useEffect, useRef, useCallback } from "react";
import * as PIXI from "pixi.js";

interface PixiSlotMachineProps {
	reels: number[];
	symbols: string[];
	isSpinning: boolean;
}

const PixiSlotMachine: React.FC<PixiSlotMachineProps> = ({
	reels,
	symbols,
	isSpinning,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const appRef = useRef<PIXI.Application | null>(null);
	const reelContainers = useRef<PIXI.Container[]>([]);
	const animationId = useRef<number | null>(null);
	const spinStartTime = useRef<number>(0);

	// Initialize PIXI Application
	const initPixi = useCallback(async () => {
		if (!containerRef.current || appRef.current) return;

		try {
			const app = new PIXI.Application();

			await app.init({
				width: 300,
				height: 100,
				backgroundColor: 0x1a1a1a,
				antialias: true,
			});

			containerRef.current.innerHTML = "";
			containerRef.current.appendChild(app.canvas);
			appRef.current = app;

			// Create reel containers
			createReelContainers();
		} catch (error) {
			console.error("PIXI initialization failed:", error);
		}
	}, []);

	// Create containers for each reel
	const createReelContainers = useCallback(() => {
		const app = appRef.current;
		if (!app) return;

		// Clear existing containers
		reelContainers.current.forEach((container) => {
			app.stage.removeChild(container);
			container.destroy({ children: true });
		});
		reelContainers.current = [];

		// Create new containers for each reel
		for (let i = 0; i < 3; i++) {
			const container = new PIXI.Container();
			container.x = 50 + i * 100;
			container.y = 50;

			app.stage.addChild(container);
			reelContainers.current.push(container);
		}

		updateReelSymbols();
	}, []);

	// Update symbols in reels
	const updateReelSymbols = useCallback(() => {
		reelContainers.current.forEach((container, reelIndex) => {
			// Clear existing symbols
			container.removeChildren();

			// Create multiple symbols for spinning effect
			const symbolsToShow = isSpinning ? 5 : 1;

			for (let i = 0; i < symbolsToShow; i++) {
				let symbolIndex;
				if (isSpinning) {
					// Show random symbols while spinning
					symbolIndex = Math.floor(Math.random() * symbols.length);
				} else {
					// Show the actual reel symbol when not spinning
					symbolIndex = reels[reelIndex] || 0;
				}

				const symbolText = symbols[symbolIndex] || "❓";

				const text = new PIXI.Text({
					text: symbolText,
					style: {
						fontFamily: "Arial",
						fontSize: 36,
						fill: "#ffffff",
						fontWeight: "bold",
						align: "center",
						// stroke: { color: "#000000", width: 2 }, // Remove for debugging
					},
				});

				text.anchor.set(0.5);
				text.x = 0;
				text.y = i * -80; // Stack symbols vertically

				container.addChild(text);
			}
		});
	}, [reels, symbols, isSpinning]);

	// Animation loop for spinning effect
	const animateSpinning = useCallback(() => {
		if (!isSpinning || !appRef.current) {
			if (animationId.current) {
				cancelAnimationFrame(animationId.current);
				animationId.current = null;
			}
			return;
		}

		const currentTime = Date.now();
		if (spinStartTime.current === 0) {
			spinStartTime.current = currentTime;
		}

		// Animate reel containers
		reelContainers.current.forEach((container, index) => {
			// Vertical scrolling effect
			const speed = 15 + index * 2; // Different speed for each reel
			container.y = 50 + Math.sin(currentTime * 0.01 + index) * 10;

			// Animate existing symbols (do NOT updateReelSymbols here)
			container.children.forEach((child, childIndex) => {
				if (child instanceof PIXI.Text) {
					child.rotation =
						Math.sin(currentTime * 0.01 + childIndex) * 0.1;
					child.scale.set(
						1 + Math.sin(currentTime * 0.01 + childIndex) * 0.1,
					);
				}
			});
		});

		animationId.current = requestAnimationFrame(animateSpinning);
	}, [isSpinning]);

	// Stop animation and show final result
	const stopAnimation = useCallback(() => {
		if (animationId.current) {
			cancelAnimationFrame(animationId.current);
			animationId.current = null;
		}
		spinStartTime.current = 0;

		// Reset containers to normal position
		reelContainers.current.forEach((container) => {
			container.y = 50;
		});

		// Update with final symbols
		updateReelSymbols();
	}, [updateReelSymbols]);

	// Initialize PIXI on mount
	useEffect(() => {
		initPixi();

		return () => {
			if (animationId.current) {
				cancelAnimationFrame(animationId.current);
			}
			if (appRef.current) {
				appRef.current.destroy(true, { children: true });
				appRef.current = null;
			}
			reelContainers.current = [];
		};
	}, [initPixi]);

	// Update symbols when reels change and not spinning
	useEffect(() => {
		if (appRef.current && !isSpinning) {
			updateReelSymbols();
		}
	}, [reels, symbols, isSpinning, updateReelSymbols]);

	// Handle spinning animation
	useEffect(() => {
		if (isSpinning) {
			spinStartTime.current = 0;
			animateSpinning();
		} else {
			stopAnimation();
		}
	}, [isSpinning, animateSpinning, stopAnimation]);

	return (
		<div
			ref={containerRef}
			className="w-[300px] h-[100px] border-4 border-gray-700 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-inner"
		>
			{!appRef.current && (
				<div className="text-white text-sm">Loading PIXI...</div>
			)}
		</div>
	);
};

const SlotMachineGame = () => {
	const [credits, setCredits] = React.useState(1000);
	const [bet, setBet] = React.useState(10);
	const [isSpinning, setIsSpinning] = React.useState(false);
	const [results, setResults] = React.useState([0, 1, 2]);
	const [winAmount, setWinAmount] = React.useState(0);
	const [message, setMessage] = React.useState("");
	const [spinCount, setSpinCount] = React.useState(0);
	const [totalWon, setTotalWon] = React.useState(0);

	const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "🔔", "7️⃣"];
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

	const calculateWin = (reelResults: number[]) => {
		const resultSymbols = reelResults.map((index) => symbols[index]);
		const symbolCounts: Record<string, number> = {};

		resultSymbols.forEach((symbol) => {
			symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
		});

		let totalWin = 0;
		let winningSymbol = "";

		Object.entries(symbolCounts).forEach(([symbol, count]) => {
			if (count >= 2 && payouts[symbol as keyof typeof payouts]) {
				const payout =
					payouts[symbol as keyof typeof payouts][
						count as keyof (typeof payouts)[keyof typeof payouts]
					];
				if (payout) {
					totalWin += payout * bet;
					winningSymbol = symbol;
				}
			}
		});

		return {
			amount: totalWin,
			symbol: winningSymbol,
			count: symbolCounts[winningSymbol] || 0,
		};
	};

	const handleSpinComplete = (reelResults: number[]) => {
		setResults(reelResults);
		const win = calculateWin(reelResults);

		setWinAmount(win.amount);
		setTotalWon((prev) => prev + win.amount);

		if (win.amount > 0) {
			setCredits((prev) => prev + win.amount);
			setMessage(
				win.count === 3
					? `🎉 JACKPOT! ${win.count}x ${win.symbol} = $${win.amount}!`
					: `🎊 WIN! ${win.count}x ${win.symbol} = $${win.amount}!`,
			);
		} else {
			setMessage("Try again!");
		}

		setTimeout(() => setMessage(""), 3000);
	};

	const spin = () => {
		if (credits < bet || isSpinning) return;

		setCredits((prev) => prev - bet);
		setWinAmount(0);
		setMessage("");
		setSpinCount((prev) => prev + 1);

		// Generate random results
		const newResults = [
			Math.floor(Math.random() * symbols.length),
			Math.floor(Math.random() * symbols.length),
			Math.floor(Math.random() * symbols.length),
		];

		setResults(newResults);
		setIsSpinning(true);

		// Stop spinning after 3 seconds
		setTimeout(() => {
			setIsSpinning(false);
		}, 3000);
	};

	const resetGame = () => {
		setCredits(1000);
		setBet(10);
		setResults([0, 1, 2]);
		setWinAmount(0);
		setMessage("");
		setSpinCount(0);
		setTotalWon(0);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
						🎰 PIXI SLOTS 🎰
					</h1>
					<p className="text-gray-300 text-lg">
						Professional Slot Machine Experience
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Game Area */}
					<div className="lg:col-span-2">
						<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
							{/* Controls */}
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
										onClick={() =>
											setBet(Math.max(1, bet - 5))
										}
										className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
										disabled={isSpinning}
									>
										-$5
									</button>
									<button
										onClick={() =>
											setBet(Math.min(100, bet + 5))
										}
										className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
										disabled={isSpinning}
									>
										+$5
									</button>
								</div>
							</div>

							{/* Slot Machine */}
							<div className="flex justify-center mb-6">
								<PixiSlotMachine
									reels={results}
									symbols={symbols}
									isSpinning={isSpinning}
								/>
							</div>

							{/* Message Display */}
							{message && (
								<div className="text-center mb-4">
									<div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg inline-block animate-pulse">
										{message}
									</div>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex justify-center space-x-4 mb-6">
								<button
									onClick={spin}
									disabled={credits < bet || isSpinning}
									className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
										credits < bet || isSpinning
											? "bg-gray-600 cursor-not-allowed"
											: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105"
									} text-white shadow-lg`}
								>
									{isSpinning ? "SPINNING..." : "SPIN"}
								</button>

								<button
									onClick={resetGame}
									className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-all duration-200 shadow-lg"
								>
									RESET
								</button>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
										${winAmount}
									</div>
									<div className="text-sm text-gray-300">
										Last Win
									</div>
								</div>
								<div className="bg-gray-700 p-3 rounded-lg">
									<div className="text-2xl font-bold text-purple-400">
										${totalWon}
									</div>
									<div className="text-sm text-gray-300">
										Total Won
									</div>
								</div>
								<div className="bg-gray-700 p-3 rounded-lg">
									<div className="text-2xl font-bold text-blue-400">
										{spinCount > 0
											? Math.round(
													(totalWon /
														(spinCount * bet)) *
														100,
												)
											: 0}
										%
									</div>
									<div className="text-sm text-gray-300">
										RTP
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Current Result */}
						<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
							<h3 className="text-xl font-bold text-white mb-4">
								Current Result
							</h3>
							<div className="flex justify-center space-x-4 text-4xl">
								{results.map((symbolIndex, index) => (
									<div
										key={index}
										className="bg-gray-700 p-3 rounded-lg"
									>
										{symbols[symbolIndex]}
									</div>
								))}
							</div>
						</div>

						{/* Paytable */}
						<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
							<h3 className="text-xl font-bold text-white mb-4">
								Paytable
							</h3>
							<div className="space-y-2 text-sm">
								{Object.entries(payouts).map(
									([symbol, payout]) => (
										<div
											key={symbol}
											className="flex justify-between items-center"
										>
											<span className="flex items-center">
												<span className="text-lg mr-2">
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default SlotMachineGame;
