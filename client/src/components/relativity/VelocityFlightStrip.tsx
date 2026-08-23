import { Rocket } from "lucide-react";

type VelocityFlightStripProps = { frameSpeed: number; objectSpeed: number; combinedSpeed: number };

export default function VelocityFlightStrip({ frameSpeed, objectSpeed, combinedSpeed }: VelocityFlightStripProps) {
  const frameDuration = `${Math.max(2.5, 7.2 - Math.abs(frameSpeed) * 4.3).toFixed(2)}s`;
  const probeDuration = `${Math.max(2.2, 7.2 - Math.abs(combinedSpeed) * 4.5).toFixed(2)}s`;
  const frameDirection = frameSpeed < 0 ? "reverse" : "normal";
  const probeDirection = combinedSpeed < 0 ? "reverse" : "normal";
  return (
    <div className="velocity-flight-strip" aria-label={`Animated relative-motion illustration. Frame S prime moves at ${frameSpeed.toFixed(2)} c and the probe moves at ${combinedSpeed.toFixed(3)} c in frame S.`}>
      <div className="flight-topline"><span><Rocket size={14} /> OBSERVER IN FRAME S</span><b>motion is not added linearly</b></div>
      <div className="flight-lane frame-lane"><span className="flight-label">S′ frame · v {frameSpeed >= 0 ? "+" : ""}{frameSpeed.toFixed(2)}c</span><div className="ship ship-frame" style={{ animationDuration: frameDuration, animationDirection: frameDirection }}><i /><i /><b>S′</b></div></div>
      <div className="flight-lane probe-lane"><span className="flight-label">probe · u {combinedSpeed >= 0 ? "+" : ""}{combinedSpeed.toFixed(3)}c</span><div className="ship ship-probe" style={{ animationDuration: probeDuration, animationDirection: probeDirection }}><i /><i /><b>u</b></div></div>
      <div className="flight-footer"><span>input u′ {objectSpeed >= 0 ? "+" : ""}{objectSpeed.toFixed(2)}c</span><strong>relativistic result {combinedSpeed >= 0 ? "+" : ""}{combinedSpeed.toFixed(3)}c</strong></div>
    </div>
  );
}
