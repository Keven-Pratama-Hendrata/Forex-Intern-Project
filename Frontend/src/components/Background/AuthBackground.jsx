import React from 'react';

const AuthBackground = ({ children, circlePosition = "login" }) => {
  const circleConfigs = {
    login: {
      className: "absolute left-[50%] top-[14%] w-48 opacity-25",
      circles: [
        { cx: 90, cy: 70, r: 55 },
        { cx: 130, cy: 60, r: 55 },
        { cx: 110, cy: 120, r: 55 }
      ]
    },
    signup: {
      className: "absolute left-[50%] top-[7%] w-48 opacity-25",
      circles: [
        { cx: 90, cy: 70, r: 55 },
        { cx: 130, cy: 60, r: 55 },
        { cx: 110, cy: 120, r: 55 }
      ]
    }
  };

  const config = circleConfigs[circlePosition] || circleConfigs.login;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={"#6ca0c1"} />
            <stop offset="100%" stopColor={"#507fa1"} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bgGrad)" />
        <path
          d="M 70 0 Q 77 10 70 20 Q 63 30 70 40 Q 77 50 70 60 Q 63 70 70 80 Q 77 90 70 100 L 100 100 100 0 Z"
          fill="#ffffff"
        />
      </svg>

      <svg
        className={config.className}
        viewBox="0 0 200 200"
        fill="none"
        stroke="#163a61"
        strokeWidth="3"
      >
        {config.circles.map((circle, index) => (
          <circle key={index} cx={circle.cx} cy={circle.cy} r={circle.r} />
        ))}
      </svg>
      <div className="relative z-10 w-full max-w-sm">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground; 