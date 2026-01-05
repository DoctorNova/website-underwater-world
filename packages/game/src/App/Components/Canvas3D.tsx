import { useEffect, useRef } from "preact/hooks";
import {forwardRef} from "preact/compat";
import type {Ref} from "preact";

type Canvas3DProps = {
    onProgress: (progress: number) => void;
    onComplete: () => void;
    className?: string;
};

function Canvas3DComp({ onProgress, onComplete, className }: Canvas3DProps, ref: Ref<HTMLCanvasElement> ) {
    const containerRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<any>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        if (!ref) return;

        if (typeof ref === "function") {
            ref(containerRef.current);
        } else {
            ref.current = containerRef.current;
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function LoadAndRunGame() {
            if (!containerRef.current) return;

            const { GameApplication } = await import("@game/Three/Game.ts");
            if (cancelled) return;

            const app = new GameApplication(containerRef.current, {
                onProgress: (_url, itemsLoaded: number, itemsTotal: number) => {
                    onProgress(itemsLoaded / itemsTotal);
                },
                onSuccess: onComplete,
                onError: onComplete,
            });
            app.Initialize();
            app.GameLoop();
            appRef.current = app;

            resizeObserverRef.current = new ResizeObserver(() => {
                app.Resize();
            });

            resizeObserverRef.current.observe(containerRef.current);
        }

        LoadAndRunGame();

        return () => {
            cancelled = true;

            resizeObserverRef.current?.disconnect();
            resizeObserverRef.current = null;

            appRef.current?.Shutdown();
            appRef.current = null;
        };
    }, []);

    return (
        <canvas ref={containerRef} className={className}></canvas>
    );
}

export const Canvas3D = forwardRef<HTMLCanvasElement, Canvas3DProps>(Canvas3DComp);