import {Canvas3D} from "@game/App/Components/Canvas3D.tsx";
import {useRef, useState} from "preact/hooks";
import {Recommendations} from "@game/App/Layout/Content/Recommendations.tsx";
import {HeroSection} from "@game/App/Layout/Content/HeroSection.tsx";
import {Portfolio3dPreview} from "@game/App/Layout/Content/Portfolio3dPreview.tsx";
import {Background} from "@game/App/Layout/Background.tsx";
import {cn} from "@game/App/utils.ts";

export function Content({ runGame, onRunGame }: { runGame: boolean, onRunGame: (enable: boolean) => void}) {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <div className="relative z-10">
            <Canvas3D
                ref={canvasRef}
                className={cn(
                    "absolute top-0 left-0 w-full h-full z-1", // Default styling and styling to apply when the hero section is showing
                    runGame && "w-screen h-screen", // styling to show the game
                )}
                onProgress={setProgress}
                onComplete={() => setLoading(false)}
            />
            <Background className={runGame && "z-0"} />
            <div className={cn(
                "transition-all duration-200 relative z-10 opacity-100", // Default styling and styling to apply when the hero section is showing
                runGame && "opacity-0 pointer-events-none", // styling to hide the hero section so that the game is visible
                runGame && "h-[calc(100vh-12rem)] overflow-hidden" // styling to show the loading bar even if the hero section is hidden
            )}>
                <HeroSection />
                <Recommendations />
            </div>
            <div className={cn("transition-all duration-200 relative z-10 opacity-100", runGame && !loading && "opacity-0 pointer-events-none max-h-48 overflow-hidden")}>
                <Portfolio3dPreview isShowingGame={runGame} gameCanvas={canvasRef.current} progress={progress} isComplete={!loading} onClick={() => {
                    onRunGame(true);
                }} />
            </div>
        </div>
    );
}