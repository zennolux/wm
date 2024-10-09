import { useEffect, useState } from "react";
import { createProviderGroup } from "zebar";

const providers = createProviderGroup({
  glazewm: { type: "glazewm" },
  calendar: { type: "date", formatting: "yyyy LLLL dd cccc" },
  date: { type: "date", formatting: "hh:mm:ss a" },
  cpu: { type: "cpu" },
  memory: { type: "memory" },
  battery: { type: "battery" },
});

function App() {
  const [output, setOutput] = useState(providers.outputMap);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  return (
    <div className="flex justify-between items-center text-[20px] font-mono">
      <div className="flex items-center">
        <div className="text-2xl mr-4">🪟</div>
        <div className="flex items-center gap-2">
          {output?.glazewm?.allWorkspaces.map((workspace, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 leading-6 flex justify-center item-center rounded border ${
                workspace.hasFocus
                  ? "border-sky-200 text-pink-400"
                  : " border-gray-500 text-gray-400"
              }`}
            >
              {workspace.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex item-center gap-2 text-white">
        {output?.calendar && <div>🗓️{output?.calendar?.formatted}</div>}
        {output?.date && <div>⏰{output?.date?.formatted}</div>}
      </div>
      <div className="flex items-center justify-end gap-4 mr-2 text-white">
        {output.memory && (
          <div>
            <i className="nf nf-fae-chip text-orange-300"> </i>
            {Math.round(output.memory.usage)}%
          </div>
        )}
        {output.cpu && (
          <div>
            <i className="nf nf-oct-cpu text-sky-200"> </i>
            {Math.round(output.cpu.usage)}%
          </div>
        )}
        {output.battery && (
          <div className="battery">
            {output.battery.isCharging && (
              <i className="nf nf-md-power_plug charging-icon"></i>
            )}
            <i className="nf nf-fa-battery_0 text-red-400 text-2xl"> </i>
            {Math.round(output.battery.chargePercent)}%
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
