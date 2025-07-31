// src/app/[filename]/FilePageClient.js
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Test from "../test/page";
import { Loader2 } from "lucide-react";

export default function FilePageClient({ filename }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);
  const [generatedFilename, setGeneratedFilename] = useState(null);

  const [coverImage, setCoverImage] = useState(null);
  const [applyCover, setApplyCover] = useState(false);

  const [brollList, setBrollList] = useState([]);

  const [brandTextFields, setBrandTextFields] = useState({
    text: "",
    size: 24,
    posX: 5,
    posY: 20,
    opacity: 100,
    position: "top-right",
  });
  const [brandImageFields, setBrandImageFields] = useState({
    image: null,
    size: 100,
    posX: 5,
    posY: 20,
    opacity: 100,
    position: "top-right",
  });
  const [subtitleOptions, setSubtitleOptions] = useState({
    color: "black",
    strokeColor: "#000000",
    strokeWidth: 2,
    shadow: true,
    shadowColor: "#000000",
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowBlur: 1,
    position: "middle-center",
    adjustTiming: true,
    minDuration: 0.5,
    maxDuration: 3.0,
    wordsPerSegment: 2,
    language: "english",
    textDirection: "ltr",
    preview: true,
    previewDuration: 10,
    noAudio: false,
    audioBitrate: "192k",
    style: "custom",
    blackout: false,
    blackoutColor: "#000000",
  });

  useEffect(() => {
    getTranscription();
  }, [filename]);

  const onDoneCallback = () => {
    console.log("Done!");
  };

  async function handleGenerateSubtitle(
    extraStyles = {},
    videoRef,
    brollList = [],
    setIsProcessing,
    onDoneCallback = () => {}
  ) {
    const duration = videoRef?.current?.duration || 10;

    if (!videoRef) {
      console.warn("No videoRef passed to handleGenerateSubtitle");
    }

    try {
      const fullOptions = {
        ...subtitleOptions,
        ...extraStyles,

        watermarkText: brandTextFields?.text || undefined,
        watermarkSize: brandTextFields?.size || undefined,
        watermarkOpacity: brandTextFields?.opacity / 100 || undefined,
        watermarkFontWeight: subtitleOptions.watermarkFontWeight,
        watermarkPosition: subtitleOptions.watermarkPosition,

        watermarkImagePath: brandImageFields?.image || undefined,
        watermarkImageScale: Math.min(
          Math.max(Number(brandImageFields.size) / 100, 0.01),
          1.0
        ),

        watermarkImageOpacity: brandImageFields?.opacity / 100 || undefined,
        watermarkImagePosition: subtitleOptions.watermarkImagePosition,

        previewDuration: subtitleOptions.previewDuration,
      };

      console.log("🎯 Sending Watermark Image Options:", {
        watermarkImagePath: fullOptions.watermarkImagePath,
        watermarkImageScale: fullOptions.watermarkImageScale,
        watermarkImageOpacity: fullOptions.watermarkImageOpacity,
        watermarkImagePosition: fullOptions.watermarkImagePosition,
      });

      if (applyCover && subtitleOptions.coverImagePath) {
        fullOptions.applyCover = true;
        fullOptions.coverImagePath = subtitleOptions.coverImagePath;
      }
      if (subtitleOptions.blackout) {
        fullOptions.blackout = true;
        if (subtitleOptions.blackoutColor) {
          fullOptions.blackoutColor = subtitleOptions.blackoutColor;
        }
      }

      if (subtitleOptions.noAudio) {
        fullOptions.noAudio = true;
      }

      const payload = {
        subtitlePath: `${filename}.srt`,
        options: fullOptions,
        brolls: brollList,
        transcriptionItems: awsTranscriptionItems,
      };
      console.log("🧾 Final transcriptionItems sent:", awsTranscriptionItems);

      console.log("🛰 Payload being sent to backend:");
      console.log("▶️ subtitlePath:", `${filename}.srt`);
      console.log("▶️ fullOptions:", fullOptions);
      console.log("▶️ brollList:", brollList);
      console.log(
        "🖼 coverImagePath from state:",
        subtitleOptions.coverImagePath
      );
      console.log(
        "🚀 Making request to:",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/video/generate-subtitles?video=${filename}`
      );
      console.log("📦 Payload:", payload);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/video/generate-subtitles?video=${filename}`,
        payload
      );
      console.log("✅ Response received:", res.data);

      if (res.data.fallbackUsed) {
        alert(`Font not found. Used fallback: ${res.data.fallbackFont}`);
      }
      const timestamp = Date.now();
      const previewFilename = `${filename}_preview.mp4?t=${timestamp}`;
      setGeneratedFilename(previewFilename);

      const previewUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/video/${filename}_preview.mp4?t=${timestamp}`;

      if (videoRef.current) {
        videoRef.current.src = previewUrl;
        videoRef.current.load();
        setSubtitleOptions((prev) => ({
          ...prev,
          finalVideoReady: true,
        }));
      }
    } catch (err) {
      console.error("Error generating subtitles:", err);
      alert("Failed to generate subtitles.");
    } finally {
      setIsProcessing(false);
    }
  }

  function getTranscription() {
    setIsFetchingInfo(true);
    onDoneCallback(false);

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/video/transcription/${filename}`
      )
      .then((response) => {
        setIsFetchingInfo(false);
        const status = response.data?.status;
        console.log("💬 Full API Response:", response.data);
        const transcription = response.data?.transcription;

        console.log("Transcription API response:", response.data);

        if (status === "FAILED") {
          console.error("Transcription failed.");
          return;
        }

        if (status === "IN_PROGRESS") {
          setIsTranscribing(true);
          setTimeout(getTranscription, 3000);
        } else if (status === "COMPLETED") {
          setIsTranscribing(false);

          if (transcription?.results?.items) {
            setAwsTranscriptionItems(transcription.results.items);
          } else {
            console.warn("No transcription items found.");
            setAwsTranscriptionItems([]);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching transcription:", error);
        setIsFetchingInfo(false);
      });
  }

  if (isTranscribing) {
    return <div>Transcribing your video...</div>;
  }

  if (isFetchingInfo) {
    return (
      <div className="flex items-center justify-center h-40 gap-2 text-gray-700">
        <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
        <span>Fetching information...</span>
      </div>
    );
  }

  const resultVideoPath = generatedFilename || `${filename}_preview.mp4`;

  return (
    <div className="-mx-auto max-w-none">
      <div>
        <Test
          filename={resultVideoPath}
          transcriptionItems={awsTranscriptionItems}
          subtitleOptions={subtitleOptions}
          setSubtitleOptions={setSubtitleOptions}
          onGenerateSubtitle={handleGenerateSubtitle}
          brandTextFields={brandTextFields}
          setBrandTextFields={setBrandTextFields}
          brandImageFields={brandImageFields}
          setBrandImageFields={setBrandImageFields}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          applyCover={applyCover}
          setApplyCover={setApplyCover}
          brollList={brollList}
          setBrollList={setBrollList}
          setIsProcessing={setIsProcessing}
          setProgress={setProgress}
          awsTranscriptionItems={awsTranscriptionItems}
          setAwsTranscriptionItems={setAwsTranscriptionItems}
        />
      </div>
    </div>
  );
}