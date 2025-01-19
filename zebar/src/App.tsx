import { useEffect, useState } from "react";
import { createProviderGroup } from "zebar";
import { Slider } from "./components/ui/slider";

const providers = createProviderGroup({
  glazewm: { type: "glazewm" },
  host: { type: "host" },
  calendar: { type: "date", formatting: "yyyy LLL dd ccc" },
  date: { type: "date", formatting: "hh:mm:ss a" },
  cpu: { type: "cpu" },
  memory: { type: "memory" },
  battery: { type: "battery" },
  weather: { type: "weather" },
  audio: { type: "audio" },
  media: { type: "media" },
});

function getVolumeIcon(volume: number) {
  if (volume == 0) {
    return "nf-md-volume_off";
  } else if (volume > 0 && volume <= 50) {
    return "nf-md-volume_medium";
  } else {
    return "nf-md-volume_high";
  }
}

function getWeatherIcon(weatherOutput: typeof providers.outputMap.weather) {
  switch (weatherOutput?.status) {
    case "clear_day":
      return <i className="nf nf-weather-day_sunny text-[#ffd700]"></i>;
    case "clear_night":
      return <i className="nf nf-weather-night_clear"></i>;
    case "cloudy_day":
      return <i className="nf nf-weather-day_cloudy"></i>;
    case "cloudy_night":
      return <i className="nf nf-weather-night_alt_cloudy"></i>;
    case "light_rain_day":
      return <i className="nf nf-weather-day_sprinkle"></i>;
    case "light_rain_night":
      return <i className="nf nf-weather-night_alt_sprinkle"></i>;
    case "heavy_rain_day":
      return <i className="nf nf-weather-day_rain"></i>;
    case "heavy_rain_night":
      return <i className="nf nf-weather-night_alt_rain"></i>;
    case "snow_day":
      return <i className="nf nf-weather-day_snow"></i>;
    case "snow_night":
      return <i className="nf nf-weather-night_alt_snow"></i>;
    case "thunder_day":
      return <i className="nf nf-weather-day_lightning"></i>;
    case "thunder_night":
      return <i className="nf nf-weather-night_alt_lightning"></i>;
  }
}

function App() {
  const [output, setOutput] = useState(providers.outputMap);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMediaInfo, setShowMediaInfo] = useState(false);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  return (
    <div className="flex justify-between items-center text-[1.4rem] font-mono shadow-2xl opacity-70">
      <div className="flex-1 flex items-center">
        <div className="text-2xl mr-4">
          <a href="javascript:void(0)" title={output.host?.friendlyOsVersion!}>
            🪟
          </a>
        </div>
        <div className="flex items-center gap-2">
          {output?.glazewm?.allWorkspaces.map((workspace, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 leading-6 flex justify-center item-center rounded border ${
                workspace.hasFocus
                  ? "border-gray-400 text-pink-400 bg-[rgb(0,0,0,.4)] font-bold shadow-2xl animate-in fade-in-10 zoom-in-50"
                  : " border-gray-500 text-gray-400"
              }`}
            >
              <button
                onClick={() =>
                  output.glazewm?.runCommand(
                    `focus --workspace ${workspace.name}`
                  )
                }
              >
                {workspace.name}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex item-center gap-2 text-gray-300">
        {showMediaInfo ? (
          <div className="font-mono flex items-center justify-center h-full">
            <div className="mr-4">
              <i className="nf nf-fa-music text-purple-400"></i>
            </div>
            <div className="overflow-hidden whitespace-nowrap w-60 text-white mr-4">
              <div
                className={
                  output.media?.currentSession?.isPlaying
                    ? "scrolling-text"
                    : ""
                }
              >
                {output.media?.currentSession?.title}-
                {output.media?.currentSession?.artist}
              </div>
            </div>
            <div className="mr-4 cursor-pointer">
              <i
                className="nf nf-md-skip_previous_circle_outline"
                onClick={() => output.media?.previous()}
              ></i>
            </div>
            {output.media?.currentSession?.isPlaying ? (
              <div className="mr-4 cursor-pointer">
                <i
                  className="nf nf-fa-pause_circle_o"
                  onClick={() => output.media?.pause()}
                ></i>
              </div>
            ) : (
              <div className="mr-4 cursor-pointer">
                <i
                  className="nf nf-cod-play_circle"
                  onClick={() => output.media?.play()}
                ></i>
              </div>
            )}
            <div className="mr-4 cursor-pointer">
              <i
                className="nf nf-md-skip_next_circle_outline"
                onClick={() => output.media?.next()}
              ></i>
            </div>
          </div>
        ) : (
          <div className="flex mr-4 gap-2">
            {output.calendar && <div>🗓️{output.calendar.formatted}</div>}
            {output.date && <div>⏰{output.date?.formatted}</div>}
          </div>
        )}
        {output.media?.currentSession && (
          <div className="cursor-pointer">
            <i
              className="nf nf-iec-toggle_power text-gray-400"
              onClick={() => setShowMediaInfo(!showMediaInfo)}
            ></i>
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center justify-end gap-4 mr-2 text-gray-300">
        {output.memory && (
          <div>
            <i className="nf nf-fae-chip text-orange-300 mr-1"></i>
            {Math.round(output.memory.usage)}%
          </div>
        )}
        {output.cpu && (
          <div>
            <i className="nf nf-oct-cpu text-sky-200 mr-1"></i>
            {Math.round(output.cpu.usage)}%
          </div>
        )}
        {output.battery && (
          <div>
            {output.battery.isCharging && (
              <i className="nf nf-md-power_plug charging-icon mr-1"></i>
            )}
            <i className="nf nf-fa-battery_0 text-red-400 text-2xl mr-1"></i>
            {Math.round(output.battery.chargePercent)}%
          </div>
        )}
        {output.audio && (
          <div className="flex">
            <div className="relative">
              <i
                className={`nf ${getVolumeIcon(
                  output.audio.defaultPlaybackDevice?.volume as number
                )} mr-1 text-sky-300 cursor-pointer`}
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              ></i>
              {showVolumeSlider && (
                <div className="absolute top-1 right-10 w-64 h-[80%] rounded flex justify-center items-center bg-gray-400">
                  <Slider
                    className="w-[90%] h-8 z-50"
                    defaultValue={[
                      output.audio.defaultPlaybackDevice?.volume as number,
                    ]}
                    max={100}
                    min={0}
                    step={1}
                    onValueCommit={(value: number[]) =>
                      output.audio?.setVolume(value.at(-1)!)
                    }
                  />
                </div>
              )}
            </div>
            {output.audio.defaultPlaybackDevice?.volume}%
          </div>
        )}
        {output.weather && (
          <div>
            <span className="text-2xl text-white mr-1">
              {getWeatherIcon(output.weather)}
            </span>
            {Math.round(output.weather.celsiusTemp)}°C
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
