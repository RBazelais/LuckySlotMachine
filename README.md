# Web Development Project - *Lucky Slots*

## React + TypeScript + Tailwind + Vite

Made by: **[Rachel Bazelais]**

This web app: **Experience the thrill of a premium casino slot machine!**

## Required Features

The following **required** functionality is completed:

- [X] **Interactive slot machine with spinning reels and realistic animation**
  - Three spinning reels with staggered timing for authentic casino experience
  - Smooth animations with visual feedback during spins
  - Animated symbols that bounce and pulse during gameplay
- [X] **Credit system with betting mechanics**
  - Players start with $1000 in credits
  - Adjustable bet amounts from $1 to $100 in $5 increments
  - Credits are deducted on each spin and added back on wins
- [X] **Comprehensive payout system with multiple winning combinations**
  - 8 different symbols with varying rarity and payout rates
  - Weighted probability system for realistic casino odds
  - Two-of-a-kind and three-of-a-kind winning combinations
- [x] **Advanced game controls and automation**
  - Manual spin functionality with visual state feedback
  - Auto-play feature with automatic stopping when credits run low
  - Game reset functionality to start fresh
- [X] **Detailed game statistics and history tracking**
  - Real-time tracking of total spins, last win amount, and total winnings
  - Return-to-Player (RTP) percentage calculation
  - Recent games history showing last 8 spins with symbols and results

The following **optional** features are implemented:

- [X] **Premium visual design with gradient backgrounds and animations**
  - Modern gradient color scheme with purple, blue, and gold accents
  - Responsive design that works on desktop and mobile devices
  - Win animations with pulsing effects and celebratory messaging
- [X] **Interactive paytable showing current bet multipliers**
  - Side panel displaying all symbol payouts adjusted for current bet
  - Clear visual hierarchy with symbol icons and payout values
- [X] **Comprehensive game history with detailed statistics**
  - Scrollable history panel showing recent game results
  - Visual representation of winning/losing spins
  - Color-coded win/loss indicators

## Video Walkthrough

Here's a walkthrough of implemented user stories:

![Video Walkthrough](.src/assets/LuckSlotsV4.gif "Video Walkthrough")

GIF created with LICECap

## Technical Implementation

### Key Components

- **Weighted Random System**: Realistic probability distribution for symbols
- **Async Animation System**: Staggered reel stopping for authentic feel
- **State Management**: Efficient React hooks for game state
- **Responsive Design**: Tailwind CSS for mobile-friendly interface

### Symbol Probability Distribution

- 🍒 (25%) - Common fruit, low payout
- 🍋 (20%) - Common fruit, low payout  
- 🍊 (18%) - Common fruit, medium payout
- 🍇 (15%) - Uncommon fruit, medium payout
- ⭐ (12%) - Star symbol, high payout
- 💎 (5%) - Diamond, very high payout
- 🔔 (3%) - Bell, premium payout
- 7️⃣ (2%) - Lucky seven, jackpot symbol

## Notes

Challenges encountered while building the app:

- Implementing realistic slot machine timing with staggered reel stops
- Creating smooth animations while maintaining performance
- Balancing game mechanics for engaging but fair gameplay
- Managing complex state interactions between spinning, betting, and scoring systems
- Ensuring responsive design works across different screen sizes

## License

MIT License

Copyright (c) 2025 Rachel Bazelais

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
