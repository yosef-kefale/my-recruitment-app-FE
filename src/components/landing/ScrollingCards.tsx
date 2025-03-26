import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ScrollingCards = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const sampleLogos = ['/hpLogo.png', '/appleLogo.png', '/pepsiLogo.png']

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused) {
          scrollContainer.scrollLeft += 1; // Adjust speed
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
            scrollContainer.scrollLeft = 0; // Reset to create infinite effect
          }
        }
      }, 20); // Adjust interval for smooth scrolling
    };

    startScrolling();

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-100 p-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 whitespace-nowrap overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="min-w-[300px] h-[200px] flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/logo.webp"
              alt="Sample"
              className="w-full h-full object-cover"
              width={24}
              height={24}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingCards;
