// Type definitions for player and positions
type Player = {
    name: string;
    positions: ("C" | "LW" | "RW" | "W" | "F" | "D" | "F/D" | "G")[];
    averagePoints: number; // New field for average points scored
};

type Roster = {
    C: (Player | null)[];
    LW: (Player | null)[];
    RW: (Player | null)[];
    F: (Player | null)[];
    D: (Player | null)[];
    "F/D": (Player | null)[];
    G: (Player | null)[];
};

// Initialize roster with null values
const initializeRoster = (): Roster => ({
    C: [null, null],
    LW: [null, null],
    RW: [null, null],
    F: [null],
    D: [null, null, null, null],
    "F/D": [null],
    G: [null, null]
});

// Function to check if a player can fit in a specific position
const canFitInPosition = (player: Player, position: keyof Roster): boolean => {
    if (position === "C" || position === "LW" || position === "RW" || position === "D" || position === "G") {
        return player.positions.includes(position);
    }
    if (position === "F") {
        return player.positions.includes("C") || player.positions.includes("LW") || player.positions.includes("RW") || player.positions.includes("F") || player.positions.includes("W");
    }
    if (position === "F/D") {
        return player.positions.includes("C") || player.positions.includes("LW") || player.positions.includes("RW") || player.positions.includes("F") || player.positions.includes("D") || player.positions.includes("W");
    }
    return false;
};

// 0-1 Knapsack-based function to fill the roster
const fillRosterKnapsack = (players: Player[]): Roster => {
    const roster = initializeRoster();
    const usedPlayers = new Set<string>();

    // Define a priority order for positions
    // TODO: Maybe sort this from low to high on number of available positions at each spot
    // TODO: Maybe we just test all six permutations of C/RW/LW since the rest don't matter
    // TODO: We could likely generalize this for all sports?
    const positionOrder: (keyof Roster)[] = ["C", "RW", "LW", "F", "D", "F/D", "G"];

    // Create a utility score for each player and position based on average points
    const calculateUtility = (player: Player, position: keyof Roster): number => {
        return canFitInPosition(player, position) ? player.averagePoints : 0;
    };

    // Try to fill each position in order, ensuring no player is used twice
    positionOrder.forEach(position => {
        const slots = roster[position];

        for (let i = 0; i < slots.length; i++) {
            let bestPlayer: Player | null = null;
            let bestUtility = 0;

            for (const player of players) {
                if (!usedPlayers.has(player.name) && canFitInPosition(player, position)) {
                    const utility = calculateUtility(player, position);
                    if (utility > bestUtility) {
                        bestPlayer = player;
                        bestUtility = utility;
                    }
                }
            }

            if (bestPlayer) {
                slots[i] = bestPlayer;
                usedPlayers.add(bestPlayer.name);
            }
        }
    });

    return roster;
};

// Example players
const players: Player[] = [
    { name: "Macklin Celebrini", positions: ["C"], averagePoints: 4.8 },
    { name: "Wyatt Johnson", positions: ["C", "RW"], averagePoints: 3.5 },
    { name: "Jared McCann", positions: ["C", "LW"], averagePoints: 3.6 },
    { name: "Chris Kreider", positions: ["LW"], averagePoints: 3.4 },
    { name: "Mikko Rantanen", positions: ["RW"], averagePoints: 6.1 },
    { name: "Sam Reinhart", positions: ["C", "RW"], averagePoints: 5.9 },
    { name: "Matt Duchene", positions: ["C", "RW"], averagePoints: 3.9 },
    { name: "Noah Hanifin", positions: ["D"], averagePoints: 2.9 },
    { name: "Miro Heiskanen", positions: ["D"], averagePoints: 2.9 },
    { name: "Nick Seeler", positions: ["D"], averagePoints: 2.8 },
    { name: "Thomas Harley", positions: ["D"], averagePoints: 2.6 },
    { name: "Brayden Point", positions: ["C"], averagePoints: 6.3 },
    { name: "Kevin Lankinen", positions: ["G"], averagePoints: 0.01 },
    { name: "Darcy Kuemper", positions: ["G"], averagePoints: 0.01 },
    { name: "Aliaksei Protas", positions: ["C"], averagePoints: 3.6 },
    { name: "Ryan Donato", positions: ["C"], averagePoints: 0.01 },
    { name: "Taylor Hall", positions: ["LW"], averagePoints: 0.01 },
    { name: "Jake Neighbours", positions: ["RW"], averagePoints: 0.01 }
];

// Fill the roster and log the result
const filledRoster = fillRosterKnapsack(players);
const filledRosterPoints = Object.values(filledRoster).flat().reduce((acc, val) => acc + (val?.averagePoints || 0), 0);
console.log({filledRoster, points: filledRosterPoints.toFixed(2)});
