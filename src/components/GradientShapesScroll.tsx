import React from 'react';

const gradientShapes = [
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-11-Col2%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-12-Col4%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-1-Col3%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-2-Col5%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-4-Col8%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col10%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-5-Col1%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-6-Col4%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-7-Col9%201.png",
  "https://ihmazbkomtatnvtweaun.supabase.co/storage/v1/object/public/gradient-shapes//Hey_Scamp_Gradient_Shape-8-Col2%201.png"
];

export default function GradientShapesScroll() {
  return (
    <div className="gradient-shapes-container">
      <div className="gradient-shapes-scroll">
        {/* First set of shapes */}
        {gradientShapes.map((shape, index) => (
          <div key={`first-${index}`} className="gradient-shape">
            <img 
              src={shape} 
              alt={`Gradient shape ${index + 1}`}
              className="gradient-shape-image"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {gradientShapes.map((shape, index) => (
          <div key={`second-${index}`} className="gradient-shape">
            <img 
              src={shape} 
              alt={`Gradient shape ${index + 1}`}
              className="gradient-shape-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}