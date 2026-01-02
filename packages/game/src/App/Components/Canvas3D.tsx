import { useEffect, useRef } from "preact/hooks";

type Canvas3DProps = {
    onProgress: (progress: number) => void;
    onComplete: () => void;
    className?: string;
};

export function Canvas3D({ onProgress, onComplete, className }: Canvas3DProps ) {
    const containerRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<any>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

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
