/**
 * Login background circle configuration.
 * @type {Object}
 */
const loginCircleConfig = {
  className: "absolute left-[50%] top-[14%] w-48 opacity-25",
  circles: [
    { cx: 90, cy: 70, r: 55 },
    { cx: 130, cy: 60, r: 55 },
    { cx: 110, cy: 120, r: 55 }
  ]
};

/**
 * Signup background circle configuration.
 * @type {Object}
 */
const signupCircleConfig = {
  className: "absolute left-[50%] top-[7%] w-48 opacity-25",
  circles: [
    { cx: 90, cy: 70, r: 55 },
    { cx: 130, cy: 60, r: 55 },
    { cx: 110, cy: 120, r: 55 }
  ]
};

/**
 * Returns all circle configurations.
 * @returns {{login: Object, signup: Object}} The circle configurations.
 */
export const getCircleConfigs = () => ({
  login: {
    className: loginCircleConfig.className,
    circles: loginCircleConfig.circles.map(c => ({ ...c })),
  },
  signup: {
    className: signupCircleConfig.className,
    circles: signupCircleConfig.circles.map(c => ({ ...c })),
  },
});

/**
 * Returns the circle config for the given position.
 * @param {string} circlePosition - The position key (e.g., 'login', 'signup').
 * @param {Object} circleConfigs - The circle configs object.
 * @returns {Object} The config for the given position.
 */
export const getConfig = (circlePosition, circleConfigs) => {
  return circleConfigs[circlePosition] || circleConfigs.login;
};

/**
 * SVG defs for the wave background gradient.
 * @type {JSX.Element}
 */
const waveGradientDefs = (
  <defs>
    <linearGradient id="bgGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor={"#6ca0c1"} />
      <stop offset="100%" stopColor={"#507fa1"} />
    </linearGradient>
  </defs>
);

/**
 * Renders a wave SVG background with a gradient fill.
 * @returns {JSX.Element} The SVG wave background element.
 */
export const renderWaveBackground = () => (
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className="absolute inset-0 h-full w-full pointer-events-none"
  >
    {waveGradientDefs}
    <rect width="100" height="100" fill="url(#bgGrad)" />
    {renderWavePath()}
  </svg>
);

/**
 * Renders the wave path for the background SVG.
 * @returns {JSX.Element} The SVG path element for the wave.
 */
const renderWavePath = () => (
  <path
    d="M 70 0 Q 77 10 70 20 Q 63 30 70 40 Q 77 50 70 60 Q 63 70 70 80 Q 77 90 70 100 L 100 100 100 0 Z"
    fill="#ffffff"
  />
);

/**
 * Renders SVG circles based on the provided config.
 * @param {Object} config - The circle config object.
 * @returns {JSX.Element} The SVG circles element.
 */
export const renderCircles = (config) => (
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
); 