import { useGearStore } from "@/store/useGearStore";

export function LuaPreview() {
  const { allSets, activeTab } = useGearStore();
  const visible = Object.entries(allSets).filter(([n]) => n.split('.')[0] === activeTab);

  return (
    <div className="h-full p-6 bg-black font-mono text-[13px] overflow-auto">
      <div className="mb-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Lua Output</div>
      {visible.map(([setName, gear]) => {
        const [base, ...vParts] = setName.split('.');
        const variant = vParts.length > 0 ? `.${vParts.join('.')}` : "";

        return (
          <div key={setName} className="mb-8">
            <div style={{ color: '#FFFFFF' }}>
              sets.<span style={{ color: '#FB923C' }}>{base}</span>
              <span style={{ color: '#10B981' }}>{variant}</span> = {"{"}
            </div>
            {Object.entries(gear).map(([slot, val]) => val && (
              <div key={slot} className="pl-6">
                <span style={{ color: '#FFFFFF' }}>{slot}=</span>
                <span style={{ color: '#10B981' }}>"{val}"</span>
                <span style={{ color: '#FFFFFF' }}>,</span>
              </div>
            ))}
            <div style={{ color: '#FFFFFF' }}>{"}"}</div>
          </div>
        );
      })}
    </div>
  );
}