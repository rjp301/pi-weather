import type WeatherObservation from "./observation";
import type Station from "./station";

type WeatherFetch = {
  success: boolean;
  observations?: WeatherObservation[];
  error?: any;
  station: Station;
};

export default WeatherFetch;
