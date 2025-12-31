import type {SceneRoot} from "@engine/Composition/SceneRoot.ts";
import {CreateShadowDemoScene, UpdateShadowDemoScene} from "./ShadowDemo.ts";
import {CreateTestDemo, UpdateTestDemoScene} from "./TestDemo.ts";
import {CreateGameScene} from "@game/CreateGameScene.ts";

export interface Demo {
    Create: (scene: SceneRoot) => void;
    Update: () => void;
}

export const demos: Demo[] = [
    {
        Create: CreateGameScene,
        Update: () => {},
    },{
        Create: CreateShadowDemoScene,
        Update: UpdateShadowDemoScene,
    },{
        Create: CreateTestDemo,
        Update: UpdateTestDemoScene,
    }
];

