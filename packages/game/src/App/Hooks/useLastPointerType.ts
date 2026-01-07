import { useEffect, useState } from "preact/hooks";

export function useLastPointerType() {
  const [pointerType, setPointerType] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: PointerEvent) => setPointerType(e.pointerType);
    window.addEventListener("pointerdown", handler, { passive: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  return {
    pointerType,
    isMouse: pointerType === "mouse",
  };
}
