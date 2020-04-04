import './FilterPane.css';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
} from '@rmwc/drawer';
import { Histogram } from './Histogram';
import {
    HistogramData,
    Imgstry,
} from 'imgstry';
import { Slider } from '@rmwc/slider';
import { Typography } from '@rmwc/typography';
import { useImgstryFilter } from '../hooks';
import React from 'react';
export interface FilterPaneProps extends React.HTMLAttributes<{}> {
    imgstry?: Imgstry;
    histogram: HistogramData;
}

export const FilterPane = ({
    imgstry,
    className,
    histogram,
}: FilterPaneProps) => {
    const {
        brightness,
        setBrightness,
        saturation,
        setSaturation,
        contrast,
        setContrast,
    } = useImgstryFilter(imgstry);

    return (
        <>
            <Drawer className={className}>
                <DrawerHeader className="imgstry-histogram-container">
                    <Histogram histogram={histogram} />
                </DrawerHeader>
                <DrawerContent>
                    <div className="imgstry-operation imgstry-operation-brightness">
                        <Typography use="caption">Brightness</Typography>
                        <Slider
                            onChange={evt => setBrightness(evt.detail.value)}
                            discrete
                            min={-100}
                            max={100}
                            value={brightness}
                            step={1} />
                    </div>
                    <div className="imgstry-operation imgstry-operation-contrast">
                        <div>
                            <Typography use="caption">Contrast</Typography>
                            <Slider
                                onChange={evt => setContrast(evt.detail.value)}
                                discrete
                                min={-100}
                                max={100}
                                value={contrast}
                                step={1} />
                        </div>
                    </div>
                    <div className="imgstry-operation imgstry-operation-saturation">
                        <div>
                            <Typography use="caption">Saturation</Typography>
                            <Slider
                                onChange={evt => setSaturation(evt.detail.value)}
                                discrete
                                min={-100}
                                max={100}
                                value={saturation}
                                step={1} />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
};