import * as THREE from 'three';

export interface BoidAgentConfig {
    maxSpeed: number;
}

export interface BoidAgent {
    desiredDirection: THREE.Vector3;
    position: THREE.Vector3;
    direction: THREE.Vector3;
    others: BoidAgent[];
}