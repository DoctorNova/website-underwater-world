import { useEffect, useState } from "preact/hooks";

export function useIsWebGL2Supported(canvas: HTMLCanvasElement | undefined | null) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (canvas) {
      const context = canvas.getContext("webgl2");
      setIsSupported(Boolean(context));
    }
  }, [canvas])

  return { isSupported };
}