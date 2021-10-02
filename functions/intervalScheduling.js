const mongoose = require("mongoose");
const { Schedule } = require("../database/schedule");

function compareIntervals(a, b) {
    if (a.end < b.end) return -1;
    if (a.end > b.end) return 1;
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    return 0;
}

// Takes an array of jobs sorted by 'end time', and index which we must find predecessor of.
function findLastNonConflict(sortedJobs, idx) {
    let lo = 0;
    let hi = idx - 1;

    // Use binary search
    while (lo <= hi) {
        let mid = Math.floor((lo + hi) / 2);
        if (sortedJobs[mid].end <= sortedJobs[idx].start) {
            if (sortedJobs[mid + 1].end <= sortedJobs[idx].start) {
                lo = mid + 1;
            } else {
                return mid;
            }
        } else {
            hi = mid - 1;
        }
    }
    return -1;
}

function max(a, b) {
    return a > b ? a : b;
}

async function calculateMaxIntervalSum() {
    const intervals = await Schedule.find({});
    if (!intervals || !intervals.length) return;

    intervals.sort(compareIntervals);

    const table = [];
    // table.push(intervals[0].weight);
    table.push({
        predecIndex: -1,
        addMe: true,
        weight: intervals[0].weight,
    });

    // Calculate Max Interval Scheduling, and store DP results in table[]
    for (let i = 1; i < intervals.length; i++) {
        // Find profit including the current job
        let includeWeight = intervals[i].weight;

        // Add previous weight
        let predecIndex = findLastNonConflict(intervals, i);
        if (predecIndex != -1) includeWeight += table[predecIndex].weight;
        if (includeWeight > table[i - 1].weight) {
            table.push({
                predecIndex,
                addMe: true,
                weight: includeWeight,
            });
        } else {
            table.push({
                predecIndex: i - 1,
                addMe: false,
                weight: table[i - 1].weight,
            });
        }
    }

    // Solution (Weight Sum)
    // console.log(table[intervals.length - 1].weight);

    // Solution (Array of Selected Intervals)
    let selected_intervals = [];
    let curr_idx = intervals.length - 1;
    while (curr_idx != -1) {
        if (table[curr_idx].addMe) {
            selected_intervals.unshift(intervals[curr_idx]);
        }
        curr_idx = table[curr_idx].predecIndex;
    }

    console.log(selected_intervals);
    return selected_intervals;
    // console.log('******')
    // console.log(table);
}

module.exports = { calculateMaxIntervalSum };
