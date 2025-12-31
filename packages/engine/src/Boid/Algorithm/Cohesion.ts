import * as THREE from "three";
import type {BoidAgent} from "@engine/Boid/BoidAgent.ts";

const maxForce = 0.05;

export class CohesionCalculator {
    protected center = new THREE.Vector3(0, 0);
    private total = 0;
    private self: BoidAgent;

    constructor(self: BoidAgent) {
        this.self = self;
    }

    Evaluate(other: BoidAgent) {
        this.center.add(other.position);
        this.total++;
    }

    CalculateResult(coefficient: number) {
        if (this.total == 0) {
            return new THREE.Vector3(0, 0, 0);
        }

        const steering = this.center
            .divideScalar(this.total)
            .sub(this.self.position)
            .normalize()
            .sub(this.self.direction);

        if (steering.lengthSq() > maxForce * maxForce) {
            return steering.normalize().multiplyScalar(maxForce * coefficient);
        }

        return steering.multiplyScalar(coefficient);
    }
}