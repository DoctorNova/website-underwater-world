import type {BoidMovementComponent} from "@engine/Boid/BoidMovement.ts";
import {RemoveItemFromArray} from "@engine/Utility/ArrayUtils.ts";
import * as THREE from "three";

export type BoidAgentsEvents = {
    AddedAgent: {
        agent: BoidMovementComponent;
    },
    RemovedAgent: {
        agent: BoidMovementComponent;
    }
};

class BoidAgentsManager extends THREE.EventDispatcher<BoidAgentsEvents> {
    public agents = new Array<BoidMovementComponent>();

    public Add(component: BoidMovementComponent){
        this.agents.push(component);
        this.dispatchEvent({
            type: "AddedAgent",
            agent: component
        });
    }

    public Remove(component: BoidMovementComponent){
        RemoveItemFromArray(this.agents, component);
        this.dispatchEvent({
            type: "RemovedAgent",
            agent: component
        });
    }

    public Initialize() {

    }

    public Update(deltaTime: number) {
        for(const agent of this.agents){
            agent.Update(deltaTime);
        }
    }

    public Shutdown() {
        this.agents = [];
    }
}

export const globalBoidAgentsManager = new BoidAgentsManager();