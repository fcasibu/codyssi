import { strict as assert } from 'assert';
import fs from 'fs/promises';
import path from 'path';

type Pile = [number, number][];
type Inventory = Pile[];

function parseInput(input: string): Inventory {
  return input.split('\n').map((line) => {
    const ranges = line.split(' ');

    assert(ranges.length === 2);

    return ranges.map((range) => {
      const [a, b] = range.split('-').map(Number);

      assert(typeof a === 'number' && !Number.isNaN(a));
      assert(typeof b === 'number' && !Number.isNaN(b));

      return [a, b];
    });
  });
}

function getTotalUniqueBoxes(pile: Pile): number {
  const sortedPile = pile.toSorted((a, b) => a[0] - b[0]);
  const mergedIntervals: Pile = [];
  let [currentBoxMin, currentBoxMax] = sortedPile[0] as [number, number];

  assert(typeof currentBoxMin === 'number');
  assert(typeof currentBoxMax === 'number');

  for (let i = 1; i < sortedPile.length; ++i) {
    const [nextBoxMin, nextBoxMax] = sortedPile[i] as [number, number];

    assert(typeof nextBoxMin === 'number');
    assert(typeof nextBoxMax === 'number');

    if (nextBoxMin <= currentBoxMax) {
      currentBoxMax = Math.max(currentBoxMax, nextBoxMax);
    } else if (nextBoxMin > currentBoxMax) {
      mergedIntervals.push([currentBoxMin, currentBoxMax]);

      [currentBoxMin, currentBoxMax] = [nextBoxMin, nextBoxMax];
    }
  }

  mergedIntervals.push([currentBoxMin, currentBoxMax]);

  return mergedIntervals.reduce((acc, [min, max]) => {
    return acc + (max - min) + 1;
  }, 0);
}

function getCombinedAdjacentPiles(inventory: Inventory): Pile[] {
  const pairs: Pile[] = [];

  for (let i = 0; i < inventory.length; ++i) {
    pairs.push(inventory.slice(i, i + 2).flat());
  }

  return pairs;
}

function processPart1(inventory: Inventory): number {
  return inventory.flat().reduce((acc, boxes) => {
    const [boxA, boxB] = boxes;

    assert(boxB >= boxA);

    return acc + (boxB - boxA) + 1;
  }, 0);
}

function processPart2(inventory: Inventory): number {
  return inventory.reduce((acc, pile) => acc + getTotalUniqueBoxes(pile), 0);
}

function processPart3(inventory: Inventory): number {
  return getCombinedAdjacentPiles(inventory).reduce((acc, pile) => {
    const totalUniqueBoxesInPile = getTotalUniqueBoxes(pile);
    return acc > totalUniqueBoxesInPile ? acc : totalUniqueBoxesInPile;
  }, 0);
}

async function processFile(file: string) {
  const input = (await fs.readFile(path.join(__dirname, file), 'utf8')).trim();

  const parsedInput = parseInput(input);

  return {
    part1: processPart1(parsedInput),
    part2: processPart2(parsedInput),
    part3: processPart3(parsedInput),
  };
}

async function main() {
  const [short, long] = await Promise.all([
    processFile('short.txt'),
    processFile('long.txt'),
  ]);

  console.log({
    long,
    short,
  });
}

void main();
