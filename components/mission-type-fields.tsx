"use client";

import { useState } from "react";

interface MissionTypeFieldsProps {
  inputClass: string;
  labelClass: string;
  defaultType?: string;
  defaultStreakTarget?: number;
}

export default function MissionTypeFields({
  inputClass,
  labelClass,
  defaultType = "standard",
  defaultStreakTarget = 7,
}: MissionTypeFieldsProps) {
  const [type, setType] = useState(defaultType);

  return (
    <>
      <div>
        <label className={labelClass}>🎯 Tipo de Misión</label>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => setType("standard")}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
              type === "standard"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            ⚔️ Estándar
          </button>
          <button
            type="button"
            onClick={() => setType("streak")}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
              type === "streak"
                ? "bg-orange-600 text-white"
                : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            🔥 Racha
          </button>
        </div>
        <input type="hidden" name="type" value={type} />
      </div>

      {type === "streak" && (
        <div>
          <label htmlFor="streakTarget" className={labelClass}>
            🔥 Días de racha necesarios
          </label>
          <input
            type="number"
            id="streakTarget"
            name="streakTarget"
            min={2}
            max={365}
            defaultValue={defaultStreakTarget}
            required
            className={inputClass}
          />
          <p className="text-[10px] text-purple-300/50 mt-1">
            Todos los niños pueden participar a la vez. El admin marca el progreso diario.
          </p>
        </div>
      )}
    </>
  );
}

