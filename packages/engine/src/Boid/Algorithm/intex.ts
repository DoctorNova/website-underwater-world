import {Vector3} from "three";
import {AlignmentCalculator} from "./Alignment";
import {KeepAgentCloseToAnchoringPoint} from "./Anchoring";
import {CohesionCalculator} from "./Cohesion";
import {SeparationCalculator} from "./Separation";
import type {BoidAgent} from "@engine/Boid/BoidAgent.ts";

const DefaultBoidSettings = {
    coefficient: {
        alignment: 1,
        cohersion: 1,
        separation: 1,
        anchor: 1,
    },
    anchorPoint: {
        position: new Vector3(0, 0, 0),
        radius: 20,
    },
    collisionRange: 2,
    visualRange: 10,
}

function IsInVisualRange(visualRangeSq: number, self: BoidAgent, other: BoidAgent) {
    const distanceSq = self.position.distanceToSquared(other.position);
    return distanceSq < visualRangeSq;
}

function Steer(settings: typeof DefaultBoidSettings, agent: BoidAgent) {
    const visualRangeSq = settings.visualRange * settings.visualRange;
    const alignment = new AlignmentCalculator(agent, visualRangeSq);
    const cohersion = new CohesionCalculator(agent);
    const separation = new SeparationCalculator(agent, settings.collisionRange * settings.collisionRange);

    agent.others.forEach(other => {
        if (other != agent && IsInVisualRange(visualRangeSq, agent, other)) {
            alignment.Evaluate(other);
            cohersion.Evaluate(other);
            separation.Evaluate(other);
        }
    });

    const anchoringComponent = KeepAgentCloseToAnchoringPoint(settings.anchorPoint.position, agent, settings.anchorPoint.radius * settings.anchorPoint.radius, settings.coefficient.anchor);
    const alignmentComponent = alignment.CalculateResult(settings.coefficient.alignment)
    const cohersionComponent = cohersion.CalculateResult(settings.coefficient.cohersion)
    const separationComponent = separation.CalculateResult(settings.coefficient.separation);

    agent.desiredDirection
        .set(0, 0, 0)
        .add(anchoringComponent)
        .add(alignmentComponent)
        .add(cohersionComponent)
        .add(separationComponent)
        .normalize();
}

export const BoidAlgorithm = {
    DefaultBoidSettings,
    Steer,
}