import { cn } from "@game/App/utils";
import { type ComponentChild } from "preact";
import "./dotNavigation.css";

const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PRIMARY_COLOR = "#f59e0b";

interface DotNavigationProps {
  count: number;
  activeIndex: number;
  duration: number; // ms
  pause: boolean;
  onAnimationEnd?: (index: number) => void;
  onClick?: (index: number) => void;
}

export function DotNavigation({
  count,
  activeIndex,
  duration,
  pause,
  onAnimationEnd,
  onClick
}: DotNavigationProps) {
  const listOfDots: ComponentChild[] = [];

  for (let index = 0; index < count; index++) {
    const isActive = index === activeIndex;

    listOfDots.push(
      <div key={index} className={cn("relative w-6 h-6 flex items-center justify-center cursor-pointer group rounded-md", !isActive && "hover:bg-white/10 hover:backdrop-blur-md hover:border hover:border-white/30")} onClick={() => onClick?.(index)}>
        {/* Outer pulsing ring */}
        {isActive && (
          <div
            className="absolute w-5 h-5 rounded-full bg-orange-500/30 animate-ping [@media(hover:none)]:hidden"
            style={{ animationDuration: `${duration}ms` }}
          />
        )}

        {/* Progress ring */}
        {isActive && (
          <svg
            key={activeIndex} // forces animation restart
            className="absolute w-full h-full -rotate-90 [@media(hover:none)]:hidden"
            viewBox="0 0 32 32"
            onAnimationEnd={() => {
              onAnimationEnd?.(index);
            }}
          >
            <circle
              cx="16"
              cy="16"
              r={RADIUS}
              fill="none"
              stroke="rgba(255, 208, 53, 0.336)"
              strokeWidth="2"
            />
            <circle
              cx="16"
              cy="16"
              r={RADIUS}
              fill="none"
              stroke={PRIMARY_COLOR}
              strokeWidth="2"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              strokeLinecap="round"
              style={{
                "--circumference": CIRCUMFERENCE,
                animation: `dot-progress ${duration}ms linear forwards`,
                animationPlayState: pause ? 'paused' : 'running',
              }}
            />
          </svg>
        )}

        {/* Center dot */}
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive
            ? "bg-primary scale-125"
            : "bg-white/40 group-hover:bg-primary"
            }`}
        />
      </div>
    );
  }

  return <div className="flex justify-center items-center gap-2">{listOfDots}</div>;
}
