import {Component} from "@engine/Composition/Component.ts";
import {type BoidAgentsEvents, globalBoidAgentsManager} from "@engine/Boid/BoidAgentsManager.ts";
import * as THREE from "three";
import type {BoidAgent, BoidAgentConfig} from "@engine/Boid/BoidAgent.ts";
import type {GameObject} from "@engine/Composition/GameObject.ts";
import {BoidAlgorithm} from "@engine/Boid/Algorithm/intex.ts";
import {RemoveItemFromArray} from "@engine/Utility/ArrayUtils.ts";

export class BoidMovementComponent extends Component implements BoidAgent {
    public desiredDirection = new THREE.Vector3().randomDirection();
    protected currentDirection = this.desiredDirection.clone();
    protected agentConfig: BoidAgentConfig;

    public others: BoidAgent[] = [];

    get direction(): THREE.Vector3 {
        return this.currentDirection.clone();
    }

    get position(): THREE.Vector3 {
        return this.owner.position;
    }

    constructor(owner: GameObject, config: BoidAgentConfig) {
        super(owner);
        this.agentConfig = config;

        this.AddAgentToOthers = this.AddAgentToOthers.bind(this);
        this.RemoveAgentFromOthers = this.RemoveAgentFromOthers.bind(this);
    }

    Initialize(): void {
        this.desiredDirection = new THREE.Vector3().randomDirection();
        this.currentDirection = this.desiredDirection.clone();

        globalBoidAgentsManager.addEventListener("AddedAgent",this.AddAgentToOthers);
        globalBoidAgentsManager.addEventListener("RemovedAgent",this.RemoveAgentFromOthers);
    }

    AddAgentToOthers(event: BoidAgentsEvents["RemovedAgent"]): void {
        if (event.agent == this){
            return;
        }

        for(const agent of this.others) {
            if (agent == event.agent){
                return;
            }
        }

        this.others.push(event.agent);
    }

    RemoveAgentFromOthers(event: BoidAgentsEvents["RemovedAgent"]): void {
        if (event.agent == this){
            return;
        }

        RemoveItemFromArray(this.others, event.agent);
    }

    Shutdown(): void {
        globalBoidAgentsManager.removeEventListener("AddedAgent",this.AddAgentToOthers);
        globalBoidAgentsManager.removeEventListener("RemovedAgent",this.RemoveAgentFromOthers);
    }

    Update(deltaTime: number): void {
        // Rotate agent into the direction he is moving
        if (this.currentDirection.lengthSq() != 0) {
            this.owner.transform.lookAt(this.owner.transform.position.clone().add(this.currentDirection));
        }

        BoidAlgorithm.Steer(BoidAlgorithm.DefaultBoidSettings, this);

        // Change current velocity to the new velocity
        this.currentDirection.lerp(this.desiredDirection, deltaTime).normalize();

        const velocity = this.currentDirection.clone().multiplyScalar(this.agentConfig.maxSpeed * deltaTime);

        // If the owning gameobject has a parent than simply addition to the position of the Object3D is not enough
        if (!(this.owner.transform.parent instanceof THREE.Scene) && this.owner.transform.parent != null) {
            throw new Error("Boid agents cannot have a parent");
        }
        this.owner.transform.position.add(velocity);

    }

    AddToSystem() {
        globalBoidAgentsManager.Add(this);
    }

    RemoveFromSystem() {
        globalBoidAgentsManager.Remove(this);
    }
}