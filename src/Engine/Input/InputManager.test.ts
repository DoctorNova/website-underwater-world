import { globalGraphicSystem } from 'Graphics/GraphicSystem';
import * as THREE from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { globalInputManager } from './InputManager';

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
    expect(globalInputManager.IsMouseButtonPressed('Left')).toBe(true);

    window.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
    expect(globalInputManager.IsMouseButtonPressed('Left')).toBe(false);
  });

  it('ignores unknown mouse buttons', () => {
    window.dispatchEvent(new MouseEvent('mousedown', { button: 99 }));
    expect(globalInputManager.IsMouseButtonPressed('Left')).toBe(false);
    expect(globalInputManager.IsMouseButtonPressed('Right')).toBe(false);
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

  it('registers and unregisters mouse click callbacks', () => {
    const callback = vi.fn();

    globalInputManager.OnMouseClick(callback);
    window.dispatchEvent(new MouseEvent('click'));
    expect(callback).toHaveBeenCalledOnce();

    globalInputManager.OffMouseClick(callback);
    window.dispatchEvent(new MouseEvent('click'));
    expect(callback).toHaveBeenCalledOnce(); // unchanged
  });

  it('returns (0,0) world position when canvas is missing', () => {
    const worldPos = globalInputManager.GetMousePositionInWorld();
    expect(worldPos.x).toBe(0);
    expect(worldPos.y).toBe(0);
  });

  it('converts mouse position to normalized device coordinates', () => {
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 400,
      clientY: 300,
    }));

    globalGraphicSystem.AddCamera(new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000));
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
    expect(globalInputManager.IsMouseButtonPressed('Left')).toBe(false);
  });
});
