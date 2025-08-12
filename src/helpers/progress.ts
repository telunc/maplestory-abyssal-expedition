import { Member } from "src/models/member";
import { levels } from "./levels";
import { ranks } from "./ranks";
import { Rank } from "src/models/rank";
import { recruits } from "./recruits";

const getSumMemberlevels = (members: Member[]) => {
    return members.reduce((carry, member) => {
        let currLevel = 1;
        for (let level of levels) {
            if (member.time >= level.time) {
                currLevel = level.level;
            }
        }
        return carry += currLevel;
    }, 0);
}

export const getProgress = (rankName: string, reputation: number, hasRecruited: boolean, totalTimeUsedToday: number, members: Member[]) => {
    const days = [];
    members = members.map(m => {
        m.time = +m.time;
        return m;
    });
    let i = 1;
    let hasRankedUp = false;
    while (getSumMemberlevels(members) < 220) {
        const day: any = {
            day: i,
            messages: []
        };

        let rank: Rank = ranks.find(r => r.rank === rankName) as Rank;

        while (totalTimeUsedToday < rank.time) {
            // Check if we can rank up
            const sumMemberLevels = getSumMemberlevels(members);
            if (reputation >= rank.requiredReputation && rank.requiredLevel <= sumMemberLevels && rankName !== 'Master III' && !hasRankedUp) {
                reputation -= rank.requiredReputation;
                const nextRank = ranks[ranks.indexOf(rank) + 1];
                rank = nextRank;
                rankName = nextRank.rank;
                day.messages.push(`Rank up to ${rank.rank}`);
                hasRankedUp = true;
            }

            // Check if we can recruit
            if (rank.maxMercenaries > members.length && members.length < recruits.length && !hasRecruited) {
                const nextRecruits = recruits[members.length];
                // Check if we have enough reputation to recruit
                if (reputation >= nextRecruits.cost) {
                    reputation -= nextRecruits.cost;
                    members.push({
                        name: nextRecruits.name,
                        time: 0
                    });
                    day.messages.push(`Recruit ${nextRecruits.name}`);
                    hasRecruited = true;
                }
            }

            // Next recruit
            let timeUntilNextRecruit = Infinity;
            if (rank.maxMercenaries > members.length && members.length < recruits.length && !hasRecruited) {
                const nextRecruits = recruits[members.length];
                const reputationNeeded = nextRecruits.cost - reputation;
                // Every 15 seconds for 1 reputation
                timeUntilNextRecruit = reputationNeeded * 15 / 60;
            }

            // Next rank up
            const sortedMembers = members.sort((a, b) => a.time - b.time);
            let timeUntilNextRankUp = (rank.requiredReputation - reputation) * 15 / 60;
            if (timeUntilNextRankUp <= 0) {
                // Has enough reputation to rank up
                // Check levels
                const newMembers = structuredClone(sortedMembers);
                let time = 1;
                while (rank.requiredLevel > getSumMemberlevels(newMembers)) {
                    time++;
                    for (let member of newMembers.slice(0, rank.mercenaries)) {
                        member.time++;
                    }
                    if (time > rank.time) {
                        break;
                    }
                }
                timeUntilNextRankUp = time;
            } else {
                // Don't have enough reputation. Check if after waiting, we will have enough reputation and levels
                const newMembers = structuredClone(sortedMembers);
                for (let member of newMembers.slice(0, rank.mercenaries)) {
                    member.time+= timeUntilNextRankUp;
                }
                if (rank.requiredLevel > getSumMemberlevels(newMembers)) {
                    timeUntilNextRankUp = Infinity;
                }
            }
            // Can't level up after max
            // Can rank up once for a day
            if (rankName === 'Master III' || hasRankedUp) {
                timeUntilNextRankUp = Infinity;
            }

            // Next max level
            const maxTime = levels[levels.length - 1].time;
            let timeUntilNextMaxLevel = Infinity;
            const trainingMembers = sortedMembers.slice(0, rank.mercenaries);
            for (let member of trainingMembers.filter(m => m.time < maxTime)) {
                timeUntilNextMaxLevel = Math.min(timeUntilNextMaxLevel, maxTime - member.time);
            }
            if (sortedMembers[rank.mercenaries]?.time === maxTime) {
                timeUntilNextMaxLevel = Infinity;
            }
            const trainingTime = Math.min(timeUntilNextRecruit, timeUntilNextRankUp, timeUntilNextMaxLevel, rank.time - totalTimeUsedToday);
            day.messages.push(`Train ${trainingMembers.map(m => m.name).join(', ')} for ${Math.ceil(trainingTime)} minutes`);
            totalTimeUsedToday += trainingTime;
            for (let member of trainingMembers) {
                member.time = Math.min(member.time + trainingTime, maxTime);
            }
            if (trainingTime == timeUntilNextMaxLevel) {
                day.messages.push('Swap max level member');
            }
            reputation += trainingTime * 4;
        }

        day.rank = rankName;
        day.reputation = reputation;
        day.totalTimeUsedToday = totalTimeUsedToday;
        day.totalLevel = getSumMemberlevels(members);
        console.log('Rank', rankName);
        console.log('Reputation', reputation);
        console.log('Total time', totalTimeUsedToday);
        console.log('Total level:', getSumMemberlevels(members));
        console.log(structuredClone(members));
        hasRecruited = false;
        hasRankedUp = false;
        totalTimeUsedToday = 0;
        i++;
        days.push(day);
    }

    return days;
}
