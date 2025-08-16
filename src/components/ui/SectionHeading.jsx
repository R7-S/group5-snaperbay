import MotionReveal from "./MotionReveal";
import ReadableSpot from "./ReadableSpot";

export default function SectionHeading({ title, subtitle, className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      <MotionReveal as="h2" y={10}>
        <ReadableSpot className="z-0" />
        <h2
          className="text-2xl sm:text-3xl font-semibold tracking-tight
               drop-shadow-[0_1px_8px_rgba(0,0,0,0.18)]"
        >
          {title}
        </h2>
      </MotionReveal>
      {subtitle && (
        <MotionReveal as="p" y={8} delay={0.05}>
          <p
            className="mt-2 text-slate-700 dark:text-slate-300
              drop-shadow-[0_1px_6px_rgba(0,0,0,0.15)]"
          >
            {subtitle}
          </p>
        </MotionReveal>
      )}
    </div>
  );
}
