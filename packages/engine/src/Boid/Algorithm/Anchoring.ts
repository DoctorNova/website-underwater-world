import * as THREE from "three";
import type {BoidAgent} from "@engine/Boid/BoidAgent.ts";

export function KeepAgentCloseToAnchoringPoint(anchorPoint: THREE.Vector3, agent: BoidAgent, visualRangeSq: number, coefficient: number) {
  if (coefficient == 0)
    return new THREE.Vector3(0, 0, 0);

  const anchorDirection = anchorPoint.clone().sub(agent.position);
  const anchorDistance = anchorDirection.lengthSq();
  if (anchorDistance != 0) {
    const weight = anchorDistance / visualRangeSq;
    anchorDirection.normalize().multiplyScalar(coefficient).multiplyScalar(weight);
  }
  
  return anchorDirection;
}