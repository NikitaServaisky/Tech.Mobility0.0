import React from "react";

const Logo = ({ strokeColor = "#000000", strokeWidth = 2, width = '50px', height = '50px', }) => {
  return (
    <svg
     style={{ width: width,
      height: height,
      viewBox:"0 0 48 48",
      xmlns:"http://www.w3.org/2000/svg"}}
    >
      <path
        style={{
          fill: "none",
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M38.113,23.993c-6.7143-.4906-9.6112-4.2238-13.2837-7.5693-2.9716-2.71-6.8263-7.2515-11.9-7.3029L8.521,9.0787M38.113,24.0023c-6.71.4906-9.6112,4.2285-13.2837,7.5693-2.9716,2.71-6.8263,7.2562-11.9,7.303l-4.4078.0467"
      />
      <path
        style={{
          fill: "none",
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M38.113,24.0023l7.387.0327m-2.3334,9.7-12.6837.014C21.255,33.548,17.48,18.6992,6.8079,18.6338l-3.6317.0093"
      />
      <path
        style={{
          fill: "none",
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M43.3481,14.6155l-12.8605.0327c-9.228.2009-13.0032,15.0545-23.675,15.1152l-3.53-.0327"
      />
      <circle
        style={{
          fill: "none",
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        cx="24"
        cy="24"
        r="21.5"
      />
    </svg>
  );
};

export default Logo;
