import * as THREE from "three";
import type {BoidAgent} from "@engine/Boid/BoidAgent.ts";

export class AlignmentCalculator {
  private steering = new THREE.Vector3(0, 0);
  private self: BoidAgent;
  private visualDistanceSq = 0;
  private total = 0;

  constructor(self: BoidAgent, visualDistanceSq: number) {
    this.visualDistanceSq = visualDistanceSq;
    this.self = self;
  }

  Evaluate(other: BoidAgent) {
    const distanceSq = this.self.position.distanceToSquared(other.position);
    const weight = THREE.MathUtils.clamp(1 - (distanceSq / this.visualDistanceSq), 0, 1);
    this.steering.add(other.direction.clone().multiplyScalar(weight));
    if (weight > 0) {
      this.total++;
    }
  }

  CalculateResult(coefficient: number) {
    if (this.steering.lengthSq() == 0) {
      return this.steering;
    }

    return this.steering.multiplyScalar(coefficient / this.total);
  }
}

