import './ImgstryEditor.css';
import { FilterPane } from '../components/FilterPane';
import { Imgstry } from 'imgstry';
import { Stage } from '../components/Stage';
import { useImgstry } from '../hooks';
import React, { useEffect } from 'react';

interface ImgstryEditorProps {
    src: string;
}

export const ImgstryEditor = ({ src } : ImgstryEditorProps) => {
    const {
        canvas,
        imgstry,
        histogram,
    } = useImgstry();

    useEffect(() => {
        (async () => {
            if (!imgstry) { return; }
            imgstry?.drawImage(await Imgstry.loadImage(src));
        })();
    }, [ src, imgstry ]);

    return (
        <>
            <Stage
                className="imgstry-stage"
                canvas={canvas} />
            <FilterPane
                className="imgstry-filter-pane"
                imgstry={imgstry}
                histogram={histogram} />
        </>
    );
};
