import React from 'react';

interface StageProps extends React.HTMLAttributes<{}> {
    canvas: React.RefObject<HTMLCanvasElement>;
}

export const Stage = ({
    canvas,
    className,
}: StageProps) => {
    return (
        <>
            <div className={className}>
                <canvas ref={canvas}></canvas>
            </div>
        </>
    );
};
