import { ArrayContainer } from "@engine/Utility/ArrayContainer";
import type { Component } from "./Component";

export class BaseComponentManager extends ArrayContainer<Component> {

  // NOTE: Components are initialized when their owning GameObject is initialized.
  Initialize() {
    // Initialization logic if needed

  }

  Update(deltaTime: number) {
    for (const component of this.items) {
      if (component.isEnabled){
        component.Update(deltaTime);
      }
    }
  }

  // NOTE: Components are shutdown when their owning GameObject is shutdown.
  Shutdown() {

  }
}

export const globalBaseComponentManager = new BaseComponentManager();