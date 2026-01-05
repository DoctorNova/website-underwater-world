// Blurred ocean blue background with gradient effect
import {cn} from "@game/App/utils.ts";

const blurOrbs = [
    { top: '15%', left: '25%', color: 'bg-blue-500/15' },
    { top: '25%', left: '50%', color: 'bg-indigo-500/5' },
    { top: '40%', left: '75%', color: 'bg-emerald-500/10' },
    { top: '60%', left: '33%', color: 'bg-blue-400/10' },
    { top: '80%', left: '67%', color: 'bg-cyan-400/10' },
    { top: '95%', left: '16%', color: 'bg-purple-500/10' },
];

export function Background({className}: {className?: string | false}) {
    return (
        <div className={cn("absolute inset-0 bg-linear-to-br from-[#0A1929]/90 via-[#0d2438]/90 to-[#132f4c]/80 z-1", className)}>
            <div className="absolute top-0 left-0 w-full h-full">
                {blurOrbs.map((orb, index) => (
                    <div
                        key={index}
                        className={`absolute w-96 h-96 ${orb.color} rounded-full blur-3xl`}
                        style={{
                            top: orb.top,
                            left: orb.left,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}