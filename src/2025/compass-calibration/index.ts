import { strict as assert } from 'assert';
import fs from 'fs/promises';
import path from 'path';

function parseInput(input: string): { symbols: string[]; digits: string[] } {
  const lines = input.split('\n');
  const symbols = lines.at(-1)?.split('') ?? [];
  const digits = lines.slice(0, -1);

  return {
    symbols,
    digits,
  };
}

function calculateResult(symbols: string[], digits: string[]) {
  let result = parseInt(digits[0] ?? '0', 10);

  for (let i = 0; i < symbols.length; ++i) {
    const digit = digits[i + 1];
    const symbol = symbols[i];

    if (!digit) break;

    const parsedDigit = parseInt(digit, 10);

    assert(!Number.isNaN(parsedDigit));

    if (symbol === '+') {
      result += parsedDigit;
    } else if (symbol === '-') {
      result -= parsedDigit;
    }
  }

  return result;
}

function concatenateAdjacentPairs(digits: string[]) {
  let pairs: string[] = [];
  for (let i = 0; i < digits.length; i += 2) {
    const pairOne = digits[i];
    const pairTwo = digits[i + 1] ?? '';

    pairs.push(pairOne + pairTwo);
  }

  return pairs;
}

async function processFile(file: string): Promise<number> {
  const input = (await fs.readFile(path.join(__dirname, file), 'utf8')).trim();

  const { symbols, digits } = parseInput(input);

  return calculateResult(
    symbols.toReversed(),
    concatenateAdjacentPairs(digits),
  );
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
