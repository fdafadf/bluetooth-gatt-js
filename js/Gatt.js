// @ts-check

export class Gatt
{
    static HEART_RATE_VALUE_FORMAT = 0x01;

    /**
     * @param {DataView} data 
     */
    static getHeartRate(data)
    {
        let flags = data.getUint8(0);
        let isLongFormat = (flags & Gatt.HEART_RATE_VALUE_FORMAT) != 0;
        let value = data.getUint8(1);
    
        if (isLongFormat)
        {
            value = (data.getUint8(2) << 8) + value;
        }

        return value;
    }
}