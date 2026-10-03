import LabeledFrame from './LabeledFrame.jsx';

export default function AboutTab() {
  return (
    <LabeledFrame title="About" className="about">
      <p className="about-quote">
        Built for competitive gamers who need to see exactly what their controller is doing — every axis, every
        button, every frame. Stick drift is invisible until it costs you. This tool makes it visible.
      </p>
      <p className="about-body">
        Controller Analyzer was developed as a personal project using the Web Gamepad API and React. No backend, no
        installs — just your browser and your controller. Whether you’re diagnosing hardware before a tournament or
        just curious how your inputs look under pressure, this tool gives you the clarity you need to compete with
        confidence.
      </p>
      <p className="about-meta">
        <span>
          <span className="about-name">Martin Gonzalez</span> · Personal Project
        </span>
        <span>Web Gamepad API · React · Open Source</span>
      </p>
    </LabeledFrame>
  );
}
