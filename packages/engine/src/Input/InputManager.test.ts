import { globalGraphicSystem } from '@engine/Graphics/GraphicSystem';
import * as THREE from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { globalInputManager, MouseButton } from './InputManager';
import {CameraComponent} from "@engine/Graphics/CameraComponent.ts";
import type {GameObject} from "@engine/Composition/GameObject.ts";

describe('InputManager', () => {
  beforeEach(() => {
    globalInputManager.Initialize();
  });

  afterEach(() => {
    globalInputManager.Shutdown();
    vi.restoreAllMocks();
  });

  it('tracks keydown and keyup events', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(globalInputManager.IsKeyPressed('a')).toBe(true);

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(globalInputManager.IsKeyPressed('a')).toBe(false);
  });

  it('tracks mouse button presses', () => {
    window.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
    expect(globalInputManager.IsMouseButtonPressed(MouseButton.Left)).toBe(true);

    window.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
    expect(globalInputManager.IsMouseButtonPressed(MouseButton.Left)).toBe(false);
  });

  it('ignores unknown mouse buttons', () => {
    window.dispatchEvent(new MouseEvent('mousedown', { button: 99 }));
    expect(globalInputManager.IsMouseButtonPressed(MouseButton.Left)).toBe(false);
    expect(globalInputManager.IsMouseButtonPressed(MouseButton.Right)).toBe(false);
  });

  it('updates mouse position on mousemove', () => {
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 123,
      clientY: 456,
    }));

    const pos = globalInputManager.GetMousePositionInViewport();
    expect(pos.x).toBe(123);
    expect(pos.y).toBe(456);
  });

  it('returns cloned mouse position (immutability)', () => {
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 20,
    }));

    const pos = globalInputManager.GetMousePositionInViewport();
    pos.set(999, 999);

    const original = globalInputManager.GetMousePositionInViewport();
    expect(original.x).toBe(10);
    expect(original.y).toBe(20);
  });
  
  it('converts mouse position to normalized device coordinates', () => {
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 400,
      clientY: 300,
    }));

    const cameraComponent = new CameraComponent({} as unknown as GameObject, new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000), true, []);

    globalGraphicSystem.AddCamera(true, cameraComponent);
    const camera = globalGraphicSystem.GetActiveCamera();
    const ndc = globalInputManager.GetMousePositionInWorld(camera);

    // center of screen → approx (0,0)
    expect(Math.abs(ndc.x)).toBeLessThan(0.001);
    expect(Math.abs(ndc.y)).toBeLessThan(0.001);
  });

  it('clears state on shutdown', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    window.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));

    globalInputManager.Shutdown();

    expect(globalInputManager.IsKeyPressed('w')).toBe(false);
    expect(globalInputManager.IsMouseButtonPressed(MouseButton.Left)).toBe(false);
  });
});
