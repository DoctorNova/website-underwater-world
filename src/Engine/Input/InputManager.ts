import { globalGraphicSystem } from 'Graphics/GraphicSystem';
import * as THREE from 'three';

export type InputKey =
  | "Backspace" | "Tab" | "Enter" | "Shift" | "Control" | "Alt" | "Pause" | "CapsLock"
  | "Escape" | " " | "PageUp" | "PageDown" | "End" | "Home"
  | "ArrowLeft" | "ArrowUp" | "ArrowRight" | "ArrowDown"
  | "Insert" | "Delete"
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"
  | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t"
  | "u" | "v" | "w" | "x" | "y" | "z"
  | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9"
  | "F10" | "F11" | "F12"
  | "NumLock" | "ScrollLock"
  | "AudioVolumeMute" | "AudioVolumeUp" | "AudioVolumeDown"
  | "MediaTrackNext" | "MediaTrackPrevious" | "MediaStop" | "MediaPlayPause";

export type MouseButton = 'Left' | 'Middle' | 'Right' | 'Back' | 'Forward';

export type MouseEventCallback = (event: MouseEvent) => void;

class InputManager {
  private mouseButtonMapping: MouseButton[] = ['Left', 'Middle', 'Right', 'Back', 'Forward'];
  private keyStates: Map<InputKey, boolean> = new Map();
  private mouseButtonStates: Map<MouseButton, boolean> = new Map();
  private mousePosition: THREE.Vector2 = new THREE.Vector2(0, 0);

  constructor() {
    this.OnKeydown = this.OnKeydown.bind(this);
    this.OnKeyup = this.OnKeyup.bind(this);
    this.OnMousedown = this.OnMousedown.bind(this);
    this.OnMouseup = this.OnMouseup.bind(this);
    this.OnMouseMove = this.OnMouseMove.bind(this);
  }

  private OnKeydown(event: KeyboardEvent) {
    this.keyStates.set(event.key as InputKey, true);
  }

  private OnKeyup(event: KeyboardEvent) {
    this.keyStates.set(event.key as InputKey, false);
  }

  private OnMousedown(event: MouseEvent) {
    const button = this.GetMouseButton(event.button);
    if (button) {
      this.mouseButtonStates.set(button, true);
    }
  }

  private OnMouseup(event: MouseEvent) {
    const button = this.GetMouseButton(event.button);
    if (button) {
      this.mouseButtonStates.set(button, false);
    }
  }

  private OnMouseMove(event: MouseEvent) {
    this.mousePosition.set(event.clientX, event.clientY);
  }

  private GetMouseButton(button: number) {
    if (button >= 0 && button < this.mouseButtonMapping.length) {
      return this.mouseButtonMapping[button];
    }
    return null;
  }

  Initialize(): void {
    window.addEventListener('keydown', this.OnKeydown);
    window.addEventListener('keyup', this.OnKeyup);
    window.addEventListener('mousedown', this.OnMousedown);
    window.addEventListener('mouseup', this.OnMouseup);
    window.addEventListener('mousemove', this.OnMouseMove);
  }

  Shutdown(): void {
    window.removeEventListener('keydown', this.OnKeydown);
    window.removeEventListener('keyup', this.OnKeyup);
    window.removeEventListener('mousedown', this.OnMousedown);
    window.removeEventListener('mouseup', this.OnMouseup);
    window.removeEventListener('mousemove', this.OnMouseMove);

    this.keyStates.clear();
    this.mouseButtonStates.clear();
  }

  IsKeyPressed(key: InputKey): boolean {
    return this.keyStates.get(key) || false;
  }

  IsMouseButtonPressed(button: MouseButton): boolean {
    return this.mouseButtonStates.get(button) || false;
  }

  OnMouseClick(callback: MouseEventCallback): void {
    window.addEventListener('click', callback);
  }

  OffMouseClick(callback: MouseEventCallback): void {
    window.removeEventListener('click', callback);
  }

  GetMousePositionInViewport(): THREE.Vector2 {
    return this.mousePosition.clone();
  }

  GetMousePositionInWorld(camera?: THREE.Camera): THREE.Vector2 {
    const canvas = globalGraphicSystem.Canvas;

    if (!canvas) {
      return new THREE.Vector2(0, 0);
    }

    if (!camera) {
      camera = globalGraphicSystem.GetActiveCamera();
    }

    const mouse = new THREE.Vector2();
    mouse.x = (this.mousePosition.x / canvas.clientWidth) * 2 - 1;  // -1 to 1
    mouse.y = -(this.mousePosition.y / canvas.clientHeight) * 2 + 1; // -1 to 1 (note the minus!)

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5); // z=0 is near, z=1 is far
    vector.unproject(camera); // Converts from NDC to world coordinates

    return mouse;
  }
}

export const globalInputManager = new InputManager();

