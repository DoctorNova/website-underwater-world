import { CreateGameObject } from "@engine/Composition";
import type { SceneRoot } from "@engine/Composition/SceneObject";
import { globalGraphicSystem } from "@engine/Graphics/GraphicSystem";
import { CreateGameScene } from "@game/CreateGameScene";
import { CameraControlComponent } from "./Components/CameraControlComponent";

export function CreateEditorScene(scene: SceneRoot) {
  CreateGameScene(scene);

  CreateGameObject({
    parent: scene, 
    componentsToCreate: [
      [CameraControlComponent, [globalGraphicSystem.GetActiveCamera()]],
    ]
  });
}