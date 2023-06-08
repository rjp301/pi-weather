import type WeatherObservation from "./observation";

type WeatherFetch = {
  success: boolean;
  observations?: WeatherObservation[];
  error?: any;
}

export default WeatherFetch;
