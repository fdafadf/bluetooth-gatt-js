// @ts-check

import { Controller } from "./js/Controller.js";

/**
 * @param {HTMLButtonElement} pair_button 
 * @param {HTMLButtonElement} simulation_button 
 * @param {HTMLInputElement} hr_max_input 
 * @param {HTMLElement} pair_panel_element 
 * @param {HTMLElement} hr_characteristic_element 
 */
async function initializePairPanel(pair_button, simulation_button, hr_max_input, pair_panel_element, hr_characteristic_element)
{
    pair_button.onclick = async () =>
    {
        let hr_max = hr_max_input.valueAsNumber;

        if (hr_max && hr_max > 0)
        {
            let options = { 'filters': [{ 'services': [ 'heart_rate' ] }] };
            // @ts-ignore
            let device = await navigator.bluetooth.requestDevice(options);
            let server = await device.gatt.connect();
            let service = await server.getPrimaryService('heart_rate');
            let characteristic = await service.getCharacteristic('heart_rate_measurement');
            pair_panel_element.style.display = 'none';
            hr_characteristic_element.style.display = 'table';
            let controller = new Controller(hr_max);
            await controller.initializeCharacteristicNotifications(characteristic);
        }
    }
    simulation_button.onclick = async () =>
    {
        let hr_max = hr_max_input.valueAsNumber;

        if (hr_max && hr_max > 0)
        {
            pair_panel_element.style.display = 'none';
            hr_characteristic_element.style.display = 'table';
            let controller = new Controller(hr_max);
            let hr = 35;
            let tick_function = () =>
            {
                hr += Math.random() * 1.5;
                hr -= Math.random();
                hr = Math.round(hr);
                controller._addHeartRate(hr);
            };
            setInterval(tick_function, 50);
        }
    }
}

async function main()
{
    /** @type {HTMLButtonElement | null} */
    let pair_button = document.querySelector('button#pair_button');
    /** @type {HTMLButtonElement | null} */
    let simulation_button = document.querySelector('button#simulation_button');
    /** @type {HTMLInputElement | null} */
    let hr_max_input = document.querySelector('input#hr_max');
    /** @type {HTMLElement | null} */
    let pair_panel_element = document.querySelector('#pair_panel');
    /** @type {HTMLElement | null} */
    let hr_characteristic_element = document.querySelector('#hr_characteristic');

    if (pair_button && simulation_button && hr_max_input && pair_panel_element && hr_characteristic_element)
    {
        initializePairPanel(pair_button, simulation_button, hr_max_input, pair_panel_element, hr_characteristic_element);
    }
}

window.onload = main;