import requests
from dotenv import dotenv_values

config = dotenv_values(".env")

def fetch_weather_data(station_id):
  assert "WU_API_KEY" in config
  
  url = "https://api.weather.com/v2/pws/observations/hourly/7day"
  headers = { "content-type": "application/x-www-form-urlencoded" }
  params = { 
    "apiKey": config["WU_API_KEY"], 
    "format": "json", 
    "units": "m", 
    "stationId": station_id 
  }

  response = requests.get(url, params, headers=headers)
  
  if response.status_code == 200: return response.json()
  return "null"

if __name__ == "__main__":
  result = fetch_weather_data("IREGIO61")
  print(result)