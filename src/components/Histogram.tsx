import './Histogram.css';
import {
    HistogramData,
    clearCanvas,
    drawHistogram,
} from 'imgstry';
import React, {
    useEffect,
    useRef,
} from 'react';

interface HistogramProps {
    histogram: HistogramData;
}

export const Histogram = ({ histogram }: HistogramProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) { return; }
        const canvas = canvasRef.current;
        clearCanvas(canvas);
        drawHistogram(canvas, histogram.all, 'rgba(236, 240, 241, 1)');
        drawHistogram(canvas, histogram.channel.red, 'rgba(231, 76, 60, 1)');
        drawHistogram(canvas, histogram.channel.green, 'rgba(39, 174, 96, 1)');
        drawHistogram(canvas, histogram.channel.blue, 'rgba(41, 128, 185, 1)');
    }, [ histogram ]);

    return (
        <>
            <canvas
                className="imgstry-histogram"
                height={150}
                ref={canvasRef} />
        </>
    );
};