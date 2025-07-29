import { create } from "zustand";

interface GameResult {
	spin: number;
	bet: number;
	win: number;
	symbols: string[];
}

interface SlotMachineStore {
	// State
	credits: number;
	bet: number;
	reels: number[];
	isSpinning: boolean;
	winAmount: number;
	lastWin: number;
	gameHistory: GameResult[];
	spinCount: number;
	autoPlay: boolean;
	showWinAnimation: boolean;

	// Constants
	symbols: string[];
	symbolWeights: number[];
	payouts: Record<string, { 2: number; 3: number }>;

	// Actions
	setCredits: (credits: number) => void;
	setBet: (bet: number) => void;
	setReels: (reels: number[]) => void;
	setIsSpinning: (isSpinning: boolean) => void;
	setWinAmount: (winAmount: number) => void;
	setLastWin: (lastWin: number) => void;
	setGameHistory: (gameHistory: GameResult[]) => void;
	setSpinCount: (spinCount: number) => void;
	setAutoPlay: (autoPlay: boolean) => void;
	setShowWinAnimation: (showWinAnimation: boolean) => void;

	// Game actions
	adjustBet: (amount: number) => void;
	addCredits: (amount: number) => void;
	deductBet: () => void;
	addGameToHistory: (gameData: GameResult) => void;
	resetGame: () => void;

	// Game logic
	getRandomSymbol: () => number;
	calculateWin: (reelResults: number[]) => number;
	spin: () => Promise<void>;

	// Computed values
	getRTP: () => number;
	getTotalWon: () => number;
	canSpin: () => boolean;
}

const useSlotMachineStore = create<SlotMachineStore>((set, get) => ({
	// Game state
	credits: 1000,
	bet: 10,
	reels: [0, 0, 0],
	isSpinning: false,
	winAmount: 0,
	lastWin: 0,
	gameHistory: [],
	spinCount: 0,
	autoPlay: false,
	showWinAnimation: false,

	// Symbols and payouts
	symbols: ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "🔔", "7️⃣"],
	symbolWeights: [25, 20, 18, 15, 12, 5, 3, 2],
	payouts: {
		"🍒": { 2: 2, 3: 5 },
		"🍋": { 2: 3, 3: 10 },
		"🍊": { 2: 4, 3: 15 },
		"🍇": { 2: 5, 3: 20 },
		"⭐": { 2: 10, 3: 50 },
		"💎": { 2: 25, 3: 100 },
		"🔔": { 2: 50, 3: 200 },
		"7️⃣": { 2: 100, 3: 500 },
	},

	// State setters
	setCredits: (credits) => set({ credits }),
	setBet: (bet) => set({ bet }),
	setReels: (reels) => set({ reels }),
	setIsSpinning: (isSpinning) => set({ isSpinning }),
	setWinAmount: (winAmount) => set({ winAmount }),
	setLastWin: (lastWin) => set({ lastWin }),
	setGameHistory: (gameHistory) => set({ gameHistory }),
	setSpinCount: (spinCount) => set({ spinCount }),
	setAutoPlay: (autoPlay) => set({ autoPlay }),
	setShowWinAnimation: (showWinAnimation) => set({ showWinAnimation }),

	// Game actions
	adjustBet: (amount) =>
		set((state) => ({
			bet: Math.max(1, Math.min(100, state.bet + amount)),
		})),

	addCredits: (amount) =>
		set((state) => ({
			credits: state.credits + amount,
		})),

	deductBet: () =>
		set((state) => ({
			credits: state.credits - state.bet,
		})),

	addGameToHistory: (gameData) =>
		set((state) => ({
			gameHistory: [...state.gameHistory.slice(-9), gameData],
			spinCount: state.spinCount + 1,
		})),

	resetGame: () =>
		set({
			credits: 1000,
			bet: 10,
			reels: [0, 0, 0],
			isSpinning: false,
			winAmount: 0,
			lastWin: 0,
			gameHistory: [],
			spinCount: 0,
			autoPlay: false,
			showWinAnimation: false,
		}),

	// Game logic
	getRandomSymbol: () => {
		const { symbolWeights } = get();
		const totalWeight = symbolWeights.reduce(
			(sum, weight) => sum + weight,
			0,
		);
		let random = Math.random() * totalWeight;

		for (let i = 0; i < symbolWeights.length; i++) {
			random -= symbolWeights[i];
			if (random <= 0) return i;
		}
		return 0;
	},

	calculateWin: (reelResults) => {
		const { symbols, payouts, bet } = get();
		const symbolCounts: Record<string, number> = {};

		reelResults.forEach((symbolIndex) => {
			const symbol = symbols[symbolIndex];
			symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
		});

		let totalWin = 0;
		Object.entries(symbolCounts).forEach(([symbol, count]) => {
			if (count >= 2 && payouts[symbol]) {
				totalWin +=
					payouts[symbol][count as keyof (typeof payouts)[string]] *
					bet;
			}
		});

		return totalWin;
	},

	spin: async () => {
		const {
			credits,
			bet,
			isSpinning,
			getRandomSymbol,
			calculateWin,
			deductBet,
			addCredits,
			addGameToHistory,
			symbols,
			setReels,
			setIsSpinning,
			setWinAmount,
			setLastWin,
			setShowWinAnimation,
		} = get();

		if (credits < bet || isSpinning) return;

		setIsSpinning(true);
		deductBet();
		setWinAmount(0);
		setShowWinAnimation(false);

		// Pre-calculate final results to avoid state conflicts
		const finalReels = [
			getRandomSymbol(),
			getRandomSymbol(),
			getRandomSymbol(),
		];

		const spinDurations = [800, 1200, 1600];
		let completedReels = 0;

		// Track animation intervals to clear them properly
		const intervals: number[] = [];

		for (let reel = 0; reel < 3; reel++) {
			const duration = spinDurations[reel];
			
			// Use setInterval for more controlled animation
			const interval = setInterval(() => {
				const currentReels = get().reels;
				const updated = [...currentReels];
				updated[reel] = Math.floor(Math.random() * symbols.length);
				setReels(updated);
			}, 50); // Update every 50ms for smooth animation

			intervals.push(interval);

			// Stop animation for this reel after its duration
			setTimeout(() => {
				clearInterval(interval);
				
				// Set final result for this reel
				const currentReels = get().reels;
				const updated = [...currentReels];
				updated[reel] = finalReels[reel];
				setReels(updated);

				completedReels++;

				// Check if all reels are done
				if (completedReels === 3) {
					// Calculate and apply winnings
					const winnings = calculateWin(finalReels);
					setWinAmount(winnings);
					setLastWin(winnings);

					if (winnings > 0) {
						addCredits(winnings);
						setShowWinAnimation(true);
						setTimeout(() => setShowWinAnimation(false), 2000);
					}

					addGameToHistory({
						spin: get().spinCount + 1,
						bet,
						win: winnings,
						symbols: finalReels.map((i) => symbols[i]),
					});

					setIsSpinning(false);
				}
			}, duration);
		}
	},

	// Computed values
	getRTP: () => {
		const state = get();
		const totalWon = state.gameHistory.reduce(
			(sum, game) => sum + game.win,
			0,
		);
		const totalBet = Math.max(state.gameHistory.length * state.bet, 1);
		return Math.round((totalWon / totalBet) * 100);
	},

	getTotalWon: () => {
		return get().gameHistory.reduce((sum, game) => sum + game.win, 0);
	},

	canSpin: () => {
		const state = get();
		return state.credits >= state.bet && !state.isSpinning;
	},
}));

export default useSlotMachineStore;
