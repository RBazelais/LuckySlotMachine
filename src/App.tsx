import React, { useState } from 'react';

const SlotMachine = () => {
	const [credits, setCredits] = useState(1000);
	const [bet, setBet] = useState(10);

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

		{/* Main Game Container */}
		<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
			{/* Credits & Bet Controls */}
			<div className="flex justify-between items-center mb-6">
			<div className="flex items-center space-x-4">
				<div className="bg-green-600 px-4 py-2 rounded-lg">
				<span className="text-white font-bold">Credits: ${credits}</span>
				</div>
				<div className="bg-blue-600 px-4 py-2 rounded-lg">
				<span className="text-white font-bold">Bet: ${bet}</span>
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<button
				onClick={() => setBet(Math.max(1, bet - 5))}
				className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
				>
				-$5
				</button>
				<button
				onClick={() => setBet(Math.min(100, bet + 5))}
				className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
				>
				+$5
				</button>
			</div>
			</div>

			{/* Placeholder for slot machine */}
			<div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl mb-6">
			<div className="bg-black p-4 rounded-lg">
				<div className="flex justify-center space-x-4">
				<div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl">
					🍒
				</div>
				<div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl">
					🍋
				</div>
				<div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl">
					🍊
				</div>
				</div>
			</div>
			</div>

			{/* Placeholder for controls */}
			<div className="flex justify-center">
			<button className="bg-gray-600 text-white px-8 py-3 rounded-lg font-bold text-lg">
				SPIN (Coming Soon)
			</button>
			</div>
		</div>
		</div>
	</div>
	);
};

export default SlotMachine;
