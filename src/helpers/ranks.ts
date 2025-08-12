import { Rank } from "src/models/rank";

export const ranks: Rank[] = [
    {
        rank: "Beginner",
        time: 120,
        reputation: 480,
        mercenaries: 1,
        maxMercenaries: 2,
        requiredLevel: 10,
        requiredReputation: 100
    },
    {
        rank: "Junior",
        time: 180,
        reputation: 720,
        mercenaries: 2,
        maxMercenaries: 5,
        requiredLevel: 20,
        requiredReputation: 500,
    },
    {
        rank: "Senior I",
        time: 240,
        reputation: 960,
        mercenaries: 3,
        maxMercenaries: 10,
        requiredLevel: 35,
        requiredReputation: 1000
    },
    {
        rank: "Senior II",
        time: 300,
        reputation: 1200,
        mercenaries: 3,
        maxMercenaries: 10,
        requiredLevel: 50,
        requiredReputation: 1500
    },
    {
        rank: "Senior III",
        time: 360,
        reputation: 1440,
        mercenaries: 3,
        maxMercenaries: 10,
        requiredLevel: 70,
        requiredReputation: 2000
    },
    {
        rank: "Veteran I",
        time: 420,
        reputation: 1680,
        mercenaries: 4,
        maxMercenaries: 15,
        requiredLevel: 90,
        requiredReputation: 2000
    },
    {
        rank: "Veteran II",
        time: 480,
        reputation: 1920,
        mercenaries: 4,
        maxMercenaries: 15,
        requiredLevel: 115,
        requiredReputation: 2000
    },
    {
        rank: "Veteran III",
        time: 540,
        reputation: 2160,
        mercenaries: 4,
        maxMercenaries: 20,
        requiredLevel: 140,
        requiredReputation: 3000
    },
    {
        rank: "Master I",
        time: 600,
        reputation: 2400,
        mercenaries: 5,
        maxMercenaries: 20,
        requiredLevel: 170,
        requiredReputation: 3000
    },
    {
        rank: "Master II",
        time: 660,
        reputation: 2640,
        mercenaries: 5,
        maxMercenaries: 25,
        requiredLevel: 200,
        requiredReputation: 3000
    },
    {
        rank: "Master III",
        time: 720,
        reputation: 2880,
        maxMercenaries: 25,
        mercenaries: 5,
        requiredLevel: 0,
        requiredReputation: 0
    }
];