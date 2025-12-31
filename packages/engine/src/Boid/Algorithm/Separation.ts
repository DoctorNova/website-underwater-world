import { MathUtils, Vector3 } from "three";
import type {BoidAgent} from "@engine/Boid/BoidAgent.ts";

export class SeparationCalculator {
  private steering = new Vector3(0, 0);
  private self: BoidAgent;
  private collisionDistanceSq: number;
  private total = 0;

  constructor(self: BoidAgent, collisionDistanceSq: number) {
    this.self = self;
    this.collisionDistanceSq = collisionDistanceSq;
  }

  Evaluate(other: BoidAgent) {
    const diff = this.self.position.clone().sub(other.position);
    const distanceSq = diff.lengthSq();

    if (distanceSq > this.collisionDistanceSq) {
      return;
    }
    
    // If two agents are on top of each other then move into a random direction
    if (distanceSq  == 0) {
      diff.randomDirection();
    }

    const weight = MathUtils.clamp(1 - (distanceSq / this.collisionDistanceSq), 0, 1);
    diff.normalize();
    diff.multiplyScalar(weight);
    this.steering.add(diff);
    this.total++;
  }

  CalculateResult(coefficient: number) {
    if (this.steering.lengthSq() == 0) {
      return new Vector3(0, 0, 0);
    }

    return this.steering.multiplyScalar(coefficient / this.total);
  }
}