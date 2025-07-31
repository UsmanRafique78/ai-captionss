"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  Volume2,
  VolumeX,
  Palette,
  Briefcase,
  Music,
  BookOpen,
  Sparkles,
  Zap,
  Image,
  ChevronDown,
  MenuIcon,
  Subtitles,
  MoreVertical,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import SparklesIcon from "@/components/SparklesIcon";
import { fontMap } from "@/utils/fontMap";
import { readFileAsBase64 } from "@/utils/readFileAsBase64";
import DownloadSRTButton from "@/components/DownloadSRTButton";
import BrollPanel from "@/components/BrollPanel";

import { useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TranscriptionEditor from "@/components/TranscriptionEditor";
import axios from "axios";
export default function Test({
  filename,
  transcriptionItems,
  subtitleOptions,
  setSubtitleOptions,
  onGenerateSubtitle,
  brandTextFields,
  setBrandTextFields,
  brandImageFields,
  setBrandImageFields,
  coverImage,
  setCoverImage,
  applyCover,
  setApplyCover,
  setBrollList,
  brollList,
  awsTranscriptionItems = [],
  setAwsTranscriptionItems = () => {},
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [activeTab, setActiveTab] = useState("colors"); // State to manage active tab
  // new states
 const [timestamp] = useState(Date.now()); // runs once on mount

const videoUrl = useMemo(() => {
  const cleanFilename = filename?.endsWith("_preview.mp4")
  ? filename.replace("_preview.mp4", ".mp4")
  : filename || "";

  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/video/${cleanFilename}?t=${timestamp}`;
}, [filename, timestamp]);


  const [isBrollModified, setIsBrollModified] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#9747FF");
  const [outlineColor, setOutlineColor] = useState("#7D4BFF");
  const [progress, setProgress] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoWidth, setVideoWidth] = useState(1920);
  const [videoHeight, setVideoHeight] = useState(1080);
  const [fontSize, setFontSize] = useState(19);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontStyle, setFontStyle] = useState("normal");
  const [fontWeight, setFontWeight] = useState("normal");
  const [verticalPosition, setVerticalPosition] = useState(90);
  const [horizontalAlign, setHorizontalAlign] = useState("center");
  const [outlineWidth, setOutlineWidth] = useState(0);
  // const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  // const [backgroundRadius, setBackgroundRadius] = useState(8);
  const [backgroundPadding, setBackgroundPadding] = useState("20 10");

  const [textTransform, setTextTransform] = useState("none");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [lineHeight, setLineHeight] = useState(1.4);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxWordsPerLine, setMaxWordsPerLine] = useState(3);

  const [currentTime, setCurrentTime] = useState(0);


  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentCaption, setCurrentCaption] = useState(null);

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showBrandTextModal, setShowBrandTextModal] = useState(false);

  const [showBrandImageModal, setShowBrandImageModal] = useState(false);

  // newfeilds
  const [textCase, setTextCase] = useState("original");
  const [bounceStyle, setBounceStyle] = useState("original");
  const [userModifiedBounce, setUserModifiedBounce] = useState(false);
  const [bounceIntensity, setBounceIntensity] = useState(0.3);
  const [textDirection, setTextDirection] = useState(
    subtitleOptions?.textDirection || "ltr"
  );
  const bRollRefs = useRef([]);
  const [showBrollPanel, setShowBrollPanel] = useState(false);
  const [groupedItems, setGroupedItems] = useState([]);
  const [position, setPosition] = useState("bottom-center");
  const [customX, setCustomX] = useState(50);
  const [customY, setCustomY] = useState(90);
  const [enableShadow, setEnableShadow] = useState(false);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);

  function addManualLineBreaks(text, maxWordsPerLine) {
    const words = text.trim().split(/\s+/); // fix: handles multiple spaces
    const lines = [];
    let currentLine = [];

    for (let i = 0; i < words.length; i++) {
      currentLine.push(words[i]);

      if (currentLine.length >= maxWordsPerLine || i === words.length - 1) {
        lines.push(currentLine.join(" "));
        currentLine = [];
      }
    }

    return lines.join("\n");
  }

//  useEffect(() => {
//   const load = async () => {
//     const ffmpeg = ffmpegRef.current;
//     const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

//     await ffmpeg.load({
//       coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
//       wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
//     });

//     await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile());
//     await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile());

//     const modelResp = await fetch("/api/rnnoise-model");
//     if (!modelResp.ok) throw new Error("Could not load RNNoise model");
//     const modelBuf = await modelResp.arrayBuffer();
//     await ffmpeg.writeFile("sh.rnnn", new Uint8Array(modelBuf));

//     setLoaded(true);
//   };

//   load();
// }, []); // empty deps: run only once on mount


 

  useEffect(() => {
  if (videoRef.current && videoUrl) {
    videoRef.current.src = videoUrl;
    videoRef.current.load(); // optional: force reload
  }
}, [videoUrl]);

useEffect(() => {
  if (videoRef.current && videoUrl) {
    videoRef.current.src = videoUrl;
    videoRef.current.load(); // optional: force reload
  }
}, [videoUrl]);



  function applyTextTransform(text, transform) {
    switch (transform) {
      case "uppercase":
        return text.toUpperCase();
      case "lowercase":
        return text.toLowerCase();
      case "capitalize":
        return text.replace(/\b\w/g, (l) => l.toUpperCase());
      default:
        return text;
    }
  }

  function groupTranscriptionItems(items, wordsPerGroup, options = {}) {
    const { adjustTiming = true, minDuration = 0.5, maxDuration = 3 } = options;

    const grouped = [];
    let currentGroup = {
      content: "",
      start_time: null,
      end_time: null,
      words: [],
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const content = item.content || item.alternatives?.[0]?.content || "";
      const isWord = /\w/.test(content);
      if (!currentGroup.start_time && item.start_time) {
        currentGroup.start_time = parseFloat(item.start_time);
      }

      if (item.end_time) {
        currentGroup.end_time = parseFloat(item.end_time);
      }

      if (currentGroup.content) {
        currentGroup.content +=
          item.type === "punctuation" ? content : " " + content;
      } else {
        currentGroup.content = content;
      }

      currentGroup.words.push({ ...item, content });
      const wordCount = currentGroup.words.filter((w) =>
        /\w/.test(w.content)
      ).length;
      const isLast = i === items.length - 1;

      if (wordCount >= wordsPerGroup || isLast) {
        const group = {
          content: (currentGroup.content || "").trim(),
          start_time: currentGroup.start_time ?? 0,
          end_time: currentGroup.end_time ?? currentGroup.start_time ?? 0,
        };

        grouped.push(group);

        currentGroup = {
          content: "",
          start_time: null,
          end_time: null,
          words: [],
        };
      }
    }
    // console.log("🟨 Grouped captions", grouped);

    // ⏱️ Apply minDuration / maxDuration if enabled
    if (adjustTiming) {
      grouped.forEach((group) => {
        const duration = group.end_time - group.start_time;

        if (duration < minDuration) {
          group.end_time = group.start_time + minDuration;
        }

        if (duration > maxDuration) {
          group.end_time = group.start_time + maxDuration;
        }
      });
    }

    return grouped;
  }

  function applyTextCase(text, caseType) {
    switch (caseType) {
      case "upper":
        return text.toUpperCase();
      case "lower":
        return text.toLowerCase();
      case "title":
        return text.replace(
          /\w\S*/g,
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
      default:
        return text;
    }
  }

  function renderSubtitleToCanvas(
    text,
    primaryColor,
    outlineColor,
    maxWordsPerLine,
    textDirection
  ) {
    const testCanvas = document.createElement("canvas");
    const testCtx = testCanvas.getContext("2d");

    const scale = 2;
    const canvasWidth = videoWidth || 1920;
    const canvasHeight = Math.min(videoHeight * 0.4, 600);

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;

    const ctx = canvas.getContext("2d");

    ctx.direction = textDirection;
    ctx.textAlign =
      textDirection === "rtl"
        ? horizontalAlign === "left"
          ? "right"
          : horizontalAlign === "right"
          ? "left"
          : "center"
        : horizontalAlign;

    ctx.scale(scale, scale);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Background fill with opacity
    if (backgroundOpacity > 0) {
      const { r, g, b } = hexToRgb(backgroundColor);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${backgroundOpacity})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    const fontString = `${fontWeight} ${fontSize}px "${fontFamily}", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.font = fontString;
    testCtx.font = fontString;
    if (textDirection === "rtl") {
      ctx.textAlign = "right";
    } else {
      ctx.textAlign = horizontalAlign;
    }

    ctx.textBaseline = "middle";

    const transformedText = applyTextTransform(text, textTransform);

    const textWithBreaks = addManualLineBreaks(
      transformedText,
      maxWordsPerLine
    );

    function drawTextWithEffects(text, x, y, textDirection) {
      ctx.save();

      ctx.direction = textDirection;

      const align =
        textDirection === "rtl"
          ? horizontalAlign === "left"
            ? "right"
            : horizontalAlign === "right"
            ? "left"
            : "center"
          : horizontalAlign;

      ctx.textAlign = "left"; // We'll handle alignment manually
      ctx.textBaseline = "alphabetic";

      // Shadow
      if (enableShadow && shadowBlur > 0) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      ctx.fillStyle = primaryColor;
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;

      const dir = textDirection === "rtl" ? -1 : 1;
      const padX = 6;
      const padY = 4;

      const words = text.split(" ");
      const wordMetrics = words?.map((word) => ({
        word,
        width: ctx.measureText(word).width,
      }));
      const spaceWidth = ctx.measureText(" ").width + letterSpacing;

      const totalWidth =
        wordMetrics.reduce((sum, w) => sum + w.width, 0) +
        spaceWidth * (wordMetrics.length - 1);

      let startX = x;
      if (align === "center") {
        startX = x - (totalWidth / 2) * dir;
      } else if (align === "right") {
        startX = x - totalWidth * dir;
      }

      let cursorX = startX;

      wordMetrics.forEach(({ word, width }) => {
        // 🔲 Background box
        const rectX = cursorX - padX;
        const rectY = y - fontSize - padY;
        const rectWidth = width + padX * 2;
        const rectHeight = fontSize + padY * 2;

        const clampedOpacity = Math.min(1, Math.max(0, backgroundOpacity));
        ctx.fillStyle = `rgba(${hexToRgbString(
          backgroundColor
        )}, ${clampedOpacity})`;
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        // ✏️ Stroke
        if (outlineWidth > 0) {
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = outlineWidth;
          ctx.strokeText(word, cursorX, y);
        }

        // 🎨 Text fill
        ctx.fillStyle = primaryColor;
        ctx.fillText(word, cursorX, y);

        // ➡️ Move to next word
        cursorX += (width + spaceWidth) * dir;
      });

      ctx.restore();
    }

    const manualLines = textWithBreaks.split("\n");
    const allLines = [];

    const sideMargin = Math.max(60, canvasWidth * 0.05);

    const maxTextWidth = canvasWidth - sideMargin * 2 - outlineWidth * 2;

    for (const manualLine of manualLines) {
      const lineWidth = testCtx.measureText(manualLine).width;

      if (lineWidth <= maxTextWidth) {
        allLines.push(manualLine);
      } else {
        const words = manualLine.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine + (currentLine ? " " : "") + word;
          const testWidth = testCtx.measureText(testLine).width;

          if (testWidth > maxTextWidth && currentLine) {
            allLines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          allLines.push(currentLine.trim());
        }
      }
      // console.log(`Max words per line: ${maxWordsPerLine}`);
      // console.log(`Transformed text:`, transformedText);
      // console.log(`Text with breaks:\n${textWithBreaks}`);
      // console.log(`Lines count:`, allLines.length);
    }

    const actualLineHeight = fontSize * lineHeight;
    const totalHeight = allLines.length * actualLineHeight;
    const startY = (canvasHeight - totalHeight) / 2 + actualLineHeight / 2;

    // Use testCtx to measure max line width
    const longestLine = allLines.reduce((a, b) =>
      testCtx.measureText(a).width > testCtx.measureText(b).width ? a : b
    );
    const textWidth = testCtx.measureText(longestLine).width;
    let xPos;
    switch (horizontalAlign) {
      case "left":
        xPos = sideMargin + 10 + textWidth / 2;
        break;
      case "right":
        xPos = canvasWidth - sideMargin - 10 - textWidth / 2;
        break;
      default:
        xPos = canvasWidth / 2;
        break;
    }
    ctx.strokeStyle = "red";
    ctx.strokeRect(sideMargin, 0, canvasWidth - 2 * sideMargin, canvasHeight);

    allLines.forEach((line, index) => {
      const yPos = startY + index * actualLineHeight;
      drawTextWithEffects(line, xPos, yPos, textDirection);
    });

    // console.log(
    //   `Subtitle rendered: ${allLines.length} lines, Canvas: ${canvasWidth}x${canvasHeight}`
    // );

    return canvas;
  }

  async function canvasToBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  }

  const transcode = async () => {
   
    setIsProcessing(true);
    setProgress(0);

    try {
      // 1) Download video
    //   const response = await fetch(videoUrl);
    //   if (!response.ok) throw new Error("Failed to fetch video");
    //   const videoBlob = await response.blob();
    //   await ffmpeg.writeFile(filename, await fetchFile(videoBlob));

      // 2) Probe video dimensions
      videoRef.current.src = videoUrl;
      await new Promise((resolve, reject) => {
        videoRef.current.onloadedmetadata = () => {
          setVideoWidth(videoRef.current.videoWidth);
          setVideoHeight(videoRef.current.videoHeight);
          resolve();
        };
        videoRef.current.onerror = reject;
      });
      const words = [];

      for (let i = 0; i < transcriptionItems.length; i++) {
        const item = transcriptionItems[i];

        if (item.type === "pronunciation") {
          const start_time = parseFloat(item.start_time);
          const end_time = parseFloat(item.end_time);
          const content = item.alternatives?.[0]?.content || "";

          words.push({ start_time, end_time, content });

          // console.log("🟢 Pronunciation →", { start_time, end_time, content });
        } else if (item.type === "punctuation" && words.length > 0) {
          const punctuationContent = item.alternatives?.[0]?.content || "";
          const previousWord = words[words.length - 1];

          // Merge punctuation into the previous word's content (optional)
          previousWord.content += punctuationContent;

          // Push punctuation as a separate item (with same timing as previous word)
          words.push({
            start_time: previousWord.end_time,
            end_time: previousWord.end_time,
            content: punctuationContent,
          });

          // console.log("✏️ Punctuation →", {
          //   start_time: previousWord.end_time,
          //   end_time: previousWord.end_time,
          //   content: punctuationContent,
          // });
        }
      }

      const groupedItems = groupTranscriptionItems(
        words,
        subtitleOptions.wordsPerSegment,
        {
          adjustTiming: subtitleOptions.adjustTiming,
          minDuration: subtitleOptions.minDuration,
          maxDuration: subtitleOptions.maxDuration,
          textDirection:subtitleOptions?.textDirection || "ltr"

        }
      ); // ✅

      // console.log("✅ Grouped Subtitles", groupedItems);
      // console.log("🎨 Color being passed:", primaryColor);
      // console.log("🔠 Font family:", fontFamily);

      // 4) Render subtitle images
      for (let i = 0; i < groupedItems.length; i++) {
        const { content } = groupedItems[i];
        const transformed = applyTextTransform(content, textTransform); // ✅ Apply text transform
        const canvas = renderSubtitleToCanvas(
          transformed,
          content,
          primaryColor,
          primaryColor,
          outlineColor,
          maxWordsPerLine
        );
        // console.log("📋 Received primaryColor:", primaryColor);

        // const blob = await canvasToBlob(canvas);
        // await ffmpeg.writeFile(`subtitle_${i}.png`, await fetchFile(blob));
      }
      // console.log("🚀 Drawing subtitle with line breaks:", textWithBreaks);

    //   // 5) FFmpeg progress listener
    //   const duration = videoRef.current.duration;
    //   ffmpeg.off("log");
    //   ffmpeg.on("log", ({ message }) => {
    //     const m = /time=([0-9:.]+)/.exec(message);
    //     if (m?.[1]) {
    //       const [h, min, s] = m[1].split(":");
    //       const seconds = +h * 3600 + +min * 60 + +s;
    //       setProgress(Math.min(seconds / duration, 0.99));
    //     }
    //   });

    //   // 6) Prepare watermark overlay
    //   let watermarkInputs = [];
    //   let watermarkFilter = "";
    //   let finalMap = "";
    //   const lastVideoLabel = `[v${groupedItems.length - 1}]`;
    //   const watermarkInputIndex = 1 + groupedItems.length;

    //   if (brandImageFields.image) {
    //     const imageData = await fetch(brandImageFields.image).then((r) =>
    //       r.blob()
    //     );
    //     await ffmpeg.writeFile(
    //       "brand_watermark.png",
    //       await fetchFile(imageData)
    //     );
    //     watermarkInputs.push("-i", "brand_watermark.png");

    //     const x =
    //       brandImageFields.posX === 0
    //         ? "0"
    //         : brandImageFields.posX === 100
    //         ? "main_w-overlay_w"
    //         : `((main_w-overlay_w)*${brandImageFields.posX}/100)`;

    //     const y =
    //       brandImageFields.posY === 0
    //         ? "0"
    //         : brandImageFields.posY === 100
    //         ? "main_h-overlay_h"
    //         : `((main_h-overlay_h)*${brandImageFields.posY}/100)`;

    //     const opacity = brandImageFields.opacity / 100;

    //     watermarkFilter =
    //       `[${watermarkInputIndex}:v]scale=${brandImageFields.size}:-1,format=rgba,colorchannelmixer=aa=${opacity}[wm];` +
    //       `${lastVideoLabel}[wm]overlay=${x}:${y}:shortest=1[vwm]`;
    //     finalMap = "[vwm]";
    //   } else if (brandTextFields.text) {
    //     const x =
    //       brandTextFields.posX === 0
    //         ? "0"
    //         : brandTextFields.posX === 100
    //         ? "main_w-text_w"
    //         : `((main_w-text_w)*${brandTextFields.posX}/100)`;

    //     const y =
    //       brandTextFields.posY === 0
    //         ? "0"
    //         : brandTextFields.posY === 100
    //         ? "main_h-text_h"
    //         : `((main_h-text_h)*${brandTextFields.posY}/100)`;

    //     const fontfile =
    //       fontFamily === "Roboto" ? "/tmp/roboto.ttf" : "/tmp/roboto-bold.ttf";
    //     const fontColor = `white@${brandTextFields.opacity / 100}`;
    //     const safeText = brandTextFields.text
    //       .replace(/:/g, ":")
    //       .replace(/'/g, "\\'");

    //     watermarkFilter = `${lastVideoLabel}drawtext=fontfile=${fontfile}:text='${safeText}':fontcolor=${fontColor}:fontsize=${brandTextFields.size}:x=${x}:y=${y}:box=0[vwm]`;
    //     finalMap = "[vwm]";
    //   } else {
    //     finalMap = lastVideoLabel;
    //   }

      // 7) Build subtitle overlay filter chain
      let filterChain = "";
      for (let i = 0; i < groupedItems.length; i++) {
        const { start_time, end_time } = groupedItems[i];
        const st = parseFloat(start_time || 0).toFixed(2);
        const et = parseFloat(end_time || st).toFixed(2);
        const inputLabel = `[${i + 1}:v]`;
        const outLabel = `[v${i}]`;

        if (i === 0) {
          filterChain = `[0:v]${inputLabel}overlay=x=(W-w)/2:y=H-h-${verticalPosition}:enable='between(t,${st},${et})'${outLabel}`;
        } else {
          filterChain += `;[v${
            i - 1
          }]${inputLabel}overlay=x=(W-w)/2:y=H-h-${verticalPosition}:enable='between(t,${st},${et})'${outLabel}`;
        }
      }

      if (watermarkFilter) {
        filterChain += ";" + watermarkFilter;
      }

      // 8) Build input files and run ffmpeg
    //   const inputFiles = ["-i", filename];
    //   for (let i = 0; i < groupedItems.length; i++) {
    //     inputFiles.push("-i", `subtitle_${i}.png`);
    //   }
    //   inputFiles.push(...watermarkInputs);

    //   await ffmpeg.exec([
    //     ...inputFiles,
    //     ...(filterChain ? ["-filter_complex", filterChain] : []),
    //     "-map",
    //     finalMap,
    //     "-map",
    //     "0:a?",
    //     "-preset",
    //     "ultrafast",
    //     "-c:a",
    //     "aac",
    //     "output.mp4",
    //   ]);

    //   const data = await ffmpeg.readFile("output.mp4");
    //   videoRef.current.src = URL.createObjectURL(
    //     new Blob([data.buffer], { type: "video/mp4" })
    //   );
      setProgress(1);
      setIsProcessing(false);
    } catch (err) {
      console.error("Error during transcoding:", err);
      alert("Error occurred during processing. Check console.");
      setProgress(1);
      setIsProcessing(false);
    //   ffmpeg.off("log");
    }
  };

  // function to handle time update and subtitles (video progress with subtitles)
 const handleTimeUpdate = () => {
  if (!videoRef.current) return;
  
  const playedSeconds = videoRef.current.currentTime;
  setCurrentTime(playedSeconds);

  // Use the correct source for captions based on preview mode
  const sourceItems = subtitleOptions.preview ? groupedItems : transcriptionItems;
  
  const caption = sourceItems.find(
    (item) =>
      playedSeconds >= parseFloat(item.start_time || 0) &&
      playedSeconds <= parseFloat(item.end_time || item.start_time || 0)
  );

  if (caption) {
    setCurrentCaption({
      ...caption,
      content: caption?.alternatives?.[0]?.content || caption?.content || "",
    });
  } else {
    setCurrentCaption(null);
  }
};

// Fix 4: Add debugging to check B-roll and subtitle states
useEffect(() => {
  console.log("🎬 Current caption:", currentCaption?.content);
  console.log("🎥 Active B-rolls:", brollList.filter(b => 
    currentTime >= b.start_time && currentTime <= b.end_time
  ));
  console.log("⏰ Current time:", currentTime);
}, [currentCaption, currentTime, brollList]);

  useEffect(() => {
    if (!currentCaption?.content) return;
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const fontLabel = fontMap[fontFamily] || "Arial";
    const fontString = `${fontStyle || ""} ${fontWeight || "normal"} ${
      fontSize * 2
    }px "${fontLabel}", sans-serif`;

    //  Wait for the font to be available before drawing
    document.fonts.load(fontString).then(() => {
      // console.log("Font loaded:", fontString);

      canvas.width = videoRef.current?.videoWidth || 1920;
      canvas.height = videoRef.current?.videoHeight || 1080;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontString;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = primaryColor;
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth;

      if (enableShadow && shadowBlur > 0) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      const x = canvas.width / 2;
      const y = canvas.height - verticalPosition;
      const transformedText = applyTextCase(currentCaption.content, textCase);

      ctx.strokeText(transformedText, x, y);
      ctx.fillText(transformedText, x, y);
    });
  }, [
    currentCaption,
    fontWeight,
    fontSize,
    fontFamily,
    primaryColor,
    outlineColor,
    outlineWidth,
    verticalPosition,
    textCase,
    fontStyle,
    enableShadow,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
  ]);

  function hexToRgb(hex) {
    const match = hex.replace("#", "").match(/.{1,2}/g);
    const [r, g, b] = match?.map((x) => parseInt(x, 16));
    return { r, g, b };
  }
  function hexToRgbString(hex) {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2); // prevent overflow

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

useEffect(() => {
  if (!canvasRef.current) return;
  let animationFrameId;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const wordByWord =
    subtitleOptions?.style === "ali-1" && bounceStyle === "word-by-word";

  canvas.width = videoRef.current?.videoWidth || 1920;
  canvas.height = videoRef.current?.videoHeight || 1080;

  const draw = (timestamp) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check if video is playing and get current time
    if (!videoRef.current || videoRef.current.paused) {
      animationFrameId = requestAnimationFrame(draw);
      return;
    }

    const currentVideoTime = videoRef.current.currentTime;

    // Check if any B-roll is currently active
    const activeBroll = brollList.find(broll => 
      currentVideoTime >= broll.start_time && currentVideoTime <= broll.end_time
    );

    // Find current caption based on video time
    const sourceItems = subtitleOptions.preview ? groupedItems : transcriptionItems;
    const currentCaption = sourceItems.find(
      (item) =>
        currentVideoTime >= parseFloat(item.start_time) &&
        currentVideoTime <= parseFloat(item.end_time)
    );

    // Only show subtitles if we have a caption and either no B-roll or B-roll allows subtitles
    const shouldShowSubtitles = currentCaption?.content && (
      !activeBroll || // No B-roll active
      activeBroll.showSubtitles !== false // B-roll allows subtitles (default true)
    );

    if (!shouldShowSubtitles) {
      animationFrameId = requestAnimationFrame(draw);
      return;
    }

    const transformedText = applyTextCase(currentCaption.content, textCase);
    const textWithBreaks = addManualLineBreaks(
      transformedText,
      maxWordsPerLine || 2
    );
    const lines = textWithBreaks.split("\n");

    ctx.font = `${fontWeight || "normal"} ${fontSize * 2}px ${
      fontFamily || "Arial"
    }`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = primaryColor || "white";
    ctx.strokeStyle = outlineColor || "black";
    ctx.lineWidth = outlineWidth || 0;

   const { x, y, textAlign } = getPositionCoordinates(
  position,
  canvas.width,
  canvas.height,
  fontSize * 2,
  customX,
  customY,
  verticalPosition,
  horizontalAlign
);

// Set canvas text alignment based on position
ctx.textAlign = textAlign; // Use the returned textAlign instead of hardcoded "center"
ctx.textBaseline = "middle";
ctx.fillStyle = primaryColor || "white";
ctx.strokeStyle = outlineColor || "black";
ctx.lineWidth = outlineWidth || 0;

// Animation effects (keep this part the same)
let offsetY = 0;
let scale = 1;
const t = timestamp / 1000;

if (bounceStyle === "bounce") {
  offsetY = Math.sin(t * 2 * Math.PI) * 20 * (bounceIntensity || 1);
} else if (bounceStyle === "bounce-zoom") {
  scale = 1 + 0.1 * (bounceIntensity || 1) * Math.sin(t * 2 * Math.PI);
} else if (bounceStyle === "slide") {
  offsetY = Math.sin(t * 2 * Math.PI) * 40 * (bounceIntensity || 1);
}

const lineHeightPx = fontSize * 2 * lineHeight;
const totalHeight = lines.length * lineHeightPx;

// Clamp vertical position
let adjustedY = y + offsetY;
if (adjustedY + totalHeight / 2 > canvas.height) {
  adjustedY = canvas.height - totalHeight / 2 - 20;
}
if (adjustedY - totalHeight / 2 < 0) {
  adjustedY = totalHeight / 2 + 20;
}

const startY = -totalHeight / 2 + lineHeightPx / 2;
ctx.save();
ctx.translate(x, adjustedY);
ctx.scale(scale, scale);

// Update the line rendering part
lines.forEach((line, i) => {
  const lineY = startY + i * lineHeightPx;
  
  // For word-by-word rendering, adjust starting position based on alignment
  if (wordByWord) {
    const words = line.split(" ");
    let cursorX = 0;
    
    // Calculate total line width for alignment
    const totalLineWidth = line
      .split("")
      .reduce((acc, char) => acc + ctx.measureText(char).width, 0) +
      (line.length - 1) * letterSpacing;
    
    // Adjust starting position based on text alignment
    if (textAlign === "center") {
      cursorX = -totalLineWidth / 2;
    } else if (textAlign === "right") {
      cursorX = -totalLineWidth;
    } else {
      cursorX = 0; // left alignment
    }

    for (let j = 0; j < words.length; j++) {
      const word = words[j];
      const wordWidth = ctx.measureText(word).width;
      const spaceWidth = ctx.measureText(" ").width + letterSpacing;

      // Background for word
      if (backgroundOpacity > 0) {
        const rectX = cursorX - backgroundPadding / 2;
        const rectY = lineY - fontSize * 1 - backgroundPadding / 4;
        const rectWidth = wordWidth + backgroundPadding;
        const rectHeight = fontSize * 2 + backgroundPadding;

        const { r, g, b } = hexToRgb(backgroundColor);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${backgroundOpacity})`;
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
      }

      // Set text fill style back
      ctx.fillStyle = primaryColor;
      
      // Shadow
      if (enableShadow && shadowBlur > 0) {
        ctx.shadowColor = shadowColor;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
        ctx.shadowBlur = shadowBlur;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
      }

      if (outlineWidth > 0) {
        ctx.strokeText(word, cursorX + wordWidth / 2, lineY);
      }
      ctx.fillText(word, cursorX + wordWidth / 2, lineY);

      cursorX += wordWidth + spaceWidth;
    }
  } else {
    // Full line rendering - the canvas textAlign will handle positioning
    
    // Background
    if (backgroundOpacity > 0) {
      const totalLineWidth = line
        .split("")
        .reduce((acc, char) => acc + ctx.measureText(char).width, 0) +
        (line.length - 1) * letterSpacing;
      
      const paddingX = backgroundPadding;
      const paddingY = backgroundPadding / 2;
      
      let bgX = -paddingX;
      if (textAlign === "center") {
        bgX = -totalLineWidth / 2 - paddingX;
      } else if (textAlign === "right") {
        bgX = -totalLineWidth - paddingX;
      }
      
      const bgY = lineY - fontSize * 2 - paddingY / 2;
      const bgWidth = totalLineWidth + paddingX * 2;
      const bgHeight = fontSize * 2 + paddingY * 2;

      const { r, g, b } = hexToRgb(backgroundColor);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${backgroundOpacity})`;
      drawRoundedRect(ctx, bgX, bgY, bgWidth, bgHeight, backgroundRadius);
    }

    // Set text fill style back
    ctx.fillStyle = primaryColor;

    // Shadow
    if (enableShadow && shadowBlur > 0) {
      ctx.shadowColor = shadowColor;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
      ctx.shadowBlur = shadowBlur;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    }

    if (letterSpacing === 0) {
      if (outlineWidth > 0) ctx.strokeText(line, 0, lineY);
      ctx.fillText(line, 0, lineY);
    } else {
      // Handle letter spacing with proper alignment
      let startX = 0;
      const totalLineWidth = line
        .split("")
        .reduce((acc, char) => acc + ctx.measureText(char).width, 0) +
        (line.length - 1) * letterSpacing;

      if (textAlign === "center") {
        startX = -totalLineWidth / 2;
      } else if (textAlign === "right") {
        startX = -totalLineWidth;
      }

      let cursorX = startX;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const charWidth = ctx.measureText(char).width;

        if (outlineWidth > 0) ctx.strokeText(char, cursorX, lineY);
        ctx.fillText(char, cursorX, lineY);
        cursorX += charWidth + letterSpacing;
      }
    }
  }
});

ctx.restore();
    animationFrameId = requestAnimationFrame(draw);
  };

  animationFrameId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(animationFrameId);
}, [
  currentCaption,
  fontWeight,
  fontSize,
  fontFamily,
  primaryColor,
  outlineColor,
  outlineWidth,
  verticalPosition,
  textCase,
  bounceStyle,
  bounceIntensity,
  maxWordsPerLine,
  position,
  customX,
  customY,
  enableShadow,
  shadowColor,
  shadowBlur,
  shadowOffsetX,
  shadowOffsetY,
  horizontalAlign,
  lineHeight,
  letterSpacing,
  brollList, // Add brollList to dependencies
  subtitleOptions.preview,
  groupedItems,
  transcriptionItems
]);

  function getPositionCoordinates(
  position,
  canvasWidth,
  canvasHeight,
  textHeight = 0,
  customX = 50,
  customY = 90,
  verticalOffset = 0,
  horizontalAlign = "center",
  
) {
  let x = canvasWidth / 2;
  let y = canvasHeight - 100;
  const bottomMargin = -50;
  const margin = 30;
  let textAlign = "center"; // Add textAlign to return value

  switch (position) {
    case "top-left":
      x = margin;
      y = margin + textHeight;
      textAlign = "left";
      break;
    case "top-center":
      x = canvasWidth / 2;
      y = margin + textHeight;
      textAlign = "center";
      break;
    case "top-right":
      x = canvasWidth - margin;
      y = margin + textHeight;
      textAlign = "right";
      break;
    case "middle-left":
      x = margin;
      y = canvasHeight / 2;
      textAlign = "left";
      break;
    case "middle-center":
      x = canvasWidth / 2;
      y = canvasHeight / 2;
      textAlign = "center";
      break;
    case "middle-right":
      x = canvasWidth - margin;
      y = canvasHeight / 2;
      textAlign = "right";
      break;
    case "bottom-left":
      x = margin;
    y = canvasHeight - textHeight / 2 - bottomMargin;
      textAlign = "left";
      break;
    case "bottom-center":
      x = canvasWidth / 2;
      y = canvasHeight - textHeight / 2 - bottomMargin;
      textAlign = "center";
      break;
    case "bottom-right":
      x = canvasWidth - margin;
      y = canvasHeight - textHeight / 2 - bottomMargin;
      textAlign = "right";
      break;
    case "custom":
      x = (canvasWidth * customX) / 100;
      y = (canvasHeight * customY) / 100;
      textAlign = horizontalAlign;
      break;
  }

  // Apply vertical offset from slider
  y -= verticalOffset;

  // For custom position, respect the horizontalAlign setting
  if (position === "custom") {
    if (horizontalAlign === "left") {
      x = (canvasWidth * customX) / 100;
      textAlign = "left";
    } else if (horizontalAlign === "right") {
      x = (canvasWidth * customX) / 100;
      textAlign = "right";
    } else {
      x = (canvasWidth * customX) / 100;
      textAlign = "center";
    }
  }

  return { x, y, textAlign };
}

  // Dropdown and modal handlers
  const handleApplyBrandClick = () => {
    setShowBrandDropdown((prev) => !prev);
  };
  const handleBrandDropdownSelect = (option) => {
    setShowBrandDropdown(false);
    if (option === "text") {
      setShowBrandTextModal(true);
    }
    if (option === "image") {
      setShowBrandImageModal(true);
    }
  };
  const handleBrandTextFieldChange = (field, value) => {
    setBrandTextFields((prev) => ({ ...prev, [field]: value }));
  };
  const handleCloseBrandTextModal = () => {
    setShowBrandTextModal(false);
  };
  const handleDeleteBrandText = () => {
    setBrandTextFields({ text: "", size: 24, posX: 5, posY: 20, opacity: 100 });
    setShowBrandTextModal(false);
  };
  const handleBrandImageFieldChange = (field, value) => {
    setBrandImageFields((prev) => ({ ...prev, [field]: value }));
  };
  const handleBrandImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBrandImageFields((prev) => ({ ...prev, image: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCloseBrandImageModal = () => {
    setShowBrandImageModal(false);
  };
  const handleDeleteBrandImage = () => {
    setBrandImageFields({
      image: null,
      size: 100,
      posX: 5,
      posY: 20,
      opacity: 100,
      position: "bottom-right",
    });
    setShowBrandImageModal(false);
  };

  // console.log(" brollList", brollList);

  useEffect(() => {
  if (!videoRef.current) return;

  bRollRefs.current.forEach((video, i) => {
    const broll = brollList[i];
    if (video && broll) {
      const currentVideoTime = videoRef.current.currentTime;
      const shouldShow =
        currentVideoTime >= broll.start_time && currentVideoTime <= broll.end_time;

      console.log(
        `B-Roll #${i} | Current Time: ${currentVideoTime.toFixed(2)} | Start: ${broll.start_time} | End: ${broll.end_time} | Show: ${shouldShow}`
      );

      if (shouldShow) {
        // Sync B-roll time with main video
        const brollTime = currentVideoTime - broll.start_time;
        if (Math.abs(video.currentTime - brollTime) > 0.5) {
          video.currentTime = brollTime;
        }
        
        if (video.paused) {
          video.play().catch(console.error);
        }
        
        // Set opacity for smooth transition
        video.style.opacity = '1';
      } else {
        if (!video.paused) {
          video.pause();
        }
        video.style.opacity = '0';
      }
    }
  });
}, [currentTime, brollList]);

  // console.log("🎥 B-roll video src:", broll.path);

  //

  // useEffect(() => {
  //   console.log("🟨 transcriptionItems", transcriptionItems);
  // }, [transcriptionItems]);
  useEffect(() => {
    if (!transcriptionItems || transcriptionItems.length === 0) return;
    const grouped = groupTranscriptionItems(
      transcriptionItems,
      subtitleOptions.wordsPerSegment,
      {
        adjustTiming: subtitleOptions.adjustTiming,
        minDuration: subtitleOptions.minDuration,
        maxDuration: subtitleOptions.maxDuration,
      }
    );

    setGroupedItems(grouped);
  }, [
    transcriptionItems,
    subtitleOptions.wordsPerSegment,
    subtitleOptions.adjustTiming,
    subtitleOptions.minDuration,
    subtitleOptions.maxDuration,
  ]);
  useEffect(() => {
    if (subtitleOptions.preview && videoRef.current) {
      videoRef.current.currentTime = 0;
      // videoRef.current.play();
      const timeout = setTimeout(() => {
        videoRef.current.pause();
      }, subtitleOptions.previewDuration * 1000);

      return () => clearTimeout(timeout);
    }
  }, [subtitleOptions.preview, subtitleOptions.previewDuration]);

  useEffect(() => {
    if (subtitleOptions.language === "urdu") {
      setFontFamily("urduNastaliq");
    } else if (subtitleOptions.language === "arabic") {
      setFontFamily("Amiri");
    } else {
      setFontFamily("Arial"); // default for English
    }
  }, [subtitleOptions.language]);

  // useEffect(() => {
  //   console.log("🧪 Grouped items updated →", groupedItems);
  // }, [groupedItems]);

  useEffect(() => {
    if (
      subtitleOptions.language === "urdu" ||
      subtitleOptions.language === "arabic"
    ) {
      setSubtitleOptions((prev) => ({ ...prev, textDirection: "rtl" }));
    } else {
      setSubtitleOptions((prev) => ({ ...prev, textDirection: "ltr" }));
    }
  }, [subtitleOptions.language]);

  useEffect(() => {
    if (userModifiedBounce) return;

    const defaultIntensityMap = {
      bounce: 0.4,
      zoom: 0.3,
      "bounce-zoom": 0.5,
      slide: 0.6,
      "fade-bounce": 0.4,
      elastic: 0.6,
      original: 0.3,
    };

    const newIntensity = defaultIntensityMap[bounceStyle] ?? 0.3;
    setBounceIntensity(newIntensity);
  }, [bounceStyle, userModifiedBounce]);

  const getPositionX = () => {
    if (position === "top-left" || position === "bottom-left") return 5;
    if (position === "top-right" || position === "bottom-right") return 95;
    return 50; // center
  };

  const getPositionY = () => {
    if (position === "top-left" || position === "top-right") return 5;
    if (position === "bottom-left" || position === "bottom-right") return 95;
    return 50; // center
  };
  function getBrandImagePosition(pos, posX, posY) {
    // If custom, use posX/posY directly
    if (!pos || pos === "")
      return { x: posX ?? 50, y: posY ?? 50, center: false };
    switch (pos) {
      case "top-left":
        return { x: 0, y: 0, center: false };
      case "top-center":
        return { x: 50, y: 0, center: true };
      case "top-right":
        return { x: 100, y: 0, center: false };
      case "middle-left":
        return { x: 0, y: 50, center: false };
      case "middle-center":
      case "center":
        return { x: 50, y: 50, center: true };
      case "middle-right":
        return { x: 100, y: 50, center: false };
      case "bottom-left":
        return { x: 0, y: 100, center: false };
      case "bottom-center":
        return { x: 50, y: 100, center: true };
      case "bottom-right":
        return { x: 100, y: 100, center: false };
      default:
        return { x: posX ?? 50, y: posY ?? 50, center: false };
    }
  }
  function getBrandTextPosition(pos, posX, posY) {
    if (!pos || pos === "")
      return { x: posX ?? 50, y: posY ?? 50, center: false };
    switch (pos) {
      case "top-left":
        return { x: 0, y: 0, center: false };
      case "top-right":
        return { x: 100, y: 0, center: false };
      case "center":
        return { x: 50, y: 50, center: true };
      case "bottom-left":
        return { x: 0, y: 100, center: false };
      case "bottom-right":
        return { x: 100, y: 100, center: false };
      default:
        return { x: posX ?? 50, y: posY ?? 50, center: false };
    }
  }

  useEffect(() => {
    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubtitleOptions((prev) => ({
          ...prev,
          coverImagePath: reader.result,
        }));
      };
      reader.readAsDataURL(coverImage);
    }
  }, [coverImage]);

  useEffect(() => {
    setSubtitleOptions((prev) => ({
      ...prev,

      // TEXT Watermark
      watermarkText: brandTextFields.text || undefined,
      watermarkSize: brandTextFields.size || undefined,
      watermarkOpacity: brandTextFields.opacity / 100 || undefined,
      watermarkPosition: brandTextFields.position || "top-left",
      watermarkFontWeight: brandTextFields.fontWeight || "bold",
      watermarkTextPosX: brandTextFields.posX ?? prev.watermarkTextPosX ?? 0,
      watermarkTextPosY: brandTextFields.posY ?? prev.watermarkTextPosY ?? 0,

      // IMAGE Watermark (do NOT overwrite X/Y here!)
      watermarkImagePath: brandImageFields.image || undefined,
      watermarkImageScale: brandImageFields.size / 100 || undefined,
      watermarkImageOpacity: brandImageFields.opacity / 100 || undefined,
      watermarkImagePosition: brandImageFields.position || "top-right",

      // Font
      font: fontFamily,
      fontWeight,
      fontStyle,
    }));
  }, [brandTextFields, brandImageFields, fontFamily, fontWeight, fontStyle]);

  useEffect(() => {
    if (!brandImageFields.image) return;

    const posMap = {
      "top-left": { x: 5, y: 5 },
      "top-right": { x: 95, y: 5 },
      "bottom-left": { x: 5, y: 95 },
      "bottom-right": { x: 95, y: 95 },
      center: { x: 50, y: 50 },
    };

    const pos = posMap[brandImageFields.position || "bottom-right"];

    setSubtitleOptions((prev) => ({
      ...prev,
      watermarkImage: brandImageFields.image,
      watermarkImageSize: brandImageFields.size,
      watermarkImageOpacity: brandImageFields.opacity,
      watermarkImagePosition: brandImageFields.position,
      watermarkImagePosX: pos.x,
      watermarkImagePosY: pos.y,
    }));
  }, [brandImageFields]);

  const handleCoverImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file); // still storing raw file in state (optional)

      const base64 = await readFileAsBase64(file);
      setSubtitleOptions((prev) => ({
        ...prev,
        coverImagePath: base64,
      }));
    }
  };

  const renderControls = () => {
    switch (activeTab) {
      case "colors":
        return (
          <div>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Basic Controls</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                   value={primaryColor || "#9747FF"}
                    onChange={(ev) => setPrimaryColor(ev.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="outline-color">Outline Color</Label>
                  <Input
                    onChange={(ev) => setOutlineColor(ev.target.value)}
                    id="outline-color"
                    type="color"
                   value={outlineColor || "#7D4BFF"} 
                  />
                </div>
                <label className="text-black flex items-center">
                  <span className="w-32">Outline width:</span>
                  <input
                    type="range"
                    className="ml-2 flex-1 black-500"
                    min="0"
                    max="20"
                    value={outlineWidth}
                    onChange={(ev) =>
                      setOutlineWidth(Number.parseInt(ev.target.value))
                    }
                  />
                  <span className="ml-2 w-12">{outlineWidth}px</span>
                </label>
                {/* === Background Color & Opacity === */}
                {/* <label className="text-black flex items-center">
                  <span className="w-32">Background:</span>
                  <input
                    type="color"
                    className="ml-2"
                    value={backgroundColor}
                    onChange={(ev) => setBackgroundColor(ev.target.value)}
                  />
                  <input
                    type="range"
                    className="ml-2 flex-1 black-500"
                    min="0"
                    max="1"
                    step="0.1"
                    value={backgroundOpacity}
                    onChange={(ev) =>
                      setBackgroundOpacity(Number.parseFloat(ev.target.value))
                    }
                  />
                  <span className="ml-2 w-12">
                    {Math.round(backgroundOpacity * 100)}%
                  </span>
                </label>
                {/* === Background Padding === */}
                {/* <div className="flex flex-col gap-2 text-black">
                  <label
                    htmlFor="backgroundPadding"
                    className="text-sm font-medium"
                  >
                    Background Padding
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="backgroundPadding"
                      type="range"
                      className="w-full back-500"
                      min={0}
                      max={100}
                      value={backgroundPadding}
                      onChange={(e) =>
                        setBackgroundPadding(Number.parseInt(e.target.value))
                      }
                    />
                    <span className="text-sm w-12 text-right">
                      {backgroundPadding}px
                    </span>
                  </div>
                </div>
                === Background Radius === */}
                {/* <label className="text-black flex flex-col">
                  <span className="mb-1">Background Radius</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={backgroundRadius}
                    onChange={(e) =>
                      setBackgroundRadius(Number(e.target.value))
                    }
                    className="black-500"
                  /> */}
                {/* </label>  */}
              </CardContent>
            </Card>
          </div>
        );
      case "brand":
        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Brand Settings</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Text Branding Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">📝</span>
                    <h3 className="text-lg font-semibold">Text Branding</h3>
                  </div>

                  <div className="grid gap-4">
                    <label className="block">
                      <span className="text-gray-700 font-semibold">Text</span>
                      <input
                        type="text"
                      disabled={subtitleOptions.blackout}

                        className="w-full border rounded px-3 py-2 mt-1 text-black"
                        value={brandTextFields.text}
                        onChange={(e) =>
                          handleBrandTextFieldChange("text", e.target.value)
                        }
                        placeholder="Enter your brand text"
                      />
                    </label>

                    <label className="block">
                      <span className="text-gray-700 font-semibold">
                        Position
                      </span>
                      <select
                        className="w-full border rounded px-3 py-2 mt-1 text-black"
                        value={brandTextFields.position}
                      disabled={subtitleOptions.blackout}

                        onChange={(e) =>
                          handleBrandTextFieldChange("position", e.target.value)
                        }
                      >
                        <option value="">Custom (Use X/Y)</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="center">Center</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-gray-700 font-semibold">Size</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                      disabled={subtitleOptions.blackout}

                          min="8"
                          max="100"
                          value={brandTextFields.size}
                          onChange={(e) =>
                            handleBrandTextFieldChange(
                              "size",
                              parseInt(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                        <span className="min-w-[60px] text-sm">
                          {brandTextFields.size} px
                        </span>
                      </div>
                    </label>

                    {brandTextFields.position === "" && (
                      <>
                        <label className="block">
                          <span className="text-gray-700 font-semibold">
                            Position X
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                      disabled={subtitleOptions.blackout}

                              type="range"
                              min="0"
                              max="100"
                              value={brandTextFields.posX}
                              onChange={(e) =>
                                handleBrandTextFieldChange(
                                  "posX",
                                  parseInt(e.target.value)
                                )
                              }
                              className="flex-1"
                            />
                            <span className="min-w-[60px] text-sm">
                              {brandTextFields.posX} %
                            </span>
                          </div>
                        </label>

                        <label className="block">
                          <span className="text-gray-700 font-semibold">
                            Position Y
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="range"
                      disabled={subtitleOptions.blackout}

                              min="0"
                              max="100"
                              value={brandTextFields.posY}
                              onChange={(e) =>
                                handleBrandTextFieldChange(
                                  "posY",
                                  parseInt(e.target.value)
                                )
                              }
                              className="flex-1"
                            />
                            <span className="min-w-[60px] text-sm">
                              {brandTextFields.posY} %
                            </span>
                          </div>
                        </label>
                      </>
                    )}

                    <label className="block">
                      <span className="text-gray-700 font-semibold">
                        Opacity
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="0"
                      disabled={subtitleOptions.blackout}

                          max="100"
                          value={brandTextFields.opacity}
                          onChange={(e) =>
                            handleBrandTextFieldChange(
                              "opacity",
                              parseInt(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                        <span className="min-w-[60px] text-sm">
                          {brandTextFields.opacity} %
                        </span>
                      </div>
                    </label>

                    <div className="flex gap-2 pt-2">
                      {/* <button
                  onClick={() => handleBrandDropdownSelect("text")}
                  disabled={!loaded || transcriptionItems.length === 0 || isProcessing}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon />
                  <span>Apply Text Brand</span>
                </button> */}
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                        onClick={handleDeleteBrandText}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Branding Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🖼️</span>
                    <h3 className="text-lg font-semibold">Image Branding</h3>
                  </div>

                  <div className="grid gap-4">
                    <label className="block">
                      <span className="text-gray-700 font-semibold">Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border rounded px-3 py-2 mt-1"
                        onChange={handleBrandImageUpload}
                      />
                    </label>

                    {brandImageFields.image && (
                      <div className="flex justify-center mb-2">
                        <Image
                          src={brandImageFields.image}
                          alt="Brand Preview"
                          style={{
                            maxWidth: "120px",
                            maxHeight: "80px",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      </div>
                    )}

                    <label className="block">
                      <span className="text-gray-700 font-semibold">Size</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                      disabled={subtitleOptions.blackout}

                          min="5"
                          max="50"
                          value={brandImageFields.size}
                          onChange={(e) =>
                            handleBrandImageFieldChange(
                              "size",
                              parseInt(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                        <span className="min-w-[60px] text-sm">
                          {brandImageFields.size} px
                        </span>
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-gray-700 font-semibold">
                        Position
                      </span>
                      <select
                        className="w-full border rounded px-3 py-2 mt-1 text-black"
                      disabled={subtitleOptions.blackout}

                        value={brandImageFields.position}
                        onChange={(e) =>
                          handleBrandImageFieldChange(
                            "position",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Custom (Use X/Y)</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="center">Center</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </label>

                    {brandImageFields.position === "" && (
                      <>
                        <label className="block">
                          <span className="text-gray-700 font-semibold">
                            Position X
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                      disabled={subtitleOptions.blackout}

                              type="range"
                              min="0"
                              max="100"
                              value={brandImageFields.posX}
                              onChange={(e) =>
                                handleBrandImageFieldChange(
                                  "posX",
                                  parseInt(e.target.value)
                                )
                              }
                              className="flex-1"
                            />
                            <span className="min-w-[60px] text-sm">
                              {brandImageFields.posX} %
                            </span>
                          </div>
                        </label>

                        <label className="block">
                          <span className="text-gray-700 font-semibold">
                            Position Y
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="range"
                      disabled={subtitleOptions.blackout}

                              min="0"
                              max="100"
                              value={brandImageFields.posY}
                              onChange={(e) =>
                                handleBrandImageFieldChange(
                                  "posY",
                                  parseInt(e.target.value)
                                )
                              }
                              className="flex-1"
                            />
                            <span className="min-w-[60px] text-sm">
                              {brandImageFields.posY} %
                            </span>
                          </div>
                        </label>
                      </>
                    )}

                    <label className="block">
                      <span className="text-gray-700 font-semibold">
                        Opacity
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="0"
                      disabled={subtitleOptions.blackout}

                          max="100"
                          value={brandImageFields.opacity}
                          onChange={(e) =>
                            handleBrandImageFieldChange(
                              "opacity",
                              parseInt(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                        <span className="min-w-[60px] text-sm">
                          {brandImageFields.opacity} %
                        </span>
                      </div>
                    </label>

                    <div className="flex gap-2 pt-2">
                      {/* <button
                  onClick={() => handleBrandDropdownSelect("image")}
                  disabled={!loaded || transcriptionItems.length === 0 || isProcessing || !brandImageFields.image}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon />
                  <span>Apply Image Brand</span>
                </button> */}
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                        onClick={handleDeleteBrandImage}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keep existing modals for backward compatibility if needed */}
            {/* {showBrandTextModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40"> */}
            {/* <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <h3 className="text-lg font-bold mb-2">
              Text Brand Settings
            </h3>
            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">Text</span>
              <input
                type="text"
                className="w-full border rounded px-2 py-1 mt-1 text-black"
                value={brandTextFields.text}
                onChange={(e) =>
                  handleBrandTextFieldChange("text", e.target.value)
                }
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">
                Position
              </span>
              <select
                className="w-full border rounded px-2 py-1 mt-1 text-black"
                value={brandTextFields.position}
                onChange={(e) =>
                  handleBrandTextFieldChange("position", e.target.value)
                }
              >
                <option value="">Custom (Use X/Y)</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </label>

            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">Size</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="8"
                  max="100"
                  value={brandTextFields.size}
                  onChange={(e) =>
                    handleBrandTextFieldChange(
                      "size",
                      parseInt(e.target.value)
                    )
                  }
                  className="flex-1"
                />
                <span>{brandTextFields.size} px</span>
              </div>
            </label>
            {brandTextFields.position === "" && (
              <>
                <label className="block mb-2">
                  <span className="text-gray-700 font-semibold">
                    Position X
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brandTextFields.posX}
                      onChange={(e) =>
                        handleBrandTextFieldChange(
                          "posX",
                          parseInt(e.target.value)
                        )
                      }
                      className="flex-1"
                    />
                    <span>{brandTextFields.posX} %</span>
                  </div>
                </label>

                <label className="block mb-2">
                  <span className="text-gray-700 font-semibold">
                    Position Y
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brandTextFields.posY}
                      onChange={(e) =>
                        handleBrandTextFieldChange(
                          "posY",
                          parseInt(e.target.value)
                        )
                      }
                      className="flex-1"
                    />
                    <span>{brandTextFields.posY} %</span>
                  </div>
                </label>
              </>
            )}

            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">Opacity</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brandTextFields.opacity}
                  onChange={(e) =>
                    handleBrandTextFieldChange(
                      "opacity",
                      parseInt(e.target.value)
                    )
                  }
                  className="flex-1"
                />
                <span>{brandTextFields.opacity} %</span>
              </div>
            </label>
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded flex items-center gap-1"
                onClick={handleDeleteBrandText}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-1 rounded"
                onClick={handleCloseBrandTextModal}
              >
                Close
              </button>
            </div>
          </div> */}
            {/* </div>
      )} */}

            {/* Brand Image Modal */}
            {/* {showBrandImageModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40"> */}
            {/* <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
            <h3 className="text-lg font-bold mb-2">
              Image Brand Settings
            </h3>
            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">Image</span>
              <input
                type="file"
                accept="image/*"
                className="w-full border rounded px-2 py-1 mt-1"
                onChange={handleBrandImageUpload}
              />
            </label>
            {brandImageFields.image && (
              <div className="mb-2 flex justify-center">
                <img
                  src={brandImageFields.image}
                  alt="Brand Preview"
                  style={{
                    maxWidth: "120px",
                    maxHeight: "80px",
                    borderRadius: "6px",
                  }}
                />
              </div>
            )}
            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">Size</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={brandImageFields.size}
                  onChange={(e) =>
                    handleBrandImageFieldChange(
                      "size",
                      parseInt(e.target.value)
                    )
                  }
                  className="flex-1"
                />
                <span>{brandImageFields.size} px</span>
              </div>
            </label>
            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">
                Position
              </span>
              <select
                className="w-full border rounded px-2 py-1 mt-1 text-black"
                value={brandImageFields.position}
                onChange={(e) =>
                  handleBrandImageFieldChange("position", e.target.value)
                }
              >
                <option value="">Custom (Use X/Y)</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </label>

            {brandImageFields.position === "" && (
              <>
                <label className="block mb-2">
                  <span className="text-gray-700 font-semibold">
                    Position X
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brandImageFields.posX}
                      onChange={(e) =>
                        handleBrandImageFieldChange(
                          "posX",
                          parseInt(e.target.value)
                        )
                      }
                      className="flex-1"
                    />
                    <span>{brandImageFields.posX} %</span>
                  </div>
                </label>

                <label className="block mb-2">
                  <span className="text-gray-700 font-semibold">
                    Position Y
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brandImageFields.posY}
                      onChange={(e) =>
                        handleBrandImageFieldChange(
                          "posY",
                          parseInt(e.target.value)
                        )
                      }
                      className="flex-1"
                    />
                    <span>{brandImageFields.posY} %</span>
                  </div>
                </label>
              </>
            )}

            <label className="block mb-2">
              <span className="text-gray-700 font-semibold">Opacity</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brandImageFields.opacity}
                  onChange={(e) =>
                    handleBrandImageFieldChange(
                      "opacity",
                      parseInt(e.target.value)
                    )
                  }
                  className="flex-1"
                />
                <span>{brandImageFields.opacity} %</span>
              </div>
            </label>
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded flex items-center gap-1"
                onClick={handleDeleteBrandImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-1 rounded"
                onClick={handleCloseBrandImageModal}
              >
                Close
              </button>
            </div>
          </div> */}
            {/* </div>
      )} */}
          </>
        );

      case "audio":
        return (
          <Card className="bg-white text-black">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Audio Bitrate Selector */}
              <div className="grid gap-1">
                <Label htmlFor="audio-bitrate" className="text-sm font-medium">
                  Audio Bitrate
                </Label>
                <Select
                      disabled={subtitleOptions.blackout}

                  value={subtitleOptions.audioBitrate}
                  onValueChange={(value) =>
                    setSubtitleOptions((prev) => ({
                      ...prev,
                      audioBitrate: value,
                    }))
                  }
                >
                  <SelectTrigger
                    id="audio-bitrate"
                      disabled={subtitleOptions.blackout}

                    className="bg-gray-100 text-black border border-gray-300"
                  >
                    <SelectValue placeholder="Select bitrate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="64k">64 kbps</SelectItem>
                    <SelectItem value="128k">128 kbps</SelectItem>
                    <SelectItem value="192k">192 kbps</SelectItem>
                    <SelectItem value="256k">256 kbps</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600 mt-1 italic">
                  Current Bitrate:{" "}
                  <strong>{subtitleOptions.audioBitrate}</strong> —{" "}
                  {subtitleOptions.audioBitrate === "128k"
                    ? "Standard"
                    : subtitleOptions.audioBitrate === "192k"
                    ? "Good"
                    : subtitleOptions.audioBitrate === "256k"
                    ? "High Quality"
                    : "Low Quality"}
                </p>
              </div>

              {/* Mute Audio */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mute-audio"
                  checked={subtitleOptions.noAudio}
                  onCheckedChange={(checked) =>
                    setSubtitleOptions((prev) => ({
                      ...prev,
                      noAudio: Boolean(checked),
                    }))
                  }
                />
                <Label htmlFor="mute-audio" className="text-sm">
                  Mute Audio
                </Label>
              </div>

              {/* Auto Adjust Timing */}
              {/* <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subtitleOptions.adjustTiming}
                  onChange={(e) =>
                    setSubtitleOptions((prev) => ({
                      ...prev,
                      adjustTiming: e.target.checked,
                    }))
                  }
                  className="black-600 w-4 h-4"
                />
                <label className="text-sm select-none">
                  Auto Adjust Timing
                </label>
              </div> */}
            </CardContent>
          </Card>
        );
      case "subtitle":
        return (
          <Card className="bg-white text-black">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Subtitle Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Max words per line */}

              {/* <label className="text-black">
                Preview Duration (sec)
                <input
                  type="number"
                  value={subtitleOptions.previewDuration}
                  className="ml-2 bg-gray-100 text-black p-2 rounded border border-gray-300"
                  onChange={(e) =>
                    setSubtitleOptions((prev) => ({
                      ...prev,
                      previewDuration: parseFloat(e.target.value),
                    }))
                  }
                />
              </label> */}
              <label className="flex items-center">
                <span className="w-32">Max words/line:</span>
                <input
                  type="range"
                  className="ml-2 flex-1"
                  min="1"
                  max="10"
                  value={maxWordsPerLine}
                  onChange={(ev) =>
                    setMaxWordsPerLine(parseInt(ev.target.value))
                  }
                />
                <span className="ml-2 w-12">{maxWordsPerLine}</span>
              </label>

              {/* Words per subtitle */}
              <div className="flex flex-col text-sm">
                <label className="mb-1">Words per Subtitle</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={subtitleOptions.wordsPerSegment}
                    onChange={(e) =>
                      setSubtitleOptions((prev) => ({
                        ...prev,
                        wordsPerSegment: parseInt(e.target.value),
                      }))
                    }
                    className="flex-1 black-500"
                  />
                  <span className="w-6 text-right">
                    {subtitleOptions.wordsPerSegment}
                  </span>
                </div>
              </div>

              {/* Font size */}
              <label className="flex items-center">
                <span className="w-32">Font size:</span>
                <input
                  type="range"
                  className="ml-2 flex-1"
                  min="20"
                  max="100"
                  value={fontSize}
                  onChange={(ev) => setFontSize(parseInt(ev.target.value))}
                />
                <span className="ml-2 w-12">{fontSize}px</span>
              </label>

              {/* Font family */}
              <label className="flex items-center">
                <span className="w-32">Font:</span>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="ml-2 bg-gray-100 text-black p-2 rounded border border-gray-300"
                >
                  {Object.entries(fontMap)?.map(([key, label]) => (
                    <option key={key} value={key} style={{ fontFamily: label }}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Font weight */}
              <label className="flex items-center">
                <span className="w-32">Font weight:</span>
                <select
                  value={fontWeight}
                  onChange={(ev) => setFontWeight(ev.target.value)}
                  className="ml-2 bg-gray-100 text-black p-2 rounded border border-gray-300"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </label>

              {/* Vertical position */}
              <label className="flex items-center">
                <span className="w-32">Position:</span>
                <input
                  type="range"
                  className="ml-2 flex-1"
                  min="20"
                  max="200"
                  value={verticalPosition}
                  onChange={(ev) =>
                    setVerticalPosition(parseInt(ev.target.value))
                  }
                />
                <span className="ml-2 w-20">{verticalPosition}px</span>
              </label>

              {/* Horizontal alignment */}
              <label className="flex items-center">
                <span className="w-32">Alignment:</span>
                <select
                  value={horizontalAlign}
                  onChange={(ev) => setHorizontalAlign(ev.target.value)}
                  className="ml-2 bg-gray-100 text-black p-2 rounded border border-gray-300"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </label>

              {/* Language Dropdown */}
              <div className="flex flex-col gap-1">
                <label htmlFor="language" className="font-medium">
                  Language
                </label>
                <select
                  id="language"
                      disabled={subtitleOptions.blackout}

                  value={subtitleOptions.language}
                  onChange={(e) =>
                    setSubtitleOptions((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="bg-gray-100 text-black p-2 rounded border border-gray-300"
                >
                  <option value="english">English</option>
                  <option value="urdu">Urdu</option>
                  <option value="arabic">Arabic</option>
                </select>
              </div>

              {/* Line Height */}
              <label className="flex items-center">
                <span className="w-32">Line height:</span>
                <input
                  type="range"
                  className="ml-2 flex-1"
                  min="0.8"
                  max="2"
                  step="0.1"
                  value={lineHeight}
                  onChange={(ev) => setLineHeight(parseFloat(ev.target.value))}
                />
                <span className="ml-2 w-12">{lineHeight}</span>
              </label>

              {/* Text Case */}
              <div className="flex flex-col gap-2">
                <label htmlFor="textCase" className="text-sm font-medium">
                  Text Case
                </label>
                <select
                  id="textCase"
                  value={textCase}
                  onChange={(e) => setTextCase(e.target.value)}
                  className="bg-gray-100 text-black p-2 rounded border border-gray-300"
                >
                  <option value="original">Original</option>
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="title">Title Case</option>
                </select>
              </div>

              {/* Bounce Style */}
            <div className="flex flex-col gap-2">
  <label className="text-sm font-medium">Bounce Style</label>
  <select
    value={bounceStyle}
    onChange={(e) => {
      const value = e.target.value;
      setBounceStyle(value);

      // 👇 Reset intensity to 0 if 'original' is selected
      if (value === "original") {
        setBounceIntensity(0);
        setUserModifiedBounce(false); // optional: reset this flag too
      }
    }}
    className="bg-gray-100 text-black p-2 rounded border border-gray-300"
  >
    <option value="original">Original</option>
    <option value="bounce">Bounce</option>
    <option value="bounce-zoom">Bounce Zoom</option>
    <option value="slide">Slide</option>
  </select>

  {/* Show slider only if NOT original */}
  {bounceStyle !== "original" && (
    <>
      <label className="text-sm font-medium">
        Bounce Intensity{" "}
        <span className="font-mono">({bounceIntensity})</span>
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={bounceIntensity}
        onChange={(e) => {
          setUserModifiedBounce(true);
          setBounceIntensity(parseFloat(e.target.value));
        }}
        className="black-500"
      />
    </>
  )}
</div>


              {/* Subtitle Position */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Subtitle Position</label>
                <select
                  value={position}
                   disabled={subtitleOptions.blackout}
                  onChange={(e) => setPosition(e.target.value)}
                  className="bg-gray-100 text-black p-2 rounded border border-gray-300"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="middle-left">Middle Left</option>
                  <option value="middle-center">Middle Center</option>
                  <option value="middle-right">Middle Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="custom">Custom</option>
                </select>

                {position === "custom" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">
                        Custom X (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={customX}
                        onChange={(e) => setCustomX(Number(e.target.value))}
                        className="p-2 rounded border border-gray-300"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">
                        Custom Y (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={customY}
                        onChange={(e) => setCustomY(Number(e.target.value))}
                        className="p-2 rounded border border-gray-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shadow Options */}
              <div className="space-y-4 bg-gray-100 p-4 rounded-xl border border-gray-300">
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={enableShadow}
                    disabled={subtitleOptions.blackout}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEnableShadow(checked);
                      if (!checked) {
                        setShadowBlur(0);
                        setShadowOffsetX(0);
                        setShadowOffsetY(0);
                      } else {
                        setShadowBlur(6);
                      }
                    }}
                    className="accent-blue-500 w-4 h-4"
                  />
                  Enable Shadow
                </label>

                {/* Shadow Color */}
                <div className="flex items-center gap-3">
                  <label className="text-sm w-32">Shadow Color</label>
                  <input
                    type="color"
                    disabled={subtitleOptions.blackout}
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-400"
                  />
                </div>

                {/* Shadow Offsets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm w-20">Offset X</label>
                    <input
                      type="number"
                      disabled={subtitleOptions.blackout}
                      value={shadowOffsetX ?? 0}
                      onChange={(e) => setShadowOffsetX(Number(e.target.value))}
                      className="p-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm w-20">Offset Y</label>
                    <input
                      type="number"
                      disabled={subtitleOptions.blackout}
                      value={shadowOffsetY ?? 0}
                      onChange={(e) => setShadowOffsetY(Number(e.target.value))}
                      className="p-2 rounded border border-gray-300"
                    />
                  </div>
                </div>

                {/* Shadow Blur */}
                <label className="text-sm font-medium block">
                  Shadow Blur: <span className="font-mono">{shadowBlur}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  disabled={subtitleOptions.blackout}
                  step={1}
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(Number(e.target.value))}
                  className="w-full black-500"
                />
              </div>
            </CardContent>
          </Card>
        );

      case "cover":
        return (
          <Card className="bg-white/5 border border-white/10 shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-black/90">Cover Image:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Label + Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="upload-cover-image"
                  className="text-black/80 font-semibold text-sm"
                >
                  Upload Cover Image
                  <span className="block text-xs text-white/50">
                    Supported: JPG, PNG
                  </span>
                </Label>

                {/* Hidden Input */}
                <Input
                  id="upload-cover-image"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleCoverImageChange}
                  className="hidden"
                   disabled={subtitleOptions.blackout}
                />
                {/* Styled Button as label */}
                <Button asChild variant="outline">
                  <label
                    htmlFor="upload-cover-image"
                    className="cursor-pointer"
                  >
                    Upload Cover Image
                  </label>
                </Button>
              </div>

              {/* Apply Cover Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={applyCover}
                   disabled={subtitleOptions.blackout}
                  onChange={(e) => setApplyCover(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 bg-white/10 rounded"
                />
                <span className="text-sm text-black/70">Apply Cover Image</span>
              </div>

              {/* Live Preview */}
              {subtitleOptions.coverImagePath && (
                <div>
                  <p className="text-sm text-black/60 mb-2 font-medium">
                    Live Preview
                  </p>
                  <div className="w-48 h-28 overflow-hidden rounded-lg border border-white/10 shadow-lg bg-black/30">
                    <Image
                      src={subtitleOptions.coverImagePath}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Blackout Toggle */}
              {/* <div className="flex items-center gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={subtitleOptions.blackout}
                    onChange={(e) =>
                      setSubtitleOptions((prev) => ({
                        ...prev,
                        blackout: Boolean(e.target.checked),
                      }))
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 bg-white/10 rounded"
                  />
                  <span className="text-sm text-black/70">
                    Export Only Subtitile (Black Background)
                  </span>
                </div>

                {subtitleOptions.blackout && (
                  <input
                    type="color"
                    value={subtitleOptions.blackoutColor || "#000000"}
                    onChange={(e) =>
                      setSubtitleOptions((prev) => ({
                        ...prev,
                        blackoutColor: e.target.value,
                      }))
                    }
                    title="Select blackout color"
                    className="w-10 h-6 border border-white/30 rounded"
                  />
                )}
              </div> */}
            </CardContent>
          </Card>
        );

      case "b-roll":
        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle>B-ROLL</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* B-roll Toggle */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-b-roll-panel"
                    disabled={subtitleOptions.blackout}
                    checked={showBrollPanel}
                    onCheckedChange={(checked) =>
                      setShowBrollPanel(Boolean(checked))
                    }
                  />
                  <Label htmlFor="show-b-roll-panel">Show B-roll Panel</Label>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Show regenerate warning */}
            {isBrollModified && subtitleOptions?.finalVideoReady && (
              <p className="text-sm text-orange-500 mt-2">
                ⚠️ B-rolls were modified. Please regenerate subtitles to apply
                changes.
              </p>
            )}

            {/* ✅ Conditionally Render B-roll Panel */}
            {showBrollPanel && (
              <div className="mt-4">
                <BrollPanel
                  captions={transcriptionItems}
                  setBrollList={setBrollList}
                  brollList={brollList} // ✅ Pass current list
                  onEdit={() => setIsBrollModified(true)}
                />
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };


// useEffect(() => {
//   console.log("💬 Transcription Items:", transcriptionItems);
// }, [transcriptionItems]);

  // function new
  useEffect(() => {
  console.log("🧠 Current transcription items:", awsTranscriptionItems);
}, [awsTranscriptionItems]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}

      {/* Main Editor Layout */}
      <main className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[2fr_2fr_0.8fr] xl:grid-cols-[2fr_3fr_0.7fr] gap-4 p-4 md:p-6">
        {/* Transcription Panel */}

        <div className="order-2 lg:order-1 flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Transcription</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
           <TranscriptionEditor
  awsTranscriptionItems={transcriptionItems}
  setAwsTranscriptionItems={setAwsTranscriptionItems}
/>


            </CardContent>
          </Card>
        </div>

        {/* Video Player Panel */}
        <div className="order-1 lg:order-2 sticky top-20 h-fit flex flex-col gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-black">
                {/* Progress Overlay */}
                {progress && progress < 1 && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
                    <div className="w-3/4 bg-bg-gradient-from/50 rounded-lg overflow-hidden">
                      <div
                        className="bg-bg-gradient-from h-8 relative transition-all duration-300"
                        style={{ width: `${progress * 100}%` }}
                      >
                        <h3 className="text-white text-xl absolute inset-0 flex items-center justify-center">
                          {parseInt(progress * 100)}%
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Canvas (Subtitles) */}
                {!isProcessing && !subtitleOptions?.finalVideoReady && (
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
                
                  />
                )}

                {/* B-Roll Videos */}
                {brollList?.map((broll, index) => {
                  const isVisible =
                    currentTime >= broll.start_time &&
                    currentTime <= broll.end_time;

                  return (
                    <video
                      key={index}
                      ref={(el) => (bRollRefs.current[index] = el)}
                      src={broll.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className={`absolute z-10 top-0 left-0 ${
                        broll.position === "fill"
                          ? "w-full h-full"
                          : "w-1/2 h-1/2"
                      } object-cover pointer-events-none transition-opacity duration-500`}
                      style={{ opacity: isVisible ? 1 : 0 }}
                    />
                  );
                })}

                {/* Main Video */}
                <video
                  ref={videoRef}
                    key={videoUrl} // This will remount video tag on URL change
                  src={videoUrl}
                  muted={subtitleOptions.noAudio}
                  controls
                  onTimeUpdate={handleTimeUpdate}
                  className="h-full w-full object-contain relative  z-0"
                />

                {/* Brand Text Overlay */}
                {!subtitleOptions?.finalVideoReady &&
                  brandTextFields.text &&
                  (() => {
                    const { x, y, center } = getBrandTextPosition(
                      brandTextFields.position,
                      brandTextFields.posX,
                      brandTextFields.posY
                    );
                    return (
                      <div
                        style={{
                          position: "absolute",
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: center
                            ? "translate(-50%, -50%)"
                            : x === 100 && y === 0
                            ? "translateX(-100%)"
                            : x === 100 && y === 100
                            ? "translate(-100%, -100%)"
                            : x === 0 && y === 100
                            ? "translateY(-100%)"
                            : "none",
                          fontSize: `${brandTextFields.size}px`,
                          opacity: brandTextFields.opacity / 100,
                          color: "#fff",
                          fontWeight: "bold",
                          pointerEvents: "none",
                          zIndex: 10,
                        }}
                      >
                        {brandTextFields.text}
                      </div>
                    );
                  })()}

                {/* Brand Image Overlay */}
                {!subtitleOptions?.finalVideoReady &&
                  brandImageFields.image &&
                  (() => {
                    const { x, y, center } = getBrandImagePosition(
                      brandImageFields.position,
                      brandImageFields.posX,
                      brandImageFields.posY
                    );
                    return (
                      <Image
                        src={brandImageFields.image}
                        alt="Brand Overlay"
                        style={{
                          position: "absolute",
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: center
                            ? "translate(-50%, -50%)"
                            : x === 100 && y === 0
                            ? "translateX(-100%)"
                            : x === 100 && y === 100
                            ? "translate(-100%, -100%)"
                            : x === 0 && y === 100
                            ? "translateY(-100%)"
                            : "none",
                          width:
                            videoRef.current && brandImageFields.size
                              ? `${
                                  (brandImageFields.size / 100) *
                                  videoRef.current.videoWidth
                                }px`
                              : "10%",
                          height: "auto",
                          opacity: brandImageFields.opacity / 100,
                          pointerEvents: "none",
                          zIndex: 10,
                        }}
                      />
                    );
                  })()}
              </div>

              {/* Controls */}
              {/* <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-6 w-6" />
                    ) : (
                      <PlayIcon className="h-6 w-6" />
                    )}
                    <span className="sr-only">
                      {isPlaying ? "Pause" : "Play"}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                    <span className="sr-only">
                      {isMuted ? "Unmute" : "Mute"}
                    </span>
                  </Button>
                  <Slider
                    defaultValue={[volume]}
                    max={100}
                    step={1}
                    className="w-[100px]"
                    onValueChange={setVolume}
                    value={volume}
                  />
                </div>
                <div className="text-sm text-muted-foreground"></div>
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="order-3 lg:order-3 flex flex-col gap-4">
          <Card className="relative">
            <div className="absolute right-4 z-10">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="p-2 rounded-full hover:bg-gray-200">
        <MoreVertical className="w-5 h-5" />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="w-64 space-y-2 p-2">
      {/* ⬇️ Download SRT Option */}
      <DropdownMenuItem asChild>
        <DownloadSRTButton items={transcriptionItems} filename={filename}>
          ⬇️ Download SRT
        </DownloadSRTButton>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* ⬛ Export Only Subtitle (Blackout) Toggle */}
      <DropdownMenuItem className="flex flex-col items-start gap-2">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={subtitleOptions.blackout}
            onChange={(e) =>
              setSubtitleOptions((prev) => ({
                ...prev,
                blackout: Boolean(e.target.checked),
              }))
            }
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 bg-white/10 rounded"
          />
          <span className="text-sm text-gray-800">
            Export Subtitle (Black BG)
          </span>
        </label>

        {subtitleOptions.blackout && (
          <input
            type="color"
            value={subtitleOptions.blackoutColor || "#000000"}
            onChange={(e) =>
              setSubtitleOptions((prev) => ({
                ...prev,
                blackoutColor: e.target.value,
              }))
            }
            title="Select blackout color"
            className="w-10 h-6 border border-gray-300 rounded"
          />
        )}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

            <CardContent className="p-4 pt-12  relative">
              {/* 3-dot dropdown top-right */}
             
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                <Button
                  variant={activeTab === "colors" ? "default" : "outline"}
                  onClick={() => setActiveTab("colors")}
                  className="flex items-center gap-2"
                >
                  <Palette className="h-4 w-4" /> Colors
                </Button>
                <Button
                  variant={activeTab === "brand" ? "default" : "outline"}
                  onClick={() => setActiveTab("brand")}
                  className="flex items-center gap-2 relative"
                >
                  <Briefcase className="h-4 w-4" /> Brand
                  <Zap
                    className="h-3 w-3 text-orange-500 absolute -top-0.5 -right-0.5"
                    fill="currentColor"
                  />
                </Button>
                <Button
                  variant={activeTab === "audio" ? "default" : "outline"}
                  onClick={() => setActiveTab("audio")}
                  className="flex items-center gap-2"
                >
                  <Music className="h-4 w-4" /> Audio
                </Button>
                <Button
                  variant={activeTab === "subtitle" ? "default" : "outline"}
                  onClick={() => setActiveTab("subtitle")}
                  className="flex items-center gap-2"
                >
                  <Subtitles className="h-4 w-4" /> Subtitle
                </Button>

                <Button
                  variant={activeTab === "cover" ? "default" : "outline"}
                  onClick={() => setActiveTab("cover")}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" /> Cover
                </Button>
                <Button
                  variant={activeTab === "b-roll" ? "default" : "outline"}
                  onClick={() => setActiveTab("b-roll")}
                  className="flex items-center gap-2 relative"
                >
                  <Sparkles className="h-4 w-4" /> B-ROLL
                  <Zap
                    className="h-3 w-3 text-orange-500 absolute -top-0.5 -right-0.5"
                    fill="currentColor"
                  />
                </Button>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">{renderControls()}</div>
            </CardContent>
          </Card>

          {/* Action Buttons - always visible */}
          <div className="grid gap-4">
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white relative disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setUserModifiedBounce("false");

                  setSubtitleOptions(prev => ({ ...prev, finalVideoReady: false }));

                const realtimeStyles = {
                  font: fontFamily,
                  fontSize,
                  fontWeight,
                  fontStyle,
                  color: primaryColor,
                  strokeColor: outlineColor,
                  strokeWidth: outlineWidth,
                  textCase,
                  bounceStyle:
                    bounceStyle !== "original" ? bounceStyle : undefined,
                  bounceIntensity,
                textDirection: subtitleOptions?.textDirection || "ltr",
                  shadow: enableShadow,
                  shadowColor,
                  shadowOffsetX,
                  shadowOffsetY,
                  shadowBlur,
                  letterSpacing,
                  lineHeight,
                  maxWordsPerLine,
                  position,
                  customX,
                  customY,
                  // backgroundPadding,
                  // backgroundColor,
                  // backgroundOpacity,
                  // backgroundRadius,
                };

                console.log(
                  "Styles from real-time states (frontend):",
                  realtimeStyles
                );

                setIsProcessing(true);
                setIsBrollModified(false); // clear the modified flag
                onGenerateSubtitle(
                  realtimeStyles,
                  videoRef,
                  brollList,
                  setIsProcessing,
                  (processingDone) => {
                    setIsProcessing(processingDone);
                    if (!processingDone) {
                      setSubtitleOptions((prev) => ({
                        ...prev,
                        finalVideoReady: true,
                      }));
                    }
                  }
                );
              }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>
                    Generating...
                    {progress > 0 && ` ${Math.round(progress * 100)}%`}
                  </span>

                  {/* Progress bar inside button */}
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-orange-300 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <SparklesIcon className="w-5 h-5" />
                  <span>Generate Subtitles</span>
                </div>
              )}
            </Button>

            
          </div>
        </div>
      </main>
    </div>
  );
}
