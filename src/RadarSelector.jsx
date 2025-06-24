import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";

const RadarSelector = ({ priorities, setPriorities }) => {
  const svgRef = useRef(null);
  const [draggingQuadrant, setDraggingQuadrant] = useState(null);

  const center = { x: 150, y: 150 };
  const maxRadius = 100;

  const quadrants = useMemo(
    () => ({
      "Traded Funds": { label: "Traded Funds", angle: -135 },
      Bonds: { label: "Bonds", angle: -45 },
      Equities: { label: "Equities", angle: 135 },
      "Mutual Funds": { label: "Mutual Funds", angle: 45 },
    }),
    []
  );

  const points = useMemo(() => {
    const result = {};
    for (const id in quadrants) {
      const angleRad = (quadrants[id].angle * Math.PI) / 180;
      const distance = (priorities[id] / 4) * maxRadius;
      result[id] = {
        x: center.x + Math.cos(angleRad) * distance,
        y: center.y + Math.sin(angleRad) * distance,
      };
    }
    return result;
  }, [priorities, quadrants]);

  const pathData = useMemo(() => {
    const order = ["Traded Funds", "Bonds", "Mutual Funds", "Equities"];
    return order.map((id) => `${points[id].x},${points[id].y}`).join(" ");
  }, [points]);

  const handleInteraction = useCallback(
    (e) => {
      if (!draggingQuadrant || !svgRef.current) return;

      const point = e.type.includes("touch") ? e.touches[0] : e;
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = point.clientX - svgRect.left;
      const mouseY = point.clientY - svgRect.top;

      const quad = quadrants[draggingQuadrant];
      const angleRad = (quad.angle * Math.PI) / 180;
      const axisVector = { x: Math.cos(angleRad), y: Math.sin(angleRad) };
      const mouseVector = { x: mouseX - center.x, y: mouseY - center.y };

      let distance =
        mouseVector.x * axisVector.x + mouseVector.y * axisVector.y;
      distance = Math.max(0, Math.min(distance, maxRadius));
      const newPriority = Math.max(1, Math.ceil((distance / maxRadius) * 4));

      if (priorities[draggingQuadrant] !== newPriority) {
        setPriorities((prev) => ({ ...prev, [draggingQuadrant]: newPriority }));
      }
    },
    [draggingQuadrant, priorities, quadrants, setPriorities]
  );

  const stopDragging = useCallback(() => setDraggingQuadrant(null), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleInteraction);
    window.addEventListener("touchend", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleInteraction);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [handleInteraction, stopDragging]);

  return (
    <div className="w-full flex justify-center items-center p-4">
      <svg ref={svgRef} viewBox="0 0 300 300" className="w-80 h-80">
        {/* Background Concentric Circles */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle
            key={r}
            cx={center.x}
            cy={center.y}
            r={maxRadius * r}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Background Axes */}
        {Object.values(quadrants).map((q) => {
          const angleRad = (q.angle * Math.PI) / 180;
          const endX = center.x + Math.cos(angleRad) * maxRadius;
          const endY = center.y + Math.sin(angleRad) * maxRadius;
          const labelX = center.x + Math.cos(angleRad) * (maxRadius + 20);
          const labelY = center.y + Math.sin(angleRad) * (maxRadius + 20);
          return (
            <g key={q.label}>
              <line
                x1={center.x}
                y1={center.y}
                x2={endX}
                y2={endY}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={labelX}
                y={labelY}
                fill="#111827"
                textAnchor="middle"
                dy="0.3em"
                className="font-semibold text-sm select-none"
              >
                {q.label}
              </text>
            </g>
          );
        })}

        {/* Central Polygon Shape */}
        <polygon
          points={pathData}
          fill="rgba(124, 58, 237, 0.1)" // purple-700 with opacity
          stroke="#7C3AED" // purple-600
          strokeWidth="2"
          strokeDasharray="4 2"
        />

        {/* Draggable Handles */}
        {Object.keys(quadrants).map((id) => {
          const p = points[id];
          return (
            <circle
              key={id}
              cx={p.x}
              cy={p.y}
              r="8"
              fill="#FFFFFF"
              stroke="#7C3AED"
              strokeWidth="2"
              className="cursor-pointer"
              onMouseDown={() => setDraggingQuadrant(id)}
              onTouchStart={() => setDraggingQuadrant(id)}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RadarSelector;
