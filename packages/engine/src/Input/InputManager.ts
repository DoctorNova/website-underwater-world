import { globalGraphicSystem } from '@engine/Graphics/GraphicSystem';
import * as THREE from 'three';

/**
 * @file InputManager.ts
 * Manages keyboard and mouse input, providing query functions for key/button states,
 * mouse position conversions (viewport, NDC, world), and a world-space mouse ray.
 * Lifecycle: call `Initialize()`, per-frame call `BeginFrame()` → your logic → `EndFrame()`,
 * and `Shutdown()` to detach listeners and clear state.
 */

/**
 * Supported keyboard keys captured from `KeyboardEvent.key`.
 */
export type InputKey =
  | "Backspace" | "Tab" | "Enter" | "Shift" | "Control" | "Alt" | "Pause" | "CapsLock"
  | "Escape" | " " | "PageUp" | "PageDown" | "End" | "Home"
  | "ArrowLeft" | "ArrowUp" | "ArrowRight" | "ArrowDown"
  | "Insert" | "Delete"
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j"
  | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t"
  | "u" | "v" | "w" | "x" | "y" | "z"
  | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12"
  | "NumLock" | "ScrollLock"
  | "AudioVolumeMute" | "AudioVolumeUp" | "AudioVolumeDown"
  | "MediaTrackNext" | "MediaTrackPrevious" | "MediaStop" | "MediaPlayPause";

/**
 * Mouse button indices matching `MouseEvent.button`.
 */
export enum MouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
  Back = 3,
  Forward = 4,
}

/**
 * Function signature for mouse event callbacks.
 * @param event Mouse event.
 */
export type MouseEventCallback = (event: MouseEvent) => void;

/**
 * Internal per-frame state of a mouse button.
 * - Released: transitioned to up state on this frame and becomes Up in `EndFrame()`.
 * - Pressed: currently pressed.
 * - Up: not pressed.
 * @private
 */
enum MouseButtonState {
  Released,
  Pressed,
  Up,
}

/**
 * Central input manager providing keyboard and mouse state queries.
 * Attach with `Initialize()`. Each frame: call `BeginFrame()` to snapshot scroll,
 * then `EndFrame()` to advance transient states. Detach with `Shutdown()`.
 */
class InputManager {
  /** Per-button transient states for the current frame. */
  private mouseButtonStates: MouseButtonState[] = [
    MouseButtonState.Up, //Left 
    MouseButtonState.Up, //Middle 
    MouseButtonState.Up, //Right 
    MouseButtonState.Up, //Back
    MouseButtonState.Up, //Forward
  ];

  /** Map of pressed state for supported keys. */
  private keyStates: Map<InputKey, boolean> = new Map();

  /** Mouse position in viewport (CSS pixels, top-left origin). */
  private mousePosition = new THREE.Vector2(0, 0);

  private mousePositionDelta = new THREE.Vector2(0, 0);
  private mousePositionDeltaFrame = new THREE.Vector2();

  /** Accumulated scroll deltas since last `BeginFrame()`. */
  private mouseScroll = new THREE.Vector2();

  /** Scroll delta snapshot for the current frame. */
  private mouseScrollFrame = new THREE.Vector2();

  private isMouseHoveringCanvas = false;

  /**
   * Binds event handler methods.
   */
  constructor() {
    this.OnKeydown = this.OnKeydown.bind(this);
    this.OnKeyup = this.OnKeyup.bind(this);
    this.OnMousedown = this.OnMousedown.bind(this);
    this.OnMouseup = this.OnMouseup.bind(this);
    this.OnMouseMove = this.OnMouseMove.bind(this);
    this.OnMouseWheel = this.OnMouseWheel.bind(this);
    this.OnMouseEnter = this.OnMouseEnter.bind(this);
    this.OnMouseLeave = this.OnMouseLeave.bind(this);
  }

  /**
   * Handles `keydown` and marks the key as pressed.
   * @private
   * @param {KeyboardEvent} event Keyboard event.
   */
  private OnKeydown(event: KeyboardEvent) {
    this.keyStates.set(event.key as InputKey, true);
  }

  /**
   * Handles `keyup` and marks the key as released.
   * @private
   * @param {KeyboardEvent} event Keyboard event.
   */
  private OnKeyup(event: KeyboardEvent) {
    this.keyStates.set(event.key as InputKey, false);
  }

  /**
   * Handles `mousedown` and sets button state to Pressed.
   * @private
   * @param {MouseEvent} event Mouse event.
   */
  private OnMousedown(event: MouseEvent) {
    if (event.button < 0 || event.button >= this.mouseButtonStates.length) {
      return;
    }
    this.mouseButtonStates[event.button] = MouseButtonState.Pressed;
  }

  /**
   * Handles `mouseup` and sets button state to Released.
   * @private
   * @param {MouseEvent} event Mouse event.
   */
  private OnMouseup(event: MouseEvent) {
    if (event.button < 0 || event.button >= this.mouseButtonStates.length) {
      return;
    }
    this.mouseButtonStates[event.button] = MouseButtonState.Released;
  }

  /**
   * Handles `mousemove` and updates the viewport-space position.
   * @private
   * @param {MouseEvent} event Mouse event.
   */
  private OnMouseMove(event: MouseEvent) {
    const canvas = globalGraphicSystem.Canvas;
    const relativeX = event.clientX - (canvas?.offsetLeft ?? 0);
    const relativeY = event.clientY - (canvas?.offsetTop ?? 0);

    const change = new THREE.Vector2(relativeX, relativeY).sub(this.mousePosition);
    this.mousePositionDelta.add(change);
    this.mousePosition.set(relativeX, relativeY);
  }

  private OnMouseEnter(_: MouseEvent){
    this.isMouseHoveringCanvas = true;
  }

  private OnMouseLeave(_: MouseEvent){
    this.isMouseHoveringCanvas = false;
  }

  /**
   * Handles `wheel` and accumulates scroll deltas until `BeginFrame()`.
   * @private
   * @param {WheelEvent} event Wheel event.
   */
  private OnMouseWheel(event: WheelEvent) {
    this.mouseScroll.x += event.deltaX;
    this.mouseScroll.y += event.deltaY;
  }

  /**
   * Attaches DOM listeners for keyboard and mouse input.
   */
  Initialize(): void {
    window.addEventListener('keydown', this.OnKeydown);
    window.addEventListener('keyup', this.OnKeyup);
    window.addEventListener('mousedown', this.OnMousedown);
    window.addEventListener('mouseup', this.OnMouseup);
    window.addEventListener('mousemove', this.OnMouseMove);
    window.addEventListener('wheel', this.OnMouseWheel);

    const canvas = globalGraphicSystem.Canvas;
    canvas?.addEventListener('mouseenter', this.OnMouseEnter);
    canvas?.addEventListener('mouseleave', this.OnMouseLeave);
  }

  /**
   * Begins a new frame: snapshots scroll deltas and resets the accumulator.
   */
  BeginFrame(): void {
    this.mouseScrollFrame.copy(this.mouseScroll);
    this.mouseScroll.set(0, 0);

    this.mousePositionDeltaFrame.copy(this.mousePositionDelta);
    this.mousePositionDelta.set(0, 0);
  }

  /**
   * Ends the frame: advances transient button states (Released → Up).
   */
  EndFrame(): void {
    for (let i = 0; i < this.mouseButtonStates.length; i++) {
      if (this.mouseButtonStates[i] === MouseButtonState.Released) {
        this.mouseButtonStates[i] = MouseButtonState.Up;
      }
    }
  }

  /**
   * Detaches listeners and clears input state.
   */
  Shutdown(): void {
    window.removeEventListener('keydown', this.OnKeydown);
    window.removeEventListener('keyup', this.OnKeyup);
    window.removeEventListener('mousedown', this.OnMousedown);
    window.removeEventListener('mouseup', this.OnMouseup);
    window.removeEventListener('mousemove', this.OnMouseMove);
    window.removeEventListener('wheel', this.OnMouseWheel);
    
    const canvas = globalGraphicSystem.Canvas;
    canvas?.removeEventListener('mouseenter', this.OnMouseEnter);
    canvas?.removeEventListener('mouseleave', this.OnMouseLeave);

    this.keyStates.clear();
    this.mouseButtonStates.fill(MouseButtonState.Up);
  }

  /**
   * Checks if the document window is focused.
   * @returns {boolean} True if the window has focus.
   */
  IsWindowFocused(): boolean {
    return document.hasFocus();
  }

  /**
   * Checks if the mouse is over the canvas.
   * @returns {boolean} True if the window has focus.
   */
  IsCanvasHovered(): boolean {
    return this.isMouseHoveringCanvas;
  }

  /**
   * Requests pointer lock on the document body.
   * Note: Typically requires a user gesture in browsers.
   */
  LookPointerToWindow(): void {
    document.body.requestPointerLock();
  }

  /**
   * Convenience check for Control key state.
   * @returns {boolean} True if Control is pressed.
   */
  IsCtrlPressed(): boolean {
    return this.IsKeyPressed("Control");
  }

  /**
   * Convenience check for Shift key state.
   * @returns {boolean} True if Shift is pressed.
   */
  IsShiftPressed(): boolean {
    return this.IsKeyPressed("Shift");
  }

  /**
   * Checks if a specific key is currently pressed.
   * @param {InputKey} key The key to query.
   * @returns {boolean} True if pressed; otherwise false.
   */
  IsKeyPressed(key: InputKey): boolean {
    return this.keyStates.get(key) || false;
  }

  /**
   * Checks if a mouse button is currently pressed.
   * @param {MouseButton} button Mouse button to query.
   * @returns {boolean} True if pressed.
   */
  IsMouseButtonPressed(button: MouseButton): boolean {
    return this.mouseButtonStates[button] === MouseButtonState.Pressed;
  }

  /**
   * Checks if a mouse button was released on this frame.
   * @param {MouseButton} button Mouse button to query.
   * @returns {boolean} True if released this frame (transient).
   */
  IsMouseButtonReleased(button: MouseButton): boolean {
    return this.mouseButtonStates[button] === MouseButtonState.Released;
  }

  /**
   * Gets how much the mouse position changed in this frame, in viewport coordinates (CSS pixels).
   * @returns {THREE.Vector2} Clone of the current change in mouse position.
   */
  GetMousePositionChange(): THREE.Vector2{
    return this.mousePositionDeltaFrame.clone();
  }

  /**
   * Gets the mouse position in viewport coordinates (CSS pixels).
   * @returns {THREE.Vector2} Clone of the current mouse position (top-left origin).
   */
  GetMousePositionInViewport(): THREE.Vector2 {
    return this.mousePosition.clone();
  }

  /**
   * Gets the mouse position in Normalized Device Coordinates (NDC).
   * @returns {THREE.Vector2} NDC vector where X,Y ∈ [-1, 1]. Returns (0,0) if canvas is unavailable.
   */
  GetMousePositionInNDC(): THREE.Vector2 {
    const canvas = globalGraphicSystem.Canvas;

    if (!canvas) {
      return new THREE.Vector2(0, 0);
    }

    // Convert to NDC
    const ndc = new THREE.Vector2(
      (this.mousePosition.x / canvas.clientWidth) * 2 - 1,
      -(this.mousePosition.y / canvas.clientHeight) * 2 + 1
    );

    return ndc;
  }

  /**
   * Projects the mouse position to world space using a camera.
   * @param {THREE.Camera} [camera] Optional camera; defaults to the active camera.
   * @returns {THREE.Vector3} World-space position at z=0.5 along the ray through the mouse NDC.
   */
  GetMousePositionInWorld(camera?: THREE.Camera): THREE.Vector3 {
    if (!camera) {
      camera = globalGraphicSystem.GetActiveCamera();
    }
    const ndc = this.GetMousePositionInNDC();
    // NDC -> World
    const world = new THREE.Vector3(ndc.x, ndc.y, 0.5);
    world.unproject(camera);

    return world;
  }

  /**
   * Computes a world-space ray from the mouse position.
   * @param {THREE.Camera} [camera] Optional camera; defaults to the active camera.
   * @returns {THREE.Ray} Ray starting at the camera origin and passing through the mouse NDC.
   * Returns an empty ray if NDC is zero-length (no canvas or position).
   */
  GetMouseRay(camera?: THREE.Camera): THREE.Ray {
    if (!camera) {
      camera = globalGraphicSystem.GetActiveCamera();
    }

    const ndc = this.GetMousePositionInNDC();

    if (ndc.lengthSq() === 0) {
      return new THREE.Ray();
    }

    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(ndc, camera);

    return rayCaster.ray.clone();
  }

  /**
   * Gets the wheel scroll delta captured for the current frame.
   * @returns {THREE.Vector2} Frame snapshot of scroll deltas since the last `BeginFrame()`.
   */
  GetMouseScroll(): THREE.Vector2 {
    return this.mouseScrollFrame.clone();
  }
}

/**
 * Global singleton instance for input handling.
 */
export const globalInputManager = new InputManager();