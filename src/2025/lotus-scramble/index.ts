import { strict as assert } from 'assert';
import fs from 'fs/promises';
import path from 'path';

const LOWERCASE_A_CHARCODE = 'a'.charCodeAt(0);
const UPPERCASE_A_CHARCODE = 'A'.charCodeAt(0);
const MAX_LOWERCASE_VALUE = 26;
const MAX_UPPERCASE_VALUE = 52;

function mod(n: number, d: number): number {
  return ((n % d) + d) % d;
}

function isUncorrupted(char: string): boolean {
  return /[a-zA-Z]/.test(char);
}

function isLowercase(letter: string): boolean {
  return letter.toLowerCase() === letter;
}

function getTotalOfUncorruptedData(logSheet: string[]): number {
  return logSheet.reduce((acc, letter) => {
    if (!isUncorrupted(letter)) return acc;

    return acc + getValueOfLetter(letter);
  }, 0);
}

function getValueOfLowercaseLetter(letter: string): number {
  assert(isLowercase(letter));

  return letter.charCodeAt(0) - LOWERCASE_A_CHARCODE + 1;
}

function getValueOfUppercaseLetter(letter: string): number {
  assert(!isLowercase(letter));

  return letter.charCodeAt(0) - UPPERCASE_A_CHARCODE + MAX_LOWERCASE_VALUE + 1;
}

function getLetterOfValue(value: number): string {
  assert(value >= 1 && value <= MAX_UPPERCASE_VALUE);

  const letter = String.fromCharCode(
    value > MAX_LOWERCASE_VALUE
      ? value - 1 - MAX_LOWERCASE_VALUE + UPPERCASE_A_CHARCODE
      : value - 1 + LOWERCASE_A_CHARCODE,
  );

  assert(isUncorrupted(letter));

  return letter;
}

function getValueOfLetter(char: string): number {
  assert(isUncorrupted(char));

  const value = isLowercase(char)
    ? getValueOfLowercaseLetter(char)
    : getValueOfUppercaseLetter(char);

  assert(value >= 1 && value <= MAX_UPPERCASE_VALUE);

  return value;
}

function getValueOfCorruptedChar(
  uncorruptedChar: string,
  corruptedChar: string,
): number {
  assert(isUncorrupted(uncorruptedChar));
  assert(!isUncorrupted(corruptedChar));

  const valueOfCorruptedChar = mod(
    getValueOfLetter(uncorruptedChar) * 2 - 5,
    MAX_UPPERCASE_VALUE,
  );

  assert(
    valueOfCorruptedChar >= 1 && valueOfCorruptedChar <= MAX_UPPERCASE_VALUE,
  );

  return valueOfCorruptedChar;
}

function parseInput(input: string): string[] {
  return input.split('');
}

function processPart1(logSheet: string[]): number {
  return logSheet.filter(isUncorrupted).length;
}

function processPart2(logSheet: string[]): number {
  return getTotalOfUncorruptedData(logSheet);
}

function processPart3(logSheet: string[]): number {
  const processedLogSheet = [...logSheet];

  for (let i = 0; i < processedLogSheet.length - 1; ++i) {
    const preceedingChar = processedLogSheet[i];
    const currentChar = processedLogSheet[i + 1];

    assert(preceedingChar);
    assert(currentChar);

    if (isUncorrupted(preceedingChar) && !isUncorrupted(currentChar)) {
      processedLogSheet[i + 1] = getLetterOfValue(
        getValueOfCorruptedChar(preceedingChar, currentChar),
      );
    }
  }

  return getTotalOfUncorruptedData(processedLogSheet);
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
