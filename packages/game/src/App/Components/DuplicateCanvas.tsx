import { I18nText } from "@game/App/Components/I18nText";
import { type ComponentProps, type Ref } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";

interface DuplicateCanvasProps extends ComponentProps<"canvas"> {
    source: HTMLCanvasElement | undefined | null;
    active?: boolean;
}

function DuplicateCanvasComp({source, active = true, ...props}: DuplicateCanvasProps, ref: Ref<HTMLCanvasElement>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isWebgl2Supported, setIsWebgl2Supported] = useState(true);

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

        const context = source.getContext('webgl2');

        // If Webgl is not supported by the browser then no context -> show error message to the user
        if (!context) {
          setIsWebgl2Supported(false);
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

    if (!isWebgl2Supported){
      return <div className="text-destructive text-center border-destructive rounded-lg w-full h-40 backdrop-blur-2xl bg-gray-900 flex align-center justify-center">
        <div className="self-center">
          <p><I18nText id="no-3d-portfolio"/></p>
          <p><I18nText id="no-web-gl-2"/></p>
        </div>
      </div>
    }

    return <canvas ref={canvasRef} {...props} />
}

export const DuplicatedCanvas = forwardRef<HTMLCanvasElement, DuplicateCanvasProps>(DuplicateCanvasComp)