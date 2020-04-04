import { Imgstry } from 'imgstry';
import {
    useEffect,
    useState,
} from 'react';

export const useImgstryFilter = (editor?: Imgstry) => {
    const [ brightness, setBrightness ] = useState(0);
    const [ contrast, setContrast ] = useState(0);
    const [ saturation, setSaturation ] = useState(0);
    const [ vibrance, setVibrance ] = useState(0);
    const [ hue, setHue ] = useState(0);
    const [ sepia, setSepia ] = useState(0);
    const [ noise, setNoise ] = useState(0);
    const [ invert, setInvert ] = useState(false);
    const [ blackAndWhite, setBlackAndWhite ] = useState(false);

    useEffect(() => {
        if (invert) { editor?.invert(); }
        if (brightness !== 0) { editor?.brightness(brightness); }
        if (contrast !== 0) { editor?.contrast(contrast); }
        if (saturation !== 0) { editor?.saturation(saturation); }
        if (vibrance !== 0) { editor?.vibrance(vibrance); }
        if (hue !== 0) { editor?.hue(hue); }
        if (sepia !== 0) { editor?.sepia(sepia); }
        if (noise !== 0) { editor?.noise(noise); }
        if (blackAndWhite) { editor?.blackAndWhite(); }

        (async () => {
            await editor?.render('original');
        })();
    }, [
        editor,
        invert,
        brightness,
        contrast,
        saturation,
        vibrance,
        hue,
        sepia,
        noise,
        blackAndWhite,
    ]);

    return {
        brightness,
        setBrightness,
        contrast,
        setContrast,
        saturation,
        setSaturation,
        vibrance,
        setVibrance,
        hue,
        setHue,
        sepia,
        setSepia,
        noise,
        setNoise,
        invert,
        setInvert,
        blackAndWhite,
        setBlackAndWhite,
    };
};