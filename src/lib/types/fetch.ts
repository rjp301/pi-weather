import type { WeatherObservation } from "./observation";
import type { Station } from "./station";

export type WeatherFetch = {
  success: boolean;
  observations?: WeatherObservation[];
  error?: any;
  station: Station;
};
