import React, { useRef } from "react";
import animationWebm from "../../assets/animation.webm"; // Your video file

export default function VideoBackground() {
  const ref = useRef(null);

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover -z-10"
    >
      <source src={animationWebm} type="video/webm" />
      {/* Optional fallback text if the browser doesn't support video */}
      Your browser does not support the video tag.
    </video>
  );
}
