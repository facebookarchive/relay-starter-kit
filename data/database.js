/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * database.js
 */

// Model types
export class Game{}
export class HidingSpot {}

const NUMBER_OF_TURNS = 3;

// Mock data
let game = new Game();
game.id = '1';

var hidingSpots = [];
(function() {
    var hidingSpot;
    var indexOfSpotWithTreasure = Math.floor(Math.random() *9);

    for (var i = 0; i < 9; i++) {
        hidingSpot = new HidingSpot();
        hidingSpot.id = `${i}`;
        hidingSpot.hasBeenChecked = false;
        hidingSpot.hasTreasure = (i === indexOfSpotWithTreasure);

        hidingSpots.push(hidingSpot);
    }
})();

let turnsRemaining = 3;

export function checkHidingSpotForTreasure(id) {
    if (hidingSpots.some(hs => hs.hasTreasure && hs.hasBeenChecked)) {
        return;
    }

    var hidingSpot = getHidingSpot(id);
    hidingSpot.hasBeenChecked = true;
    turnsRemaining--;
}

export function getHidingSpot(id) {
    return hidingSpots.find(hs => hs.id === id);
}

export function getGame() { return game; }
export function getHidingSpots() { return hidingSpots; }
export function getTurnsRemaining() { return turnsRemaining; }

