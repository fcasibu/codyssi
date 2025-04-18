import { strict as assert } from 'assert';
import fs from 'fs/promises';
import path from 'path';

function getCharacterMemoryUnit(char: string): number {
  const charCode = char.charCodeAt(0);
  const isNumber =
    charCode >= '0'.charCodeAt(0) && charCode <= '9'.charCodeAt(0);

  if (isNumber) return parseInt(char, 10);

  assert(charCode <= 'Z'.charCodeAt(0) && charCode >= 'A'.charCodeAt(0));

  return charCode - 'A'.charCodeAt(0) + 1;
}

function compressAnchorCount(line: string): string {
  const numberOfCharsToKeepAtEachEnd = Math.floor(line.length / 10);

  const startSlice = line.slice(0, numberOfCharsToKeepAtEachEnd);
  const endSlice = line.slice(-numberOfCharsToKeepAtEachEnd);
  const remaining = line.length - (startSlice.length + endSlice.length);

  assert(remaining >= 0);

  return `${startSlice}${remaining}${endSlice}`;
}

function compressRLE(line: string): string {
  let start = 0;
  let compressed = '';

  while (start < line.length) {
    const char = line[start];
    let end = start;

    while (line[end] === char) {
      end += 1;
    }

    compressed += `${end - start}${char}`;
    start = end;
  }

  return compressed;
}

function compress(type: 'rle' | 'anchor', line: string): string {
  switch (type) {
    case 'rle':
      return compressRLE(line);
    case 'anchor':
      return compressAnchorCount(line);
    default:
      throw new Error(`Unknown compression type: ${type}`);
  }
}

function getTotalMemoryUnitsOfLine(
  line: string,
  compress: (line: string) => string = (line: string) => line,
): number {
  return compress(line)
    .split('')
    .reduce((acc, char) => acc + getCharacterMemoryUnit(char), 0);
}

function processLines(lines: string[], compress?: (line: string) => string) {
  return lines.reduce(
    (totalMemoryUnits, line) =>
      totalMemoryUnits + getTotalMemoryUnitsOfLine(line, compress),
    0,
  );
}

function processPart1(lines: string[]): number {
  return processLines(lines);
}

function processPart2(lines: string[]): number {
  return processLines(lines, (line: string) => compress('anchor', line));
}

function processPart3(lines: string[]): number {
  return processLines(lines, (line: string) => compress('rle', line));
}

function parseInput(input: string): string[] {
  const lines = input.split('\n');

  return lines;
}

async function processFile(file: string) {
  const input = (await fs.readFile(path.join(__dirname, file), 'utf8')).trim();
  const lines = parseInput(input);

  return {
    part1: processPart1(lines),
    part2: processPart2(lines),
    part3: processPart3(lines),
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
