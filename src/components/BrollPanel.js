import { useState } from "react";
import BrollSelector from "./BrollSelector";

export default function BrollPanel({ captions, setBrollList, onEdit, brollList }) {
  const handleBrollSubmit = (brollsFromSelector) => {
    setBrollList((prev) => [...prev, ...brollsFromSelector]);
    onEdit?.();
  };

  const handleBrollDelete = (id) => {
    setBrollList((prev) => prev.filter((broll) => broll.id !== id));
    onEdit?.();
  };

  const handleBrollEdit = (id, key, value) => {
    setBrollList((prev) =>
      prev?.map((broll) =>
        broll.id === id ? { ...broll, [key]: value } : broll
      )
    );
    onEdit?.();
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-black/10 shadow-md">
      <h3 className="text-lg font-semibold text-black mb-4">Add B-Roll from Pexels</h3>

      <BrollSelector onSubmitBrolls={handleBrollSubmit} onEdit={onEdit} />

      {/* ✅ Show and Edit Current Selected B-rolls */}
      {brollList?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected B-Rolls:</h4>
          <ul className="space-y-4">
            {brollList?.map((broll) => (
              <li
                key={broll.id}
                className="bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <div className="space-y-2">
                  {/* URL Input */}
                 <div>
  <label className="block text-sm font-medium text-gray-700">
    Video URL
  </label>

  {/* Thumbnail Preview */}
  <div className="flex items-center space-x-4 mb-2">
    <video
      src={broll.url}
      className="w-32 h-20 rounded-lg shadow border border-gray-300 object-cover"
      controls
      muted
    />

    {/* Editable URL input */}
    <input
      type="text"
      value={broll.url}
      onChange={(e) =>
        handleBrollEdit(broll.id, "url", e.target.value)
      }
      className="flex-1 p-2 text-sm border rounded-md"
    />
  </div>
</div>


                  {/* Start/End Time Inputs */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time (sec)
                      </label>
                      <input
                        type="number"
                        value={broll.start_time}
                        onChange={(e) =>
                          handleBrollEdit(broll.id, "start_time", parseFloat(e.target.value))
                        }
                        className="w-full p-2 text-sm border rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        End Time (sec)
                      </label>
                      <input
                        type="number"
                        value={broll.end_time}
                        onChange={(e) =>
                          handleBrollEdit(broll.id, "end_time", parseFloat(e.target.value))
                        }
                        className="w-full p-2 text-sm border rounded-md"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleBrollDelete(broll.id)}
                    className="text-red-500 text-xs mt-2 hover:underline"
                  >
                    Delete B-roll
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
