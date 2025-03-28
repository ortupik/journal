"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WordData {
  text: string;
  value: number;
}

interface Props {
  data: WordData[];
}

const WordCloudChart = ({ data }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 400 });
  
  useEffect(() => {
    setMounted(true);
    
    // Responsive container sizing
    const updateSize = () => {
      const container = document.getElementById('word-cloud-container');
      if (container) {
        setContainerSize({
          width: container.clientWidth,
          height: 400
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Early return for no data
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-3 md:col-span-3">
        <CardHeader>
          <CardTitle>Word Cloud</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available for word cloud.</p>
        </CardContent>
      </Card>
    );
  }

  // Memoized calculations to improve performance
  const {
    totalWordOccurrences,
    topWord,
    sortedData,
    minValue,
    maxValue,
    range
  } = useMemo(() => {
    const sorted = [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, 30); // Limit to top 30 words
    
    const total = data.reduce((sum, word) => sum + word.value, 0);
    const top = sorted[0];
    
    const min = Math.min(...sorted.map(item => item.value));
    const max = Math.max(...sorted.map(item => item.value));
    const calculatedRange = max - min || 1;

    return {
      totalWordOccurrences: total,
      topWord: top,
      sortedData: sorted,
      minValue: min,
      maxValue: max,
      range: calculatedRange
    };
  }, [data]);
  
  // More sophisticated color palette with better contrast
  const colorPalette = [
    "text-blue-600 hover:text-blue-800", 
    "text-green-600 hover:text-green-800", 
    "text-purple-600 hover:text-purple-800", 
    "text-red-600 hover:text-red-800", 
    "text-teal-600 hover:text-teal-800", 
    "text-indigo-600 hover:text-indigo-800", 
    "text-pink-600 hover:text-pink-800"
  ];
  
  // Enhanced font size calculation
  const getFontSize = (value: number) => {
    // More nuanced scaling with better readability
    return 12 + ((value - minValue) / range) * 54;
  };
  
  // Improved color selection
  const getColor = (index: number) => colorPalette[index % colorPalette.length];

  // Improved word placement algorithm
  const calculateWordPosition = (index: number) => {
    const seed = index + 1; // Use index to create more consistent positioning
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return {
      top: `${20 + pseudoRandom(seed * 1.1) * 60}%`,
      left: `${10 + pseudoRandom(seed * 1.3) * 80}%`,
      rotation: pseudoRandom(seed * 1.5) > 0.5 ? 0 : 90
    };
  };

  return (
    <Card className="col-span-2 md:col-span-2">
      <CardHeader>
        <CardTitle>Word Cloud</CardTitle>
        <div className="text-sm text-muted-foreground">
          Top words across journal entries
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Analytics Summary */}
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Occurrences</p>
            <p className="font-bold text-blue-600">{totalWordOccurrences}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Top Word</p>
            <p className="font-bold text-purple-600">{topWord.text}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Top Word Count</p>
            <p className="font-bold text-green-600">{topWord.value}</p>
          </div>
        </div>

        {/* Word Cloud Visualization */}
        <div 
          id="word-cloud-container"
          className="w-full h-96 bg-slate-50 rounded-lg p-8 flex items-center justify-center relative overflow-hidden"
        >
          <AnimatePresence>
            {mounted && sortedData.map((word, index) => {
              const { top, left, rotation } = calculateWordPosition(index);
              
              return (
                <motion.div
                  key={word.text}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1 
                  }}
                  className="absolute transform group"
                  style={{
                    fontSize: `${getFontSize(word.value)}px`,
                    top,
                    left,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    zIndex: Math.floor(word.value),
                  }}
                >
                  <span 
                    className={`
                      ${getColor(index)} 
                      font-bold 
                      opacity-90 
                      group-hover:opacity-100 
                      transition-all 
                      cursor-default
                      hover:scale-110
                    `}
                  >
                    {word.text}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordCloudChart;