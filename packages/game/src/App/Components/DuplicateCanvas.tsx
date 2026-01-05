import {type ComponentProps, type Ref} from "preact";
import {useEffect, useRef} from "preact/hooks";
import {forwardRef} from "preact/compat";

interface DuplicateCanvasProps extends ComponentProps<"canvas"> {
    source: HTMLCanvasElement | undefined | null;
    active?: boolean;
}

function DuplicateCanvasComp({source, active = true, ...props}: DuplicateCanvasProps, ref: Ref<HTMLCanvasElement>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ref) return;

        if (typeof ref === "function") {
            ref(canvasRef.current);
        } else {
            ref.current = canvasRef.current;
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !source || !active) {
            return;
        }

        const previewCtx = canvasRef.current.getContext("2d");
        if (!previewCtx) {
            return;
        }

        let animationFrameId: number;
        let frame = 0;
        const onAnimationFrameUpdate = () => {
            animationFrameId = requestAnimationFrame(onAnimationFrameUpdate);

            if (frame++ % 3 === 0 && canvasRef.current) {
                const ratio = canvasRef.current.height / canvasRef.current.width;

                previewCtx.drawImage(
                    source,
                    0, 0,
                    source.width, source.width * ratio,
                    0, 0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
            }
        }

        onAnimationFrameUpdate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        }
    }, [source, active]);

    return <canvas ref={canvasRef} {...props} />
}

export const DuplicatedCanvas = forwardRef<HTMLCanvasElement, DuplicateCanvasProps>(DuplicateCanvasComp)