// Blurred ocean blue background with gradient effect
import {cn} from "@game/App/utils.ts";

export function Background({className}: {className?: string | false}) {
    return (
        <div className={cn("absolute inset-0 bg-linear-to-br from-[#0A1929]/90 via-[#0d2438]/90 to-[#132f4c]/80 z-1", className)}>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}