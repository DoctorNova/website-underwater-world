import type {BoidMovementComponent} from "@engine/Boid/BoidMovement.ts";
import {RemoveItemFromArray} from "@engine/Utility/ArrayUtils.ts";

class BoidAgentsManager {
    public agents = new Array<BoidMovementComponent>();

    public Add(component: BoidMovementComponent){
        this.agents.push(component);
    }

    public Remove(component: BoidMovementComponent){
        RemoveItemFromArray(this.agents, component);
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