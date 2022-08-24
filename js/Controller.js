// @ts-check

import { Gatt } from "./Gatt.js";
import { HeartRateChart } from "./HeartRateChart.js";

export class Controller
{
    constructor(hr_max)
    {
        this.hr_max = hr_max;
        this.hr_max_half = Math.round(hr_max * 0.5);
        this.hr_label = this._getElementById('hr_label');
        this.hr_value = this._getElementById('hr_value');
        this.hr_chart_container = this._getElementById('hr_chart_container');
        this.hr_chart = new HeartRateChart(this.hr_chart_container.clientWidth, this.hr_chart_container.clientHeight, 0, this.hr_max);
        this.hr_chart._drawBackgroundBuffer(hr_max, value => this._heartRateBackground(value));
        this.hr_chart_container.appendChild(this.hr_chart.element);
        new ResizeObserver(this._onChartContainerResize.bind(this)).observe(this.hr_chart_container);
    }

    async initializeCharacteristicNotifications(characteristic)
    {
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', this.onHeartRateReceived.bind(this));
    }

    onHeartRateReceived(event)
    {
        let value = Gatt.getHeartRate(event.target.value);
        this._addHeartRate(value);
    }
    
    _getElementById(id)
    {
        let element = document.getElementById(id);

        if (element == null)
        {
            throw 'Element not found.';
        }

        return element;
    }

    _addHeartRate(value)
    {
        console.log(value);

        if (this.hr_chart)
        {
            let point = { x: this.hr_chart.points.length, y: value, style: this._heartRateForeground(value) };
            this.hr_value.textContent = value;
            this.hr_chart.points.push(point);
            this.hr_chart.draw();
            this.hr_label.style.color = this._heartRateBackground(value);
            this.hr_value.style.color = point.style;
        }
    }

    _onChartContainerResize()
    {
        this.hr_chart.element.width = this.hr_chart_container.clientWidth - 32;
        this.hr_chart.element.height = this.hr_chart_container.clientHeight - 32;
        this.hr_chart.background.width = this.hr_chart.element.width;
        this.hr_chart.background.height = this.hr_chart.element.height;
        this.hr_chart._drawBackgroundBuffer(this.hr_max, value => this._heartRateBackground(value));
    }

    _heartRateForeground = (value) => value < this.hr_max_half ? '#ccc' : `hsl(${120 - 120 * ((value - this.hr_max_half) / this.hr_max_half)}, 50%, 50%)`;
    _heartRateBackground = (value) => value < this.hr_max_half ? '#eee' : `hsl(${120 - 120 * ((value - this.hr_max_half) / this.hr_max_half)}, 100%, 90%)`;
}
