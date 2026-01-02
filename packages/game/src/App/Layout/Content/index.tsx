import {Canvas3D} from "@game/App/Components/Canvas3D.tsx";
import {useState} from "preact/hooks";
import {Recommendations} from "@game/App/Layout/Content/Recommendations.tsx";
import {HeroSection} from "@game/App/Layout/Content/HeroSection.tsx";
import {GameLoadingBar} from "@game/App/Layout/Content/GameLoadingBar.tsx";
import {Background} from "@game/App/Layout/Background.tsx";

export function Content() {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative z-10">
            <Canvas3D
                className={"absolute top-0 left-0 w-full h-full z-0"}
                onProgress={setProgress}
                onComplete={() => setLoading(false)}
            />
            <Background zIndex={1}/>
            <HeroSection />
            <Recommendations />
            <GameLoadingBar progress={progress} visible={loading}  />
        </div>
    );
}