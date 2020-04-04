import {
    HistogramData,
    Imgstry,
} from 'imgstry';
import {
    useEffect,
    useRef,
    useState,
} from 'react';

export const useImgstry = () => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [ imgstry, setImgstry ] = useState<Imgstry>();
    const [ histogram, setHistogram ] = useState<HistogramData>({
        all: [],
        channel: {
            red: [],
            green: [],
            blue: [],
        },
    });

    useEffect(() => {
        if (!canvas?.current) { throw new Error('Canvas was not initialized on mount.'); }

        const renderer = new Imgstry(canvas.current);

        setImgstry(renderer);

        const histogramHandle = renderer.histogram$.subscribe(setHistogram);

        return () => {
            renderer.dispose();
            histogramHandle.unsubscribe();
        };
    }, []);

    return {
        canvas,
        imgstry,
        histogram,
    };
};