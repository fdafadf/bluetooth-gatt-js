// @ts-check

export class Chart
{
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} min_y 
     * @param {number} max_y 
     */
    constructor(width, height, min_y, max_y)
    {
        /** @type {HTMLCanvasElement} */
        this.element = document.createElement('canvas');
        this.element.width = width;
        this.element.height = height;
        this.context = this.element.getContext('2d');
        this.min_y = min_y;
        this.max_y = max_y;
        /** @type {Array<ChartPoint>} */
        this.points = [];

        if (this.context == null)
        {
            throw 'Can not create context.';
        }
    }

    draw()
    {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this._drawBars();
    }

    _drawBars()
    {
        let context = this.context;
        let min_x = this.points.reduce((min, point) => point.x < min ? point.x : min, Number.MAX_SAFE_INTEGER);
        let max_x = this.points.reduce((max, point) => point.x > max ? point.x : max, Number.MIN_SAFE_INTEGER);
        let min_y = this.min_y; //this.points.reduce((min, point) => point.y < min ? point.y : min, Number.MAX_SAFE_INTEGER);
        let max_y = this.max_y; //this.points.reduce((max, point) => point.y > max ? point.y : max, Number.MIN_SAFE_INTEGER);
        let scale_x = context.canvas.width / (max_x - min_x);
        let scale_y = context.canvas.height / (max_y - min_y);
        let bar_width = context.canvas.width / this.points.length;
        let left = 0;

        for (const { y, style } of this.points)
        {
            let height = (y - min_y) * scale_y;
            context.fillStyle = style;
            context.fillRect(Math.floor(left), context.canvas.height - height, Math.round(bar_width) + 1, height);
            left += bar_width;
        }
    }
}
