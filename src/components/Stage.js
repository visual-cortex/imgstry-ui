import { Imgstry } from "imgstry";

export class Stage {
    constructor(canvas) {
        this.canvas = canvas;
        this.imgstry = new Imgstry(canvas);
    }

    async drawImage(src) {
        if (!src) {
            return;
        }

        const image = await Imgstry.loadImage(src);
        this.imgstry.drawImage(image);
    }

    dispose() {
        this.imgstry.dispose();
    }
}