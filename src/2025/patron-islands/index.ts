import { strict as assert } from 'assert';
import fs from 'fs/promises';
import path from 'path';

interface Point {
  x: number;
  y: number;
}

const STARTING_POINT: Point = { x: 0, y: 0 };

function isSamePoint(pointA: Point, pointB: Point): boolean {
  return pointA.x === pointB.x && pointA.y === pointB.y;
}

function stringifyPoint(point: Point) {
  return `${point.x}, ${point.y}`;
}

function findClosestPoint(referencePoint: Point, points: Point[]): Point {
  assert(points.length > 0);
  assert(points[0]);

  let minDistance = Infinity;
  let closestPoint = points[0];

  for (const point of points) {
    const distance = getManhattanDistance(referencePoint, point);

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  }

  assert(closestPoint);

  return closestPoint;
}

function findFarthestPoint(referencePoint: Point, points: Point[]): Point {
  assert(points.length > 0);
  assert(points[0]);

  let maxDistance = -Infinity;
  let farthestPoint = points[0];

  for (const point of points) {
    const distance = getManhattanDistance(referencePoint, point);

    if (distance > maxDistance) {
      maxDistance = distance;
      farthestPoint = point;
    }
  }

  assert(farthestPoint);

  return farthestPoint;
}

function getManhattanDistance(pointA: Point, pointB: Point): number {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

function processPart1(points: Point[]): number {
  assert(points.length > 0);
  const minDistance = getManhattanDistance(
    STARTING_POINT,
    findClosestPoint(STARTING_POINT, points),
  );
  const maxDistance = getManhattanDistance(
    STARTING_POINT,
    findFarthestPoint(STARTING_POINT, points),
  );

  return maxDistance - minDistance;
}

function processPart2(points: Point[]): number {
  const referencePoint = findClosestPoint(STARTING_POINT, points);
  const closestToReferencePoint = findClosestPoint(
    referencePoint,
    points.filter((point) => !isSamePoint(point, referencePoint)),
  );

  return getManhattanDistance(referencePoint, closestToReferencePoint);
}

function processPart3(points: Point[]): number {
  let totalDistance = 0;
  let referencePoint = STARTING_POINT;

  const visitedPoints = new Set<string>();

  while (visitedPoints.size < points.length) {
    const closestPoint = findClosestPoint(
      referencePoint,
      points.filter((point) => !visitedPoints.has(stringifyPoint(point))),
    );
    visitedPoints.add(stringifyPoint(closestPoint));

    totalDistance += getManhattanDistance(referencePoint, closestPoint);
    referencePoint = closestPoint;
  }

  return totalDistance;
}

function parseInput(input: string): Point[] {
  const lines = input.split('\n');

  return lines.map<Point>((line) => {
    const [xStr, yStr] = line.replace(/[()]/g, '').split(', ');

    assert(xStr !== undefined);
    assert(yStr !== undefined);

    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);

    assert(!Number.isNaN(x));
    assert(!Number.isNaN(y));

    return { x, y };
  });
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
    short,
    long,
  });
}

void main();
