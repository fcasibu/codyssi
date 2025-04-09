import { strict as assert } from 'assert';
import fs from 'fs/promises';
import path from 'path';

type ParsedFunction = { identifier: string; value: bigint };

const MAX_CLIENT_FEE = 15_000_000_000_000n;

function execute(accumulator: bigint, parsedFunction: ParsedFunction): bigint {
  const { identifier, value } = parsedFunction;

  switch (identifier) {
    case 'A':
      return accumulator + value;
    case 'B':
      return accumulator * value;
    case 'C':
      return accumulator ** value;
    default:
      throw new Error(`Unknown identifier ${identifier}`);
  }
}

function calculatePrice(quality: bigint, functions: ParsedFunction[]) {
  return functions.reduceRight<bigint>(execute, quality);
}

function processPart1(
  functions: { identifier: string; value: bigint }[],
  numbers: bigint[],
): bigint {
  const median = numbers[Math.floor(numbers.length / 2)];
  assert(median);

  return calculatePrice(median, functions);
}

function processPart2(functions: ParsedFunction[], numbers: bigint[]): bigint {
  const sumOfEvenNumberedRooms = numbers
    .filter((number) => number % 2n === 0n)
    .reduce((acc, num) => acc + num, 0n);

  return calculatePrice(sumOfEvenNumberedRooms, functions);
}

function searchForHighestQualityRoom(
  numbers: bigint[],
  functions: ParsedFunction[],
): bigint {
  let left = 0;
  let right = numbers.length - 1;
  let best = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const currentTarget = numbers[mid];
    assert(currentTarget);

    const price = calculatePrice(currentTarget, functions);

    if (price <= MAX_CLIENT_FEE) {
      best = mid;
      left = mid + 1;
    } else if (price > MAX_CLIENT_FEE) {
      right = mid - 1;
    }
  }

  return numbers[best] ?? 0n;
}

function processPart3(functions: ParsedFunction[], numbers: bigint[]): bigint {
  return searchForHighestQualityRoom(numbers, functions);
}

function parseInput(input: string): {
  functions: ParsedFunction[];
  numbers: bigint[];
} {
  const [functions, numbers] = input.split('\n\n');

  assert(functions);
  assert(numbers);

  const parsedFunctions = functions.split('\n').map((item) => {
    const [left, right] = item.split(': ');
    assert(left);
    assert(right);

    const identifier = left.split(/\s/)[1];
    const match = right.match(/\d+/);
    assert(identifier);
    assert(match?.[0]);

    const parsedValue = BigInt(match[0]);

    assert(!Number.isNaN(parsedValue));

    return { identifier, value: parsedValue };
  });

  return {
    functions: parsedFunctions,
    numbers: numbers.split('\n').map(BigInt).sort(),
  };
}

async function processFile(file: string) {
  const input = (await fs.readFile(path.join(__dirname, file), 'utf8')).trim();
  const { functions, numbers } = parseInput(input);

  return {
    part1: processPart1(functions, numbers),
    part2: processPart2(functions, numbers),
    part3: processPart3(functions, numbers),
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
