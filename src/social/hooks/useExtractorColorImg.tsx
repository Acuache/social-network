import { FastAverageColor } from "fast-average-color";
import { useEffect, useRef, useState } from "react";

export const useExtractorColorImg = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState<string>("#e5e7eb");

  useEffect(() => {
    const fac = new FastAverageColor();
    const img = imgRef.current;
    if (!img) return;

    const extractColor = async () => {
      try {
        const color = await fac.getColorAsync(img);
        setBgColor(color.rgb);
      } catch {
        // cross-origin fallback
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      extractColor();
    } else {
      img.onload = extractColor;
    }

    return () => fac.destroy();
  }, []);

  return { imgRef, bgColor };
};
