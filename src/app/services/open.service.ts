// import { OpenService } from './open.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenService {



  constructor(private http: HttpClient) { }

  getIpAddress(): Observable<any>  {
    // Use a geolocation service (e.g., geolocation-db.com)
    return this.http.get('https://geolocation-db.com/json/e6256a50-6cef-11ef-9699-010d5e77689d'); // Replace with the service's URL
  }

  getWeatherData(lat: number, lon: number): Observable<any> {
    // Use OpenWeatherMap API
    return this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m,relative_humidity_2m,is_day,wind_speed_10m`)
  }

  getWeatherIcon(code: number): string {
    return weatherCodeIconMap[code] || 'assets/images/icons/weather/cloud.png'; // default
  }

}
export const weatherCodeIconMap: { [code: number]: string } = {
  0: 'assets/images/icons/weather/sun.png',
  1: 'assets/images/icons/weather/cloudy-day.png',
  2: 'assets/images/icons/weather/cloudy-sunny-winds.png',
  3: 'assets/images/icons/weather/cloud.png',
  45: 'assets/images/icons/weather/cloud-wind.png',
  48: 'assets/images/icons/weather/freezing.png',

  51: 'assets/images/icons/weather/rainy-day.png',
  53: 'assets/images/icons/weather/rainy-day.png',
  55: 'assets/images/icons/weather/rainy-day.png',
  56: 'assets/images/icons/weather/freezing.png',
  57: 'assets/images/icons/weather/freezing.png',

  61: 'assets/images/icons/weather/rainy-day.png',
  63: 'assets/images/icons/weather/rainy-day.png',
  65: 'assets/images/icons/weather/rainy-day.png',
  66: 'assets/images/icons/weather/freezing.png',
  67: 'assets/images/icons/weather/freezing.png',

  71: 'assets/images/icons/weather/snowflake.png',
  73: 'assets/images/icons/weather/snowflake.png',
  75: 'assets/images/icons/weather/snowflake.png',
  77: 'assets/images/icons/weather/snowflake.png',
  85: 'assets/images/icons/weather/snowflake.png',
  86: 'assets/images/icons/weather/snowflake.png',

  80: 'assets/images/icons/weather/rainy-day.png',
  81: 'assets/images/icons/weather/rainy-day.png',
  82: 'assets/images/icons/weather/rainy-day.png',

  95: 'assets/images/icons/weather/bolt.png',
  96: 'assets/images/icons/weather/cloud-bolt.png',
  99: 'assets/images/icons/weather/cloud-bolt.png',
};
