// Contributors: Bhumil Parate(8994642)
import MotionReveal from "./MotionReveal";

export default function SectionHeading({ title, subtitle, className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      <MotionReveal as="div" y={10}>
        <h2
          className="text-2xl sm:text-3xl font-semibold tracking-tight
                     text-slate-900 dark:text-slate-100"
        >
          {title}
        </h2>
      </MotionReveal>

      {subtitle && (
        <MotionReveal as="div" y={8} delay={0.05}>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{subtitle}</p>
        </MotionReveal>
      )}
    </div>
  );
}
