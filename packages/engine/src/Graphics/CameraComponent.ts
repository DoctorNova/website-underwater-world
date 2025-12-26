import {Component} from "@engine/Composition/Component.ts";
import {globalGraphicSystem} from "@engine/Graphics/GraphicSystem.ts";
import * as THREE from "three";
import type {SceneRoot} from "@engine/Composition/SceneRoot.ts";
import type {GameObject} from "@engine/Composition/GameObject.ts";

export class CameraComponent extends Component {

    constructor(owner: GameObject, public camera: THREE.Camera, public isMainCamera: boolean, public scenes: SceneRoot[]) {
        super(owner);
    }

    Initialize(): void {

    }
    Shutdown(): void {
        // Clear scene references to allow garbage collection
        this.scenes = [];
    }
    Update(_: number): void {
        // Note: Update is never called by the graphic system
    }

    AddToSystem() {
        globalGraphicSystem.AddCamera(this.isMainCamera, this);
    }

    RemoveFromSystem() {
        globalGraphicSystem.RemoveCamera(this);
    }

}