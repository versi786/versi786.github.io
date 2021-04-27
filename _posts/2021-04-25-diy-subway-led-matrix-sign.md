---
title: DIY Subway LED Matrix
published: true
---

![Subway LED Matrix](/assets/images/2021-04-25-diy-subway-led-matrix-sign/subway_matrix.jpg)

[Github Repo](https://github.com/versi786/subway-led-matrix)

# GTFS

[GTFS](https://developers.google.com/transit/gtfs) is the General Transit Feed Specification, originally developed by Google, which provides a way for users to retreive static data about any transit sytstem. The best way to get an understanding about GTFS is by looking at [this](https://developers.google.com/transit/gtfs/examples/gtfs-feed) example GTFS feed. It covers arll the major files that are included in the GTFS Specification. For this project we care most about the following files. Parsing gtfs data is pretty straightforward, since everything is in csv files, and everything has an ID, all we have to do is parse the CSV files, pick out the columns we want, and put all the data into datastructres that are more convenient than the columnar format provided. The parsing code can be found in [NYCT.\_parse\_static\_data](https://github.com/versi786/subway-led-matrix/blob/master/data/nyct.py#L64).

## `stops.txt`
`stops.txt` provides details about all the stops and stations. For this project are most interested in lines with `location_type == 1` (Stop or Platform) and `location_type == 2` (Station). When parsing `stops.txt` we will map each Stop to it's parent station using the last column in  `stops.txt` `parent_station`. This allows the user to specify which stations they want to monitor, and we can find the next upcoming train at that stop. Each line in this file will also provide a `stop_id` which we will use to match to arrival and departure times of trains.

## `routes.txt`
`routes.txt` will provide us with the deails about each line in the system, this will give us the `route_short_name`, for example `6`, and the `route_color` (green) and `route_text_color` (white). The `route_id` again will be used with the realtime data to provide which train is arriving at a given station.

## GTFS Realtime
# TODO


# GTFS and the MTA:
You can download the MTA's static GTFS data from [here](http://web.mta.info/developers/developer-data-terms.html). Scroll all the way down to the bottom and click `Yes, I agree to the these terms and conditions`, which will them provide you to a link to Download the "New York City Transit Subway" GTFS data [here](http://web.mta.info/developers/data/nyct/subway/google_transit.zip). When you run the matrix script, this data will be automatically downloaded to `/tmp` for you.

In order to access the MTA's realtime data you will need to go to [api.mta.info](https://api.mta.info/#/landing) and sign up for an account so you can get an API Key. Once you get the API key you will need to save it in a file named `.env`, in the root directory of the cloned [github repo](https://github.com/versi786/subway-led-matrix) with a single line:
```
MTA_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
```

After sigining in you will then need to download the [GTFS Realtime Proto File](https://developers.google.com/transit/gtfs-realtime/gtfs-realtime-proto) and [NYCT Subway Proto Extensions](https://api.mta.info/nyct-subway.proto.txt). If you have cloned the [github repo](https://github.com/versi786/subway-led-matrix), these files are already included and will be compiled when you run `make` in the root directory. This project does not use the NYCT extensions, but the are available if you like.

Finally, each collection of subway lines has its own realtime url which can be found on the [Subway Realtime Feeds](https://api.mta.info/#/subwayRealTimeFeeds) page. These are also already included [here](https://github.com/versi786/subway-led-matrix/blob/master/data/nyct.py#L18)

# Hardware:
* Parts List: https://github.com/riffnshred/nhl-led-scoreboard/wiki/Hardware
* Step by Step Guide: https://github.com/riffnshred/nhl-led-scoreboard/wiki/Step-by-step-guide.

I highly reccomend you read the guide above for all the details of how to set up the LED matrix, and the parts/skills required.

# Software:
Installation:
```bash
get clone git@github.com:versi786/subway-led-matrix.git
cd ./subway-led-matrix
./scripts/install.sh

echo MTA_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX >> .env
```

List all stops available:
```bash
sudo python3 -m main \
    --list-stops

```

The easiest way to find the stops you care about is by using `grep` for example:
```bash
sudo python3 -m main \
    --list-stops \
    | grep -i 'grand central'
```

Running the script, provide whatever stops you like from the output of the previous script:
```bash
sudo python3 -m main \
    --led-rows=32 \
    --led-cols=64 \
    --led-gpio-mapping=adafruit-hat-pwm \
    --led-brightness=20 \
    --led-slowdown-gpio=4 \
    --stop 'Grand Central-42 St' \
    --stop 'World Trade Center'
```

The script must be run as sudo to access the Raspberry Pi's GPIO functionality. For more details on the RGB Matrix check out the library's README here for how to change the matrix parameters [here](https://github.com/hzeller/rpi-rgb-led-matrix#changing-parameters-via-command-line-flags)

# References:
 * Jeff Kessler's talk at Transportation Camp Philadelphia: [video](https://www.youtube.com/watch?v=LCIu4zbSNho)
 * [nolanbconaway/underground](https://github.com/nolanbconaway/underground)
 * [fsargent/BARTSign](https://github.com/fsargent/BARTSign)
 * [MLB-LED-Scoreboard/mlb-led-scoreboard](https://github.com/MLB-LED-Scoreboard/mlb-led-scoreboard)
 * [riffnshred/nhl-led-scoreboard](https://github.com/riffnshred/nhl-led-scoreboard)
