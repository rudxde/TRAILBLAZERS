/**
 * Represents the weather from the weather microservice
 *
 * @export
 * @interface IWeather
 */
export interface IWeather {
    cityName: string;
    currentTemp: number; // grad celius -> list/0/main/temp
    wind: number; // in m/s
    weatherIconURL: string; // weather icon provided from openweather
}
