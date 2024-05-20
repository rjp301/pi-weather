---
layout: "@/layouts/markdown-layout.astro"
---

# How It Works

## Introduction

This is a tool to simplify and summarize the data collected by a personal weather station down to the key metrics. It can do this for multiple stations and consolidate that information into a report. That report can be sent to a list of email addresses on a daily basis.

## Purpose

This tool can be incredibly useful for construction projects that are highly weather sensitive as it provides a high level overview of the conditions that can be expected on site.

## Setup

It is necessary to use [Weather Underground](https://www.wunderground.com/) to interface with the Personal Weather Stations and collect the data.

The recommended Personal Weather Station (PWS) to use is ...

Connect your PWS to Weather Underground then generate an API Key and add it to your [Settings](/settings). Add the PWS information to your [Station List](/stations) as well.

Specify the times of day you are interested in seeing summarized in your settings as well. It should be in the JSON format below.

```json
{
  "hours": [7, 13, 19], // time of day to extract the temperature and wind reading
  // hours past midnight of the previous day to sum rainfall
  "ranges": [
    { "beg": 5, "end": 17 }, // 5AM to 5PM
    { "beg": 17, "end": 29 }, // 5PM to 5AM of the next day
    { "beg": 0, "end": 24 } // from midnight to midnight
  ]
}
```

## Troubleshooting

### _All cells say 'NO DATA'_

API key may have run out of uses or expired. Generate a new key on Weather Underground profile page and enter it into [Settings](/settings) page.
