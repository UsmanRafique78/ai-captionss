import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoSection() {
  return (
    <section className="mt-12 py-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">See it in action</h2>
     <div className="grid md:grid-cols-2 gap-8 px-4 items-stretch justify-center">
  {/* Original Video */}
  <div className="flex flex-col h-full">
    <Card className="flex flex-col flex-grow items-center justify-center p-4 bg-white shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-center text-gray-900">Original Video</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-grow flex flex-col justify-between">
        <div className="w-full h-[300px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          <video
            src="https://dawid-epic-captions.s3.us-east-1.amazonaws.com/without-captions.mp4"
            preload="auto"
            muted
            autoPlay
            loop
            className="w-full h-full object-cover"
          ></video>
        </div>
        <p className="text-sm text-center text-gray-600 mt-4">Your video before captions.</p>
      </CardContent>
    </Card>
  </div>

  {/* With Captions */}
  <div className="flex flex-col h-full">
    <Card className="flex flex-col flex-grow items-center justify-center p-4 bg-white shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-center text-gray-900">Video with Captions</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex-grow flex flex-col justify-between">
        <div className="w-full h-[300px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          <video
            src="https://dawid-epic-captions.s3.us-east-1.amazonaws.com/with-captions.mp4"
            preload="auto"
            muted
            autoPlay
            loop
            className="w-full h-full object-cover"
          ></video>
        </div>
        <p className="text-sm text-center text-gray-600 mt-4">
          Your video with automatically generated captions.
        </p>
      </CardContent>
    </Card>
  </div>
</div>

    </section>
  );
}
