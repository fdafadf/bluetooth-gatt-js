// @ts-check

import { Chart } from "./Chart.js";

export class HeartRateChart extends Chart
{
    constructor(width, height, min_y, max_y)
    {
        super(width, height, min_y, max_y);
        /** @type {HTMLCanvasElement} */
        // @ts-ignore
        this.background = new OffscreenCanvas(width, height);
    }

    draw()
    {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this._drawBackground();
        this._drawBars();
    }

    _drawBackground()
    {
        this.context.drawImage(this.background, 0, 0);
    }

    _drawBackgroundBuffer(hr_max, background_color_fn)
    {
        let zone_0 = Math.round(hr_max * 0.5);
        let zone_1 = Math.round(hr_max * 0.6);
        let zone_2 = Math.round(hr_max * 0.7);
        let zone_3 = Math.round(hr_max * 0.8);
        let zone_4 = Math.round(hr_max * 0.9);
        let zone_5 = hr_max;
        let background_stripes = [
            { min: 0, max: zone_0, style: '#f5f5f5' },
            { min: zone_0, max: zone_1, style: background_color_fn(zone_0) },
            { min: zone_1, max: zone_2, style: background_color_fn(zone_1) },
            { min: zone_2, max: zone_3, style: background_color_fn(zone_2) },
            { min: zone_3, max: zone_4, style: background_color_fn(zone_3) },
            { min: zone_4, max: zone_5, style: background_color_fn(zone_4) },
        ];
        let context = this.background.getContext('2d');

        if (context)
        {
            let scale_y = context.canvas.height / hr_max;
    
            for (const stripe of background_stripes)
            {
                context.fillStyle = stripe.style;
                context.fillRect(0, context.canvas.height - stripe.max * scale_y, context.canvas.width, (stripe.max - stripe.min) * scale_y);
            }
        }
    }
}