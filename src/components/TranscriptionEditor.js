import TranscriptionItem from "@/components/TranscriptionItem";

export default function TranscriptionEditor({
  awsTranscriptionItems,
  setAwsTranscriptionItems,
}) {

  function updateTranscriptionItem(index, prop, ev) {
    console.log("Typing:", ev.target.value); 
  const newAwsItems = [...awsTranscriptionItems];
  const newItem = { ...newAwsItems[index] };

  if (prop === 'content') {
    if (!newItem.alternatives) newItem.alternatives = [{}];
    newItem.alternatives[0].content = ev.target.value;
  } else {
    newItem[prop] = ev.target.value;
  }

  newAwsItems[index] = newItem;
  setAwsTranscriptionItems(newAwsItems);
}


  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]"> {/* container with full height */}
      <div className="grid grid-cols-3 sticky top-0 bg-orange-500 p-2 rounded-md z-10">
        <div>From</div>
        <div>End</div>
        <div>Content</div>
      </div>
      
      {awsTranscriptionItems?.length > 0 && (
        <div className="flex-1 overflow-y-auto px-1 space-y-1"> {/* actual scrollable area */}
          {awsTranscriptionItems?.map((item, key) => (
            <div key={key}>
              <TranscriptionItem
                handleStartTimeChange={ev => updateTranscriptionItem(key, 'start_time', ev)}
                handleEndTimeChange={ev => updateTranscriptionItem(key, 'end_time', ev)}
                handleContentChange={ev => updateTranscriptionItem(key, 'content', ev)}
                item={item}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}