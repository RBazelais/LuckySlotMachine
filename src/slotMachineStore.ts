import { create } from "zustand";

interface GameResult {
	spin: number;
	bet: number;
	win: number;
	symbols: string[];
}

interface SlotMachineStore {
	credits: number;
	bet: number;
	reels: number[];
	isSpinning: boolean;
	winAmount: number;
	lastWin: number;
	gameHistory: GameResult[];
	spinCount: number;
	autoPlay: boolean;
	autoPlayDelay: number;
	showWinAnimation: boolean;
	spinningReels: boolean[];

	symbols: string[];
	symbolWeights: number[];
	payouts: Record<string, { 2: number; 3: number }>;

	setCredits: (credits: number) => void;
	setBet: (bet: number) => void;
	setReels: (reels: number[]) => void;
	setIsSpinning: (isSpinning: boolean) => void;
	setWinAmount: (winAmount: number) => void;
	setLastWin: (lastWin: number) => void;
	setGameHistory: (gameHistory: GameResult[]) => void;
	setSpinCount: (spinCount: number) => void;
	setAutoPlay: (autoPlay: boolean) => void;
	setAutoPlayDelay: (delay: number) => void;
	setShowWinAnimation: (showWinAnimation: boolean) => void;
	setSpinningReel: (index: number, spinning: boolean) => void;

	adjustBet: (amount: number) => void;
	addCredits: (amount: number) => void;
	deductBet: () => void;
	addGameToHistory: (gameData: GameResult) => void;
	resetGame: () => void;

	getRandomSymbol: () => number;
	calculateWin: (reelResults: number[]) => number;
	spin: () => Promise<void>;

	getRTP: () => number;
	getTotalWon: () => number;
	canSpin: () => boolean;
}

const useSlotMachineStore = create<SlotMachineStore>((set, get) => ({
	credits: 1000,
	bet: 10,
	reels: [0, 0, 0],
	isSpinning: false,
	winAmount: 0,
	lastWin: 0,
	gameHistory: [],
	spinCount: 0,
	autoPlay: false,
	autoPlayDelay: 2000,
	showWinAnimation: false,
	spinningReels: [false, false, false],

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

	setCredits: (credits) => set({ credits }),
	setBet: (bet) => set({ bet }),
	setReels: (reels) => set({ reels }),
	setIsSpinning: (isSpinning) => set({ isSpinning }),
	setWinAmount: (winAmount) => set({ winAmount }),
	setLastWin: (lastWin) => set({ lastWin }),
	setGameHistory: (gameHistory) => set({ gameHistory }),
	setSpinCount: (spinCount) => set({ spinCount }),
	setAutoPlay: (autoPlay) => set({ autoPlay }),
	setAutoPlayDelay: (delay) => set({ autoPlayDelay: delay }),
	setShowWinAnimation: (showWinAnimation) => set({ showWinAnimation }),
	setSpinningReel: (index, spinning) =>
		set((state) => {
			const updated = [...state.spinningReels];
			updated[index] = spinning;
			return { spinningReels: updated };
		}),

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
			spinningReels: [false, false, false],
		}),

	getRandomSymbol: () => {
		const { symbolWeights } = get();
		const totalWeight = symbolWeights.reduce((sum, w) => sum + w, 0);
		let random = Math.random() * totalWeight;
		for (let i = 0; i < symbolWeights.length; i++) {
			random -= symbolWeights[i];
			if (random <= 0) return i;
		}
		return 0;
	},

	calculateWin: (reelResults) => {
		const { symbols, payouts, bet } = get();
		const counts: Record<string, number> = {};
		reelResults.forEach((ri) => {
			const s = symbols[ri];
			counts[s] = (counts[s] || 0) + 1;
		});
		let total = 0;
		Object.entries(counts).forEach(([symbol, count]) => {
			if (count >= 2 && payouts[symbol]) {
				total += payouts[symbol][count as keyof (typeof payouts)[string]] * get().bet;
			}
		});
		return total;
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
			setSpinningReel,
		} = get();

		if (credits < bet || isSpinning) return;

		setIsSpinning(true);
		deductBet();
		setWinAmount(0);
		setShowWinAnimation(false);

		const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
		const spinDurations = [800, 1200, 1600];

		for (let reel = 0; reel < 3; reel++) {
			const duration = spinDurations[reel];
			setSpinningReel(reel, true);

			const interval = setInterval(() => {
				const current = get().reels;
				const updated = [...current];
				updated[reel] = Math.floor(Math.random() * symbols.length);
				setReels(updated);
			}, 50);

			await new Promise<void>((resolve) => {
				setTimeout(() => {
					clearInterval(interval as unknown as number);
					const current = get().reels;
					const updated = [...current];
					updated[reel] = finalReels[reel];
					setReels(updated);
					setSpinningReel(reel, false);
					resolve();
				}, duration);
			});
		}

		const winnings = calculateWin(finalReels);
		setWinAmount(winnings);
		if (winnings > 0) {
			setLastWin(winnings);
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
	},

	getRTP: () => {
		const state = get();
		const totalWon = state.gameHistory.reduce((s, g) => s + g.win, 0);
		const totalBet = Math.max(state.gameHistory.length * state.bet, 1);
		return Math.round((totalWon / totalBet) * 100);
	},

	getTotalWon: () => get().gameHistory.reduce((sum, g) => sum + g.win, 0),

	canSpin: () => {
		const s = get();
		return s.credits >= s.bet && !s.isSpinning;
	},
}));

export default useSlotMachineStore;
