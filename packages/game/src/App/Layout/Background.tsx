// Blurred ocean blue background with gradient effect
export function Background({ zIndex }: { zIndex: number }) {
    return (
        <div className={`absolute inset-0 bg-linear-to-br from-[#0A1929] via-[#0d2438ec] to-[#132f4cf3]" z-${zIndex}`}>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}