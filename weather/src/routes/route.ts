import { Router } from 'express';
import got from 'got';
import { environment } from '@tb/environment/dist/service';

const router = Router();
//API key for openweathermap

/** :city is the city name of which the weather is requested as string in the Json format */
router.get('/:city', async (req, res) => {
    try {
        try {
            var parsedCity = JSON.parse(req.params.city);
        } catch (error) {
            console.log('Error while parsing url paramater, using default Values');
            console.log(error);
            parsedCity = { lon: '11.576124', lat: '48.137154' };
        }
        try {
            var weatherForecastFull = await weatherAPICall(parsedCity);
            res.status(200).send({
                cityName: weatherForecastFull.name,
                currentTemp: weatherForecastFull.main.temp,
                wind: weatherForecastFull.wind.speed,
                weatherIconURL: 'http://openweathermap.org/img/wn/' +
                    weatherForecastFull.weather[0].icon
                    + '@2x.png'
            });
        } catch (err) {
            console.log('Error in API Call: ');
            console.error(err);
            res.status(200).send({
                cityName: 'Munich',
                currentTemp: 20,
                wind: 5,
                weatherIconURL: 'http://openweathermap.org/img/wn/01d.png@2x.png'
            });
        }

    } catch (err) {
        console.log('General error:');
        console.error(err);
        res.status(500).send(err.message);
    }
});

async function weatherAPICall(city: { lat: number, lon: number }) {
    const apiKey = environment.weather.apiKey;
    try {
        var url = 'https://api.openweathermap.org/data/2.5/weather?'
            + 'lat=' + city.lat + '&lon=' + city.lon +
            '&APPID=' + apiKey +
            '&units=metric';
        var apiCall = await got(url, { responseType: 'json' });
        return apiCall.body;
    } catch (err) {
        console.error(err);
        return err.HTTPError;
    }
}

export default router;
