"use client";

import { useEffect, useMemo, useState } from "react";

type SystemKey =
  | "vision"
  | "audio"
  | "compute"
  | "network"
  | "power"
  | "motion"
  | "balance"
  | "touch"
  | "structure"
  | "safety";

type DetailTab = "overview" | "components" | "sequence";
type LabMode = "anatomy" | "hardware" | "action" | "build";
type ScenarioKey = "reach" | "walk" | "respond";

type RobotPart = {
  name: string;
  role: string;
  input: string;
  output: string;
};

type RobotSystem = {
  name: string;
  shortName: string;
  label: string;
  icon: string;
  color: string;
  family: string;
  location: string;
  summary: string;
  purpose: string;
  parts: RobotPart[];
  signal: string;
  sequence: string[];
  realExample: string;
  feedback: string;
  safety: string;
};

const systems: Record<SystemKey, RobotSystem> = {
  vision: {
    name: "Vision & Depth",
    shortName: "Vision",
    label: "01",
    icon: "◉",
    color: "cyan",
    family: "PERCEPTION",
    location: "Head / face",
    summary: "Cameras turn reflected light into a measured 3D description of the world.",
    purpose: "The robot captures images, estimates distance, recognizes objects and continuously tracks where people and obstacles are located.",
    signal: "Photons → pixels → depth → objects",
    parts: [
      { name: "RGB camera pair", role: "Captures color and shape from two viewpoints.", input: "Visible light", output: "Image frames" },
      { name: "Depth sensor", role: "Measures how far surfaces are from the head.", input: "Stereo / infrared", output: "Depth map" },
      { name: "Vision processor", role: "Finds people, tools, edges and free space.", input: "Pixels + depth", output: "Object tracks" },
      { name: "Camera gimbal", role: "Aims the eyes while the body moves.", input: "Target direction", output: "Pan / tilt angle" },
    ],
    sequence: ["Light enters each lens", "Sensors convert light into pixels", "Calibration aligns both views", "AI identifies objects", "3D positions are sent to the planner"],
    realExample: "To pick up a bottle, vision locates its outline, estimates the handle position and keeps tracking it while the arm approaches.",
    feedback: "New frames repeatedly correct the estimated object position.",
    safety: "Confidence limits prevent movement when the camera is blocked or depth is uncertain.",
  },
  audio: {
    name: "Hearing & Speech",
    shortName: "Audio",
    label: "02",
    icon: ")))",
    color: "blue",
    family: "PERCEPTION",
    location: "Head / ears",
    summary: "A microphone array hears direction, separates speech from noise and supports conversation.",
    purpose: "Multiple microphones capture sound, locate the speaker, reduce motor noise and convert spoken instructions into words and intent.",
    signal: "Air pressure → audio → words → intent",
    parts: [
      { name: "Microphone array", role: "Captures sound from several positions.", input: "Pressure waves", output: "Audio channels" },
      { name: "Audio processor", role: "Removes echo and mechanical noise.", input: "Raw audio", output: "Clean speech" },
      { name: "Speech model", role: "Converts speech into text and meaning.", input: "Clean speech", output: "Command intent" },
      { name: "Speaker", role: "Produces warnings, answers and status sounds.", input: "Digital audio", output: "Sound waves" },
    ],
    sequence: ["Microphones sample the sound", "Beamforming estimates direction", "Noise and echo are removed", "Speech becomes text", "Language software extracts the requested task"],
    realExample: "When a person says ‘bring the red box,’ the robot identifies the speaker, understands the request and asks for clarification if needed.",
    feedback: "The microphone hears the robot's own reply and cancels that echo.",
    safety: "Critical actions require confirmation instead of relying on one uncertain phrase.",
  },
  compute: {
    name: "AI & Computing",
    shortName: "AI Core",
    label: "03",
    icon: "AI",
    color: "violet",
    family: "INTELLIGENCE",
    location: "Chest / head",
    summary: "The onboard computers create a world model, choose actions and coordinate the whole machine.",
    purpose: "High-level computing runs perception, language, mapping and task planning, while real-time controllers execute motion with predictable timing.",
    signal: "Sensor data → world model → plan",
    parts: [
      { name: "AI accelerator", role: "Runs vision, language and learned policies.", input: "Sensor tensors", output: "Predictions" },
      { name: "CPU & memory", role: "Runs planning, maps and system software.", input: "Programs + data", output: "Tasks" },
      { name: "Real-time controller", role: "Schedules precise body commands.", input: "Desired motion", output: "Joint targets" },
      { name: "Storage", role: "Keeps software, models, maps and logs.", input: "Files + recordings", output: "Persistent data" },
    ],
    sequence: ["Sensor messages are synchronized", "A world model is updated", "The goal is divided into actions", "A safe trajectory is calculated", "Commands are sent to joint controllers"],
    realExample: "For ‘place the cup on the table,’ the planner combines language, object location, grip choice, collision avoidance and balance.",
    feedback: "Every new sensor message can update or stop the plan.",
    safety: "A separate watchdog can stop motion if the main computer freezes or misses timing deadlines.",
  },
  network: {
    name: "Control Network",
    shortName: "Control Bus",
    label: "04",
    icon: "⇄",
    color: "blue",
    family: "NERVOUS SYSTEM",
    location: "Whole body",
    summary: "The internal communication bus carries commands and feedback between the brain and every joint.",
    purpose: "Deterministic wired links distribute synchronized targets to local motor controllers and return angle, current, temperature and fault data.",
    signal: "Plan packets ⇄ joint telemetry",
    parts: [
      { name: "Main control bus", role: "Carries time-critical joint messages.", input: "Target packets", output: "Synchronized frames" },
      { name: "Joint controller", role: "Closes the local motor-control loop.", input: "Angle / torque target", output: "Motor current" },
      { name: "Sensor bus", role: "Collects slower environmental sensors.", input: "Sensor readings", output: "Stamped messages" },
      { name: "Time synchronizer", role: "Keeps all controllers on one clock.", input: "Master clock", output: "Aligned timing" },
    ],
    sequence: ["The planner publishes a trajectory", "Targets are time-stamped", "Packets reach each joint", "Local controllers drive motors", "Telemetry returns before the next cycle"],
    realExample: "During a wave, shoulder, elbow and wrist targets arrive in the same control cycle so the arm follows one smooth path.",
    feedback: "Returned position and current show whether each command was actually achieved.",
    safety: "Lost messages, excessive delay or a controller fault causes that limb—or the whole body—to stop safely.",
  },
  power: {
    name: "Energy & Power",
    shortName: "Power",
    label: "05",
    icon: "ϟ",
    color: "lime",
    family: "ENERGY",
    location: "Torso / backpack",
    summary: "The battery stores energy and the power system safely delivers the correct voltage to every load.",
    purpose: "Battery cells feed protected high-power motor rails and regulated low-voltage electronics through a battery-management and distribution system.",
    signal: "Chemical energy → DC rails → work + heat",
    parts: [
      { name: "Battery modules", role: "Store electrical energy in rechargeable cells.", input: "Charge current", output: "DC energy" },
      { name: "Battery management", role: "Measures cells, temperature and current.", input: "Cell telemetry", output: "Protection state" },
      { name: "Power distribution", role: "Switches protected branches around the body.", input: "Battery DC", output: "Motor / compute rails" },
      { name: "DC-DC converters", role: "Create stable voltages for computers and sensors.", input: "Battery voltage", output: "Regulated voltage" },
    ],
    sequence: ["The BMS checks every cell", "A pre-charge path limits inrush current", "Main contactors connect the battery", "Converters create stable rails", "Current and temperature are monitored continuously"],
    realExample: "When the robot lifts a load, motor current rises; the power manager checks that cells and wiring remain inside safe limits.",
    feedback: "Voltage, current, charge level and temperature are reported to the computer.",
    safety: "Fuses, contactors and the BMS isolate over-current, under-voltage, over-temperature or damaged cells.",
  },
  motion: {
    name: "Actuators & Joints",
    shortName: "Motion",
    label: "06",
    icon: "↻",
    color: "orange",
    family: "MUSCLES",
    location: "Neck, arms, waist, legs",
    summary: "Electric actuators create torque; transmissions turn it into controlled joint movement.",
    purpose: "Each major joint combines a motor, drive electronics, reduction gearbox and sensors so software can control position, speed or torque.",
    signal: "Electrical current → torque → joint angle",
    parts: [
      { name: "Brushless motor", role: "Converts electrical current into rotation.", input: "Phase current", output: "Motor torque" },
      { name: "Gear reduction", role: "Trades speed for usable joint torque.", input: "Fast rotation", output: "Slow strong rotation" },
      { name: "Position encoder", role: "Measures the exact joint angle.", input: "Shaft motion", output: "Digital angle" },
      { name: "Torque / current sensor", role: "Estimates force and detects collisions.", input: "Strain / current", output: "Joint effort" },
    ],
    sequence: ["Controller receives a target angle", "It compares target with encoder position", "The drive adjusts motor current", "The gearbox turns the limb", "Feedback corrects error many times each second"],
    realExample: "At the elbow, the motor spins rapidly while the gearbox produces slower, stronger rotation capable of holding an object.",
    feedback: "Encoder and torque readings form a closed loop, similar to nerves reporting muscle position and effort.",
    safety: "Software limits speed, angle, torque, current and temperature before hardware protection is needed.",
  },
  balance: {
    name: "Balance & Body Sense",
    shortName: "Balance",
    label: "07",
    icon: "≈",
    color: "blue",
    family: "PROPRIOCEPTION",
    location: "Torso, joints, feet",
    summary: "Internal sensors tell the robot how it is tilted, moving and contacting the ground.",
    purpose: "An inertial unit, joint encoders and foot-force sensors are fused to estimate body pose and keep the center of mass inside a stable support area.",
    signal: "Motion + pressure → body state → correction",
    parts: [
      { name: "IMU", role: "Measures acceleration and rotational velocity.", input: "Body motion", output: "Accel + gyro" },
      { name: "Joint encoders", role: "Report the shape of the full body.", input: "Joint rotation", output: "Angles" },
      { name: "Foot force sensors", role: "Measure load and ground contact.", input: "Ground force", output: "Pressure distribution" },
      { name: "State estimator", role: "Combines noisy measurements into body pose.", input: "All body sensors", output: "Position + velocity" },
    ],
    sequence: ["IMU detects tilt and acceleration", "Encoders report limb geometry", "Feet report contact forces", "The estimator calculates body state", "Ankles, hips and steps correct the balance"],
    realExample: "If the robot is pushed, the IMU sees the rotation first; the controller shifts the ankles, moves the hips or takes a recovery step.",
    feedback: "Balance is a continuous loop—there is no single ‘balanced’ command that can be sent once.",
    safety: "A fall detector changes the strategy from balancing to controlled impact and motor protection.",
  },
  touch: {
    name: "Hands & Touch",
    shortName: "Touch",
    label: "08",
    icon: "✋",
    color: "cyan",
    family: "MANIPULATION",
    location: "Wrists, palms, fingers",
    summary: "Hands shape themselves around objects while force and tactile sensors protect the grip.",
    purpose: "Finger drives create grasp motion, wrist sensors measure overall load and tactile cells detect local contact, slip and pressure.",
    signal: "Contact → grip estimate → force correction",
    parts: [
      { name: "Finger actuators", role: "Open, close and shape the fingers.", input: "Grip target", output: "Finger motion" },
      { name: "Tendon / gearbox", role: "Transfers motor force into compact fingers.", input: "Motor rotation", output: "Finger torque" },
      { name: "Tactile array", role: "Measures where and how hard an object touches.", input: "Surface pressure", output: "Contact map" },
      { name: "Wrist force-torque", role: "Measures total load in multiple directions.", input: "External wrench", output: "Force + torque" },
    ],
    sequence: ["Vision proposes a grasp point", "The arm aligns the palm", "Fingers close until contact", "Force rises to the requested grip", "Slip sensing adjusts pressure while moving"],
    realExample: "A paper cup needs less grip force than a metal tool; tactile feedback lets the same hand handle both.",
    feedback: "Touch changes the command from position control to careful force control after contact.",
    safety: "Force limits and compliant motion reduce pinching and release an object when unexpected resistance appears.",
  },
  structure: {
    name: "Skeleton & Cooling",
    shortName: "Structure",
    label: "09",
    icon: "◇",
    color: "slate",
    family: "BODY",
    location: "Entire robot",
    summary: "The frame carries loads, protects electronics and removes heat without making the robot too heavy.",
    purpose: "A rigid lightweight skeleton maintains joint alignment, routes wiring and transfers forces while heat sinks, fans and airflow cool motors and computers.",
    signal: "Loads + heat → structure + cooling",
    parts: [
      { name: "Load-bearing frame", role: "Keeps joints aligned under dynamic force.", input: "Mechanical loads", output: "Stable geometry" },
      { name: "Covers & bumpers", role: "Protect people, wiring and internal hardware.", input: "Contact / dust", output: "Physical protection" },
      { name: "Cable harness", role: "Routes power and data through moving joints.", input: "Power + signals", output: "Reliable connection" },
      { name: "Thermal system", role: "Moves heat from processors and motors.", input: "Waste heat", output: "Safe temperature" },
    ],
    sequence: ["Frames carry joint reaction forces", "Bearings maintain rotation axes", "Harness loops bend without stretching", "Heat enters sinks and airflow", "Temperature sensors regulate fans and performance"],
    realExample: "During repeated squats, knee motors and electronics heat up; cooling and load-spreading frame members prevent damage.",
    feedback: "Strain, fan speed and temperature reveal structural or cooling problems.",
    safety: "Rounded covers, pinch-point spacing, thermal limits and protected cable routes reduce physical hazards.",
  },
  safety: {
    name: "Safety & Supervision",
    shortName: "Safety",
    label: "10",
    icon: "!",
    color: "red",
    family: "PROTECTION",
    location: "Independent whole-body layer",
    summary: "Independent checks watch power, software, communication, movement and human proximity.",
    purpose: "Safety is not one sensor: it is a layered system that limits energy, checks health, detects faults and moves the robot toward a safe state.",
    signal: "Health monitors → limit / stop / isolate",
    parts: [
      { name: "Emergency stop", role: "Requests immediate removal of drive power.", input: "Human action", output: "Safe-stop circuit" },
      { name: "Watchdog", role: "Detects frozen or late software.", input: "Heartbeat", output: "Fault state" },
      { name: "Limit monitors", role: "Check speed, force, angle, current and heat.", input: "Telemetry", output: "Warnings / trip" },
      { name: "Safe-state controller", role: "Coordinates braking, support and power isolation.", input: "Fault severity", output: "Controlled stop" },
    ],
    sequence: ["Health signals are checked continuously", "A fault is classified", "New motion commands are blocked", "The body brakes or lowers safely", "Drive power is isolated if required"],
    realExample: "If an elbow controller stops replying, the supervisor cancels the task, stabilizes the body and disables the affected motion.",
    feedback: "Fault logs record what happened before and after the trip so the system can be repaired safely.",
    safety: "Software protection complements—not replaces—physical E-stops, current protection, mechanical limits and human procedures.",
  },
};

const systemOrder = Object.keys(systems) as SystemKey[];

type FlowStep = { system: SystemKey; title: string; detail: string; signal: string };
const scenarios: Record<ScenarioKey, { name: string; goal: string; motion: "wave" | "walk"; steps: FlowStep[] }> = {
  reach: {
    name: "See & pick up a cup",
    goal: "Follow the full closed loop from light entering the cameras to touch confirming a stable grasp.",
    motion: "wave",
    steps: [
      { system: "vision", title: "Detect the cup", detail: "RGB and depth cameras locate the cup and estimate its 3D pose.", signal: "Image + depth map" },
      { system: "compute", title: "Choose the grasp", detail: "AI selects a reachable grip and plans a collision-free hand path.", signal: "Arm trajectory" },
      { system: "balance", title: "Prepare the body", detail: "The controller shifts weight so the reaching arm will not destabilize the robot.", signal: "Body posture target" },
      { system: "network", title: "Synchronize joints", detail: "Timed targets are distributed to shoulder, elbow, wrist and torso.", signal: "Joint target packets" },
      { system: "motion", title: "Move the arm", detail: "Actuators turn electrical current into coordinated joint torque.", signal: "Motor current → torque" },
      { system: "touch", title: "Close the grip", detail: "Tactile and wrist feedback stop the fingers at a safe holding force.", signal: "Contact + grip force" },
    ],
  },
  walk: {
    name: "Walk & recover balance",
    goal: "See why walking is a fast feedback process rather than a fixed animation.",
    motion: "walk",
    steps: [
      { system: "compute", title: "Plan footsteps", detail: "A safe route is converted into foot placements and body motion.", signal: "Step trajectory" },
      { system: "balance", title: "Estimate body state", detail: "IMU, encoders and foot loads reveal tilt, motion and ground contact.", signal: "Pose + contact state" },
      { system: "network", title: "Distribute targets", detail: "Hip, knee and ankle commands are synchronized to one clock.", signal: "Timed joint frames" },
      { system: "motion", title: "Create support torque", detail: "Leg actuators move the swing leg and hold the support leg.", signal: "Joint torque" },
      { system: "balance", title: "Correct every cycle", detail: "Measured error adjusts ankles, hips and the next foot placement.", signal: "Balance correction" },
      { system: "safety", title: "Manage a fall", detail: "If recovery is impossible, protective control reduces impact and motor damage.", signal: "Controlled safe state" },
    ],
  },
  respond: {
    name: "Hear & follow a command",
    goal: "Trace speech from vibrating air through language understanding to safe physical action.",
    motion: "wave",
    steps: [
      { system: "audio", title: "Capture speech", detail: "The microphone array locates the speaker and reduces background noise.", signal: "Clean audio" },
      { system: "compute", title: "Understand intent", detail: "Speech and language models turn words into a structured goal.", signal: "Task request" },
      { system: "vision", title: "Check the scene", detail: "The robot confirms the named person or object and available space.", signal: "Verified world state" },
      { system: "safety", title: "Approve the task", detail: "Limits and context checks reject dangerous or ambiguous actions.", signal: "Safe goal" },
      { system: "network", title: "Send the command", detail: "Controllers receive synchronized targets for the chosen response.", signal: "Control packets" },
      { system: "motion", title: "Perform & report", detail: "The body acts while audio and sensors report completion or failure.", signal: "Motion + status" },
    ],
  },
};

type HardwareCategory = "frame" | "actuation" | "compute" | "sensors" | "power" | "wiring" | "safety" | "tools";
type HardwareItem = {
  id: string;
  name: string;
  category: HardwareCategory;
  system: SystemKey;
  quantity: string;
  location: string;
  job: string;
  works: string;
  power: string;
  data: string;
  connects: string;
  install: string;
  verify: string;
  stage: number;
  icon: string;
};

const hardwareCategories: Record<HardwareCategory, { name: string; icon: string; summary: string }> = {
  frame: { name: "Frame & body", icon: "◇", summary: "Load-bearing structure, bearings, covers and fasteners." },
  actuation: { name: "Actuation", icon: "↻", summary: "Motors, transmissions, encoders and moving joints." },
  compute: { name: "Computing", icon: "AI", summary: "AI computer, real-time controller, storage and interfaces." },
  sensors: { name: "Sensors", icon: "◉", summary: "Vision, audio, balance, force, touch and temperature." },
  power: { name: "Power", icon: "ϟ", summary: "Battery, protection, switching and regulated voltage rails." },
  wiring: { name: "Wiring & bus", icon: "⇄", summary: "Power cables, data harnesses, connectors and strain relief." },
  safety: { name: "Safety & cooling", icon: "!", summary: "Emergency circuits, guards, watchdogs and heat removal." },
  tools: { name: "Build tools", icon: "T", summary: "Workshop equipment required for safe assembly and tests." },
};

const hardwareItems: HardwareItem[] = [
  { id: "torso-frame", name: "Torso main frame", category: "frame", system: "structure", quantity: "1 assembly", location: "Chest", job: "Carries the shoulders, computers, battery and waist loads.", works: "A rigid aluminum or composite box resists bending and keeps joint axes aligned while the robot accelerates.", power: "None", data: "None", connects: "Shoulder rail · neck mount · pelvis · covers", install: "Square the frame in a fixture, tighten in sequence and confirm mounting datums.", verify: "Measure diagonals, flatness and fastener torque.", stage: 1, icon: "▤" },
  { id: "pelvis-frame", name: "Pelvis load frame", category: "frame", system: "structure", quantity: "1 assembly", location: "Waist / hips", job: "Transfers torso weight into both hip joints.", works: "Cross-braced plates spread alternating walking loads without twisting the hip axes.", power: "None", data: "None", connects: "Waist · left hip · right hip · battery mount", install: "Align both hip bores on one fixture before final tightening.", verify: "Hip axes remain parallel through full load.", stage: 1, icon: "▱" },
  { id: "arm-links", name: "Arm link set", category: "frame", system: "structure", quantity: "2 upper + 2 forearm", location: "Both arms", job: "Maintains the distance and alignment between shoulder, elbow and wrist.", works: "Hollow lightweight links carry bending loads while providing protected cable channels.", power: "None", data: "None", connects: "Shoulder actuators · elbow actuators · wrists", install: "Install bearings and verify cable clearance before closing each link.", verify: "Links move freely without cable rubbing.", stage: 1, icon: "┃" },
  { id: "leg-links", name: "Leg link set", category: "frame", system: "structure", quantity: "2 thigh + 2 shin", location: "Both legs", job: "Carries body weight between hip, knee and ankle.", works: "Stiff links minimize unwanted flex so the controller's geometry matches the real body.", power: "None", data: "None", connects: "Hip actuators · knees · ankles", install: "Match left/right orientation and preserve sensor cable bend radius.", verify: "Length, straightness and joint spacing match the model.", stage: 1, icon: "║" },
  { id: "joint-bearings", name: "Joint bearing set", category: "frame", system: "structure", quantity: "28 sets", location: "Every rotating joint", job: "Supports radial and axial load while allowing low-friction rotation.", works: "Rolling elements separate moving surfaces; paired bearings resist joint wobble and gearbox side-load.", power: "None", data: "None", connects: "Frames · shafts · actuator outputs", install: "Press on the correct race; never transmit force through the rolling elements.", verify: "No binding, play or abnormal noise.", stage: 1, icon: "⊙" },
  { id: "feet-soles", name: "Foot and sole assemblies", category: "frame", system: "balance", quantity: "2", location: "Feet", job: "Creates a stable ground-contact area and protects force sensors.", works: "A stiff plate spreads load over sensors while a compliant high-friction sole grips the floor.", power: "None", data: "Force sensor wiring", connects: "Ankles · load cells · sole pads", install: "Bond the sole flat and preload each force sensor equally.", verify: "No rocking on a flat surface; force readings are even.", stage: 1, icon: "▰" },
  { id: "fastener-kit", name: "Precision fastener kit", category: "frame", system: "structure", quantity: "1 indexed kit", location: "Whole body", job: "Clamps every mechanical interface at a controlled force.", works: "Correct bolt grade, washer and thread engagement maintain preload under vibration.", power: "None", data: "None", connects: "All mechanical subassemblies", install: "Use the torque map, witness marks and approved thread locker only where specified.", verify: "Second-person torque audit and witness-mark inspection.", stage: 1, icon: "✣" },

  { id: "leg-actuators", name: "High-torque leg actuators", category: "actuation", system: "motion", quantity: "12 smart joints", location: "Hips, knees, ankles", job: "Supports body weight and produces walking, squatting and balance torque.", works: "A brushless motor, reduction gearbox, encoder and drive electronics form one closed-loop joint module.", power: "High-current motor DC", data: "Real-time control bus", connects: "Leg frames · power harness · control bus", install: "Mount with zero marks aligned and route cables away from rotating edges.", verify: "Low-current jog, encoder direction, limits, current and temperature.", stage: 2, icon: "◎" },
  { id: "arm-actuators", name: "Arm actuator modules", category: "actuation", system: "motion", quantity: "8 smart joints", location: "Shoulders, elbows, wrists", job: "Positions and force-controls both arms.", works: "Current creates motor torque; the gearbox increases usable torque and the encoder closes the position loop.", power: "Motor DC rail", data: "Real-time control bus", connects: "Arm links · wrists · joint network", install: "Identify each bus address before enclosing the arm.", verify: "Command small angles and confirm position/effort feedback.", stage: 2, icon: "◉" },
  { id: "head-actuators", name: "Neck pan-tilt actuators", category: "actuation", system: "motion", quantity: "2 smart joints", location: "Neck", job: "Aims cameras and microphones without turning the whole body.", works: "Two orthogonal servo axes provide horizontal pan and vertical tilt.", power: "Motor DC rail", data: "Control bus", connects: "Torso · head frame · sensor harness", install: "Set mechanical center before installing the head.", verify: "Full view range without cable twist.", stage: 2, icon: "↕" },
  { id: "waist-actuators", name: "Waist actuator modules", category: "actuation", system: "motion", quantity: "2 smart joints", location: "Torso / pelvis", job: "Rotates and pitches the upper body for reaching and balance.", works: "High-torque servo axes shift upper-body mass and expand arm workspace.", power: "Motor DC rail", data: "Control bus", connects: "Torso frame · pelvis · harness loop", install: "Fit a serviceable rotating harness loop before closing the joint.", verify: "No harness tension at both motion limits.", stage: 2, icon: "↺" },
  { id: "finger-drives", name: "Finger drive modules", category: "actuation", system: "touch", quantity: "10 micro drives", location: "Both hands", job: "Opens, closes and shapes individual fingers.", works: "Compact motors pull tendons or gear trains; compliant elements distribute grip force.", power: "Regulated actuator rail", data: "Hand controller bus", connects: "Finger tendons · hand board · tactile sensors", install: "Set tendon length with fingers at the mechanical reference pose.", verify: "Smooth open/close, equal tension and safe stall force.", stage: 7, icon: "⌇" },
  { id: "integrated-encoders", name: "Absolute joint encoders", category: "actuation", system: "balance", quantity: "24 integrated", location: "Major joints", job: "Reports each joint angle immediately after power-up.", works: "A magnetic or optical sensor converts shaft orientation into a digital position value.", power: "Logic rail", data: "Joint telemetry", connects: "Actuator shaft · local controller", install: "Align sensor magnet/disc and record the mechanical zero offset.", verify: "Angle is continuous, correctly signed and repeatable.", stage: 2, icon: "∠" },
  { id: "joint-bumpers", name: "Mechanical joint stops", category: "actuation", system: "safety", quantity: "24", location: "Major joints", job: "Prevents damaging rotation beyond the physical design range.", works: "A replaceable energy-absorbing stop acts after software limits but before cables or structure are damaged.", power: "None", data: "None", connects: "Joint frame · rotating link", install: "Confirm stop position leaves margin beyond the software limit.", verify: "Slow manual limit test with power disabled.", stage: 2, icon: "⊣" },

  { id: "ai-computer", name: "AI edge computer", category: "compute", system: "compute", quantity: "1", location: "Upper chest", job: "Runs vision, speech, mapping, planning and learned robot policies.", works: "CPU/GPU/NPU hardware processes parallel sensor data and neural-network calculations locally.", power: "Regulated compute rail", data: "Ethernet/PCIe/USB + ROS messages", connects: "Cameras · storage · real-time controller · network", install: "Mount to a heat spreader with service access and vibration isolation.", verify: "Boot, thermal stress, model inference and recovery test.", stage: 5, icon: "AI" },
  { id: "realtime-controller", name: "Real-time motion controller", category: "compute", system: "compute", quantity: "1", location: "Central torso", job: "Executes deterministic joint and safety-control cycles.", works: "A microcontroller or real-time processor schedules sensor reads and actuator commands at fixed timing.", power: "Protected logic rail", data: "Control bus + supervisory Ethernet", connects: "AI computer · actuator bus · safety I/O", install: "Keep safety and bus wiring separated from noisy motor phases.", verify: "Timing jitter, watchdog and bus-load test.", stage: 5, icon: "µ" },
  { id: "storage-module", name: "Industrial storage module", category: "compute", system: "compute", quantity: "1", location: "Computer bay", job: "Stores system software, AI models, maps and fault logs.", works: "Nonvolatile flash retains data without power and supports controlled system updates.", power: "Computer interface power", data: "NVMe / eMMC", connects: "AI computer", install: "Secure mechanically and provide thermal contact if required.", verify: "Read/write, integrity and rollback-image test.", stage: 5, icon: "▣" },
  { id: "io-gateway", name: "Sensor and I/O gateway", category: "compute", system: "network", quantity: "1", location: "Lower chest", job: "Bridges cameras, sensors, service I/O and the real-time network.", works: "The gateway translates physical interfaces and timestamps data on a common clock.", power: "Logic rail", data: "USB/CAN/RS-485/Ethernet", connects: "Sensors · controller · service port", install: "Label every port and lock connectors against vibration.", verify: "Port discovery, timestamp alignment and disconnect recovery.", stage: 5, icon: "⇆" },
  { id: "service-interface", name: "Service and debug interface", category: "compute", system: "network", quantity: "1 set", location: "Rear access panel", job: "Allows firmware loading, diagnostics and recovery without opening the robot.", works: "Protected USB, Ethernet and debug links expose controlled maintenance channels.", power: "Isolated service power", data: "USB/Ethernet/debug", connects: "AI computer · controller · technician laptop", install: "Use keyed, protected connectors with dust caps.", verify: "Recovery boot and diagnostic access with motors isolated.", stage: 5, icon: "<>" },

  { id: "rgb-cameras", name: "Calibrated RGB cameras", category: "sensors", system: "vision", quantity: "2", location: "Face", job: "Captures synchronized left and right color images.", works: "Lenses focus light onto pixel arrays that convert photons into digital intensity and color.", power: "5 V sensor rail", data: "MIPI/USB video", connects: "Vision computer · head frame", install: "Mount on a rigid measured baseline with no cover obstruction.", verify: "Focus, synchronization, exposure and stereo calibration.", stage: 6, icon: "◉" },
  { id: "depth-camera", name: "Depth camera", category: "sensors", system: "vision", quantity: "1", location: "Face center", job: "Measures distance to surfaces for navigation and manipulation.", works: "Stereo disparity or active infrared timing produces one distance value per image region.", power: "5 V sensor rail", data: "USB/MIPI depth stream", connects: "AI computer · vision frame", install: "Align with RGB cameras and avoid reflective cover material.", verify: "Range, blind-zone and RGB-depth alignment test.", stage: 6, icon: "⌖" },
  { id: "microphone-array", name: "Digital microphone array", category: "sensors", system: "audio", quantity: "4 microphones", location: "Head perimeter", job: "Captures speech and estimates the direction of arrival.", works: "Small timing differences between microphones allow beamforming and noise rejection.", power: "Audio logic rail", data: "I²S/PDM audio", connects: "Audio processor · head harness", install: "Keep equal acoustic openings and isolate motor vibration.", verify: "Channel order, level, direction and echo-cancel test.", stage: 6, icon: "))" },
  { id: "imu", name: "6/9-axis IMU", category: "sensors", system: "balance", quantity: "1 primary + 1 optional", location: "Torso center", job: "Measures acceleration, angular velocity and optional magnetic heading.", works: "Micromechanical masses respond to acceleration and rotation; sensor fusion estimates orientation.", power: "3.3/5 V logic", data: "SPI/I²C", connects: "Real-time controller", install: "Mount rigidly near the torso reference frame with axis markings aligned.", verify: "Bias, axis direction, vibration and orientation calibration.", stage: 6, icon: "≈" },
  { id: "foot-load-cells", name: "Foot force sensor arrays", category: "sensors", system: "balance", quantity: "8 cells", location: "4 per foot", job: "Measures load distribution and confirms ground contact.", works: "Strain gauges change resistance under force; amplifiers convert that change into calibrated load.", power: "Low-noise sensor rail", data: "Analog/ADC or digital", connects: "Feet · sensor gateway · balance controller", install: "Preload evenly and mechanically isolate side-load.", verify: "Zero, corner loading, total weight and drift test.", stage: 6, icon: "▦" },
  { id: "wrist-ft", name: "Wrist force-torque sensors", category: "sensors", system: "touch", quantity: "2", location: "Both wrists", job: "Measures forces and torques transferred between each hand and arm.", works: "A multi-axis strain structure separates load into three force and three torque components.", power: "Sensor rail", data: "CAN/Ethernet/serial", connects: "Forearm · hand · controller", install: "Protect from assembly preload and align sensor coordinate axes.", verify: "Zero, known load and cross-axis calibration.", stage: 6, icon: "✥" },
  { id: "tactile-arrays", name: "Finger and palm tactile arrays", category: "sensors", system: "touch", quantity: "10 finger + 2 palm", location: "Hands", job: "Detects contact location, pressure distribution and slip.", works: "Resistive, capacitive or optical cells change signal when the skin is pressed.", power: "Low-voltage sensor rail", data: "Local hand bus", connects: "Hand controller · soft skin", install: "Bond without air gaps and protect flex circuits at knuckles.", verify: "Contact map, dead-cell and slip-response test.", stage: 7, icon: "••" },
  { id: "temperature-sensors", name: "Temperature sensor network", category: "sensors", system: "safety", quantity: "12 points", location: "Motors, battery, computers", job: "Detects unsafe heat before components are damaged.", works: "Thermistors or digital sensors convert temperature into electrical values monitored by safety software.", power: "Logic/sensor rail", data: "Local telemetry", connects: "Actuators · BMS · computers · supervisor", install: "Place on the actual heat path, not only nearby air.", verify: "Compare with a reference temperature and test trip thresholds.", stage: 6, icon: "°" },

  { id: "battery-pack", name: "Rechargeable battery pack", category: "power", system: "power", quantity: "1 removable pack", location: "Lower torso / backpack", job: "Stores energy for motors, computers and sensors.", works: "Series/parallel lithium cells provide the required voltage and current while a rigid enclosure protects them.", power: "Primary DC source", data: "Cell telemetry via BMS", connects: "BMS · contactor · charger · frame", install: "Use a keyed connector, mechanical latch and protected enclosure.", verify: "Capacity, insulation, pack voltage, temperature and retention test.", stage: 3, icon: "▥" },
  { id: "bms", name: "Battery management system", category: "power", system: "power", quantity: "1", location: "Battery enclosure", job: "Monitors every cell and prevents unsafe charge or discharge.", works: "Cell-voltage, pack-current and temperature measurements drive balancing and protection switches.", power: "Direct battery connection", data: "CAN/UART telemetry", connects: "Cells · charger · supervisor · contactor", install: "Use fused sense leads and verify cell order before connecting.", verify: "Over/under-voltage, over-current and temperature protection test.", stage: 3, icon: "B" },
  { id: "power-distribution", name: "Power distribution board", category: "power", system: "power", quantity: "1", location: "Central torso", job: "Splits battery power into protected branches.", works: "Copper buses, fuses and monitored switches feed legs, arms, computers and auxiliary systems separately.", power: "Battery input; multiple outputs", data: "Current/fault telemetry", connects: "Battery · converters · actuator branches", install: "Size conductors and fuses for each branch, then label both ends.", verify: "Polarity, branch isolation, current sensing and fault test.", stage: 3, icon: "P" },
  { id: "main-contactor", name: "Main contactor and pre-charge", category: "power", system: "safety", quantity: "1 set", location: "Power bay", job: "Connects high-power rails safely without damaging inrush current.", works: "A resistor first charges input capacitors; the main relay closes only after voltage equalizes.", power: "Battery high-power path", data: "Safety enable/status", connects: "Battery · PDB · E-stop chain", install: "Keep high-current loops short and physically guarded.", verify: "Pre-charge timing, welded-contact detection and emergency opening.", stage: 3, icon: "K" },
  { id: "logic-converter", name: "Regulated logic converter", category: "power", system: "power", quantity: "1 redundant pair", location: "Power bay", job: "Creates stable low-voltage power for controllers and sensors.", works: "A switch-mode converter regulates changing battery voltage to clean protected logic rails.", power: "Battery DC → 12/5/3.3 V", data: "Enable/fault lines", connects: "PDB · computers · sensor rail", install: "Mount to a heat path and separate input/output wiring.", verify: "Ripple, load step, efficiency and over-current test.", stage: 3, icon: "DC" },
  { id: "motor-converter", name: "Motor rail regulator/protection", category: "power", system: "power", quantity: "2 branches", location: "Torso / pelvis", job: "Feeds actuator groups with controlled voltage and current protection.", works: "High-current conversion or protected pass-through absorbs transients and isolates a failed limb branch.", power: "Battery DC → motor DC", data: "Current/voltage/fault", connects: "PDB · arm bus · leg bus", install: "Use low-resistance cables and secure bus bars against movement.", verify: "Peak load, regenerative voltage and branch trip test.", stage: 3, icon: "M" },
  { id: "fuse-set", name: "Branch fuse and breaker set", category: "power", system: "safety", quantity: "8 protected branches", location: "Distribution bay", job: "Stops wiring damage when current exceeds safe cable limits.", works: "Calibrated elements open the circuit before conductors or connectors overheat.", power: "In series with each branch", data: "Optional open-fuse status", connects: "PDB · every power branch", install: "Match rating to wire and connector, not only the normal load.", verify: "Correct rating, spare inventory and isolation test.", stage: 3, icon: "F" },
  { id: "charger", name: "Matched battery charger", category: "power", system: "power", quantity: "1", location: "External equipment", job: "Charges the pack using the correct controlled current and voltage profile.", works: "The charger coordinates with the BMS and reduces current as cells approach full charge.", power: "AC input → battery charge", data: "Charge/BMS status", connects: "Charge port · battery/BMS", install: "Use a keyed isolated charge connector and supervised charging area.", verify: "Charge termination, temperature and fault-disconnect test.", stage: 3, icon: "C" },

  { id: "motor-harness", name: "High-current motor harness", category: "wiring", system: "power", quantity: "4 branch looms", location: "Torso to limbs", job: "Carries actuator power through moving body sections.", works: "Stranded copper, rated insulation and locking connectors minimize voltage drop and fatigue.", power: "High-current DC", data: "None", connects: "PDB · joint chains", install: "Crimp with calibrated tools, add strain relief and protect bend zones.", verify: "Milliohm resistance, pull test, insulation and full-motion rub test.", stage: 4, icon: "═" },
  { id: "control-bus-harness", name: "Real-time control-bus harness", category: "wiring", system: "network", quantity: "4 daisy chains", location: "Whole body", job: "Carries synchronized commands and actuator feedback.", works: "Twisted differential pairs reject motor noise; termination prevents signal reflections.", power: "Isolated transceiver power", data: "CAN/RS-485/EtherCAT class", connects: "Controller · all smart joints", install: "Maintain pair twist, topology and termination through each link.", verify: "Bus errors, latency and motion-under-load test.", stage: 4, icon: "≋" },
  { id: "sensor-harness", name: "Sensor harness", category: "wiring", system: "network", quantity: "1 labeled loom set", location: "Head, torso, hands, feet", job: "Routes low-level sensor power and data away from electrical noise.", works: "Shielding, grounding and separated routing protect small measurement signals.", power: "Low-noise sensor rails", data: "USB/SPI/I²C/analog/audio", connects: "Sensors · gateway · computers", install: "Separate from motor phases and ground shields at the designed point.", verify: "Noise floor and data integrity with all motors active.", stage: 4, icon: "⌁" },
  { id: "connector-set", name: "Keyed locking connector set", category: "wiring", system: "structure", quantity: "1 full indexed set", location: "Every service break", job: "Allows reliable assembly and maintenance without misconnection.", works: "Mechanical keying, latches and rated contacts preserve polarity and retention under vibration.", power: "As rated per circuit", data: "As rated per interface", connects: "All replaceable modules", install: "Label both mating halves; never mix incompatible voltage families.", verify: "Pin map audit, latch and pull test.", stage: 4, icon: "⊕" },
  { id: "strain-relief", name: "Sleeving and strain-relief set", category: "wiring", system: "structure", quantity: "1 whole-body kit", location: "Cable exits and joints", job: "Prevents conductors from carrying pull, abrasion or sharp bending.", works: "Clamps, braided sleeve and controlled loops transfer movement into safe cable curvature.", power: "None", data: "None", connects: "Harnesses · frames · covers", install: "Leave measured service loops and preserve the minimum bend radius.", verify: "Full-range motion repeated with covers installed.", stage: 4, icon: "S" },

  { id: "estop", name: "Emergency-stop circuit", category: "safety", system: "safety", quantity: "1 body + 1 remote", location: "Torso and test station", job: "Removes actuator energy through a hardware path when danger is observed.", works: "Normally closed safety contacts drop the main contactor independently of ordinary software.", power: "Safety low-voltage loop", data: "Status only", connects: "E-stop buttons · contactor · supervisor", install: "Place within immediate reach and protect against accidental reset.", verify: "Test from every operating mode and confirm drive-power removal.", stage: 8, icon: "STOP" },
  { id: "watchdog", name: "Independent hardware watchdog", category: "safety", system: "safety", quantity: "1", location: "Safety controller", job: "Detects a frozen main computer or missed control heartbeat.", works: "A separate timer requires periodic valid pulses; missing pulses trigger the safe-state output.", power: "Always-on protected logic", data: "Heartbeat + fault outputs", connects: "Main computer · real-time controller · contactor", install: "Keep the reset path independent from the supervised computer.", verify: "Freeze, cable-disconnect and corrupted-heartbeat tests.", stage: 8, icon: "W" },
  { id: "cooling-set", name: "Heat sinks and cooling fans", category: "safety", system: "structure", quantity: "2 sinks + 3 fans", location: "Computer and power bays", job: "Moves waste heat away from processors, converters and enclosed electronics.", works: "Thermal interfaces conduct heat to fins; controlled airflow carries it into ambient air.", power: "Auxiliary fan rail", data: "Fan speed + temperature", connects: "AI computer · converters · covers", install: "Seal airflow paths so air crosses hot components instead of bypassing them.", verify: "Thermal soak at maximum compute and motor load.", stage: 7, icon: "✣" },
  { id: "protective-covers", name: "Protective shell and bumpers", category: "safety", system: "structure", quantity: "1 body set", location: "Whole exterior", job: "Guards wiring, electronics and sharp structure while reducing contact injury.", works: "Rigid shells spread impact; compliant bumpers absorb energy and create visible safe surfaces.", power: "None", data: "Optional contact switches", connects: "Frame · service latches · bumpers", install: "Maintain airflow, sensor view, service access and safe pinch clearances.", verify: "Range-of-motion, pinch, impact and retention inspection.", stage: 7, icon: "⬡" },
  { id: "status-system", name: "Status lights and audible alarm", category: "safety", system: "safety", quantity: "1 visible/audible set", location: "Head and torso", job: "Shows drive-enabled, warning, fault and emergency states to nearby people.", works: "A supervised controller drives unmistakable colors and tones for each operating state.", power: "Protected logic rail", data: "Safety status outputs", connects: "Safety controller · LEDs · speaker", install: "Keep indicators visible from front and rear.", verify: "State-by-state visibility, sound and failed-indicator detection.", stage: 8, icon: "●" },

  { id: "support-stand", name: "Commissioning support stand", category: "tools", system: "safety", quantity: "1", location: "Workshop", job: "Supports the robot during first power-up and joint tests.", works: "A rigid overhead or torso fixture prevents an uncontrolled robot from falling while allowing limbs to move.", power: "None", data: "None", connects: "Robot lifting points", install: "Rated attachment points and secondary retention are required.", verify: "Load rating and clear emergency access.", stage: 0, icon: "A" },
  { id: "torque-tools", name: "Torque driver set", category: "tools", system: "structure", quantity: "1 calibrated set", location: "Workshop", job: "Applies repeatable fastener preload without stripping threads.", works: "An adjustable clutch or indicator releases at the specified torque.", power: "None", data: "Calibration certificate", connects: "Fastener kit", install: "Use the correct bit and torque map for every fastener family.", verify: "Calibration date and sample fastener audit.", stage: 0, icon: "T" },
  { id: "electrical-tools", name: "Multimeter and bench supply", category: "tools", system: "power", quantity: "1 each", location: "Electronics bench", job: "Checks continuity, polarity, voltage, current and safely current-limits first power-up.", works: "The meter measures electrical quantities; the supply limits fault energy during early tests.", power: "AC-powered test equipment", data: "Measured readings", connects: "Test points · isolated subassemblies", install: "Use fused leads and correct measurement category.", verify: "Known-reference measurement and current-limit test.", stage: 0, icon: "V" },
  { id: "crimp-tools", name: "Connector crimp and pull-test tools", category: "tools", system: "network", quantity: "1 matched set", location: "Harness bench", job: "Creates repeatable gas-tight wire terminations.", works: "Matched dies compress conductor and insulation wings to the connector manufacturer's geometry.", power: "None", data: "Pull-force record", connects: "All wire terminals", install: "Use only dies and wire sizes approved for each contact.", verify: "Crimp-height inspection and destructive sample pull test.", stage: 0, icon: "C" },
  { id: "fabrication-tools", name: "Fabrication and alignment fixtures", category: "tools", system: "structure", quantity: "1 fixture set", location: "Mechanical bench", job: "Holds frames and joint axes accurately during assembly.", works: "Reference surfaces constrain parts so alignment does not depend on visual judgment.", power: "None", data: "Inspection dimensions", connects: "Frame and bearing assemblies", install: "Clean datums and clamp without distorting thin frames.", verify: "Fixture calibration and dimensional inspection.", stage: 0, icon: "⌗" },
  { id: "safety-equipment", name: "Battery and workshop safety kit", category: "tools", system: "safety", quantity: "1 complete set", location: "Workshop", job: "Protects people and contains foreseeable electrical, mechanical and battery incidents.", works: "Eye protection, insulated tools, fire-safe charging area, barriers and written lockout procedures reduce exposure.", power: "None", data: "Inspection log", connects: "Workshop procedure", install: "Place before any battery or powered-motion work begins.", verify: "Pre-test checklist and emergency drill.", stage: 0, icon: "!" },
];

const hardwareCategoryOrder = Object.keys(hardwareCategories) as HardwareCategory[];

const buildStages = [
  { title: "Frame & bearings", subtitle: "Build the load-bearing skeleton", system: "structure" as SystemKey, parts: ["Torso frame", "Pelvis frame", "Limb links", "Bearings & joint shafts"], detail: "Fixtures hold every joint axis in alignment while the rigid frame is assembled and checked for free movement.", test: "All axes rotate freely; dimensions and fastener torque pass inspection." },
  { title: "Actuators & transmissions", subtitle: "Install the robot's muscles", system: "motion" as SystemKey, parts: ["Brushless motors", "Gear reducers", "Encoders", "Joint controllers"], detail: "Motor modules are mounted at the neck, shoulders, arms, waist, hips, knees and ankles with calibrated zero positions.", test: "Each unloaded joint moves slowly, reports angle and stops at software limits." },
  { title: "Power & protection", subtitle: "Create safe energy paths", system: "power" as SystemKey, parts: ["Battery modules", "BMS", "Contactors & fuses", "DC-DC converters"], detail: "High-power motor wiring is separated from sensitive signal wiring, grounded correctly and protected branch by branch.", test: "Pre-charge, insulation, polarity, rail voltage and emergency isolation are verified." },
  { title: "Communication harness", subtitle: "Connect the nervous system", system: "network" as SystemKey, parts: ["Control bus", "Sensor bus", "Flexible harness loops", "Service connectors"], detail: "Power and data harnesses are routed with strain relief and enough bend radius for every moving joint.", test: "Every controller is discovered, time-synchronized and communicates without errors through full motion." },
  { title: "Computers & software", subtitle: "Install intelligence and real-time control", system: "compute" as SystemKey, parts: ["AI computer", "Real-time controller", "Storage", "System software"], detail: "The operating system, drivers, robot description, control software and AI models are installed as separate supervised layers.", test: "Boot, watchdog, logging, update recovery and simulated motion all pass before motors are enabled." },
  { title: "Perception & body sensors", subtitle: "Give the machine awareness", system: "vision" as SystemKey, parts: ["Cameras & microphones", "IMU", "Foot force sensors", "Tactile & wrist sensors"], detail: "Sensor positions are measured relative to the frame so observations from different devices agree in one coordinate system.", test: "Camera, depth, audio, IMU, force and touch calibration remain accurate while the body moves." },
  { title: "Covers, hands & cooling", subtitle: "Complete the physical body", system: "structure" as SystemKey, parts: ["Hands", "Protective covers", "Bumpers", "Fans & heat sinks"], detail: "Outer parts protect wiring and people without blocking sensors, airflow, service access or joint motion.", test: "Pinch gaps, temperatures, airflow, contact surfaces and full joint range are checked." },
  { title: "Calibration & safe commissioning", subtitle: "Teach the assembled body its limits", system: "safety" as SystemKey, parts: ["Joint zeroing", "Mass model", "Controller tuning", "Safety validation"], detail: "The robot progresses from supported low-power tests to standing, balance recovery, walking and manipulation under controlled conditions.", test: "E-stop, watchdog, fall behavior, speed/force limits and recovery procedures pass before independent operation." },
];

function RobotModel({ active, rotation, exploded, xray, motion, labMode, buildStage, onSelect }: {
  active: SystemKey;
  rotation: number;
  exploded: boolean;
  xray: boolean;
  motion: "idle" | "wave" | "walk";
  labMode: LabMode;
  buildStage: number;
  onSelect: (key: SystemKey) => void;
}) {
  const selected = (key: SystemKey) => active === key ? "selected" : "";
  return (
    <div
      className={`robot-model ${exploded ? "exploded" : ""} ${xray ? "xray" : ""} motion-${motion} ${labMode === "build" ? `build-mode build-stage-${buildStage + 1}` : ""}`}
      style={{ transform: `rotateY(${rotation}deg)` }}
      role="group"
      aria-label="Interactive cutaway model of a humanoid robot"
    >
      <div className="robot-shadow" />
      <div className="robot-head robot-part">
        <button className={`ear ear-left ${selected("audio")}`} onClick={() => onSelect("audio")} aria-label="Explore left microphone array" type="button" />
        <button className={`ear ear-right ${selected("audio")}`} onClick={() => onSelect("audio")} aria-label="Explore right microphone array" type="button" />
        <div className="faceplate">
          <button className={`eye eye-left ${selected("vision")}`} onClick={() => onSelect("vision")} aria-label="Explore left vision camera" type="button" />
          <button className={`eye eye-right ${selected("vision")}`} onClick={() => onSelect("vision")} aria-label="Explore right vision camera" type="button" />
          <button className={`mouth-sensor ${selected("audio")}`} onClick={() => onSelect("audio")} aria-label="Explore speaker and voice system" type="button" />
        </div>
        <button className={`head-core hotspot ${selected("compute")}`} onClick={() => onSelect("compute")} aria-label="Explore AI processor" type="button">AI</button>
      </div>

      <div className="robot-neck robot-part"><span /></div>

      <div className="robot-torso robot-part">
        <button className={`shoulder-bar structure-button ${selected("structure")}`} onClick={() => onSelect("structure")} aria-label="Explore structural shoulder frame" type="button" />
        <div className="chest-shell">
          <span className="chest-line line-one" /><span className="chest-line line-two" />
          <button className={`core-display hotspot ${selected("compute")}`} onClick={() => onSelect("compute")} aria-label="Explore onboard computers" type="button"><i /><b>CORE</b></button>
          <button className={`battery hotspot ${selected("power")}`} onClick={() => onSelect("power")} aria-label="Explore battery and power system" type="button"><span /><span /><span /></button>
          <button className={`safety-node ${selected("safety")}`} onClick={() => onSelect("safety")} aria-label="Explore safety controller" type="button">!</button>
          <span className={`wiring-harness ${selected("network")}`} aria-hidden="true"><i /><i /><i /></span>
        </div>
        <button className={`waist ${selected("network")}`} onClick={() => onSelect("network")} aria-label="Explore control network hub" type="button"><span /><span /><span /></button>
      </div>

      {(["left", "right"] as const).map((side) => (
        <div className={`arm arm-${side} robot-part`} key={side}>
          <button className={`joint shoulder ${selected("motion")}`} onClick={() => onSelect("motion")} aria-label={`Explore ${side} shoulder actuator`} type="button"><span /></button>
          <div className="limb upper-arm" />
          <button className={`joint elbow ${selected("motion")}`} onClick={() => onSelect("motion")} aria-label={`Explore ${side} elbow actuator`} type="button"><span /></button>
          <div className="limb forearm" />
          <button className={`hand ${selected("touch")}`} onClick={() => onSelect("touch")} aria-label={`Explore ${side} tactile hand`} type="button"><i /><i /><i /></button>
        </div>
      ))}

      {(["left", "right"] as const).map((side) => (
        <div className={`leg leg-${side} robot-part`} key={side}>
          <button className={`joint hip ${selected("motion")}`} onClick={() => onSelect("motion")} aria-label={`Explore ${side} hip actuator`} type="button"><span /></button>
          <div className="limb thigh" />
          <button className={`joint knee ${selected("balance")}`} onClick={() => onSelect("balance")} aria-label={`Explore ${side} knee encoder`} type="button"><span /></button>
          <div className="limb shin" />
          <button className={`foot ${selected("balance")}`} onClick={() => onSelect("balance")} aria-label={`Explore ${side} foot force sensors`} type="button"><span /></button>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [selected, setSelected] = useState<SystemKey>("compute");
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [labMode, setLabMode] = useState<LabMode>("anatomy");
  const [rotation, setRotation] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [xray, setXray] = useState(false);
  const [motion, setMotion] = useState<"idle" | "wave" | "walk">("idle");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("reach");
  const [flowStep, setFlowStep] = useState(0);
  const [runningFlow, setRunningFlow] = useState(false);
  const [buildStage, setBuildStage] = useState(0);
  const [hardwareCategory, setHardwareCategory] = useState<HardwareCategory>("actuation");
  const [selectedHardwareId, setSelectedHardwareId] = useState("leg-actuators");
  const [installedHardware, setInstalledHardware] = useState<Set<string>>(() => new Set());

  const scenario = scenarios[scenarioKey];
  const selectedHardware = hardwareItems.find((item) => item.id === selectedHardwareId) ?? hardwareItems[0];
  const categoryHardware = hardwareItems.filter((item) => item.category === hardwareCategory);
  const stageHardware = hardwareItems.filter((item) => item.stage === buildStage + 1);
  const buildableHardware = hardwareItems.filter((item) => item.stage > 0);
  const installedCount = buildableHardware.filter((item) => installedHardware.has(item.id)).length;
  const installedPercent = Math.round((installedCount / buildableHardware.length) * 100);
  const activeSystem = labMode === "hardware" ? selectedHardware.system : labMode === "action" ? scenario.steps[flowStep].system : labMode === "build" ? buildStages[buildStage].system : selected;
  const current = systems[activeSystem];

  const status = useMemo(() => {
    if (labMode === "action" && runningFlow) return `Live signal ${flowStep + 1}/${scenario.steps.length}: ${scenario.steps[flowStep].title}`;
    if (labMode === "hardware") return `${hardwareItems.length} hardware groups mapped · ${selectedHardware.name} selected`;
    if (labMode === "build") return `${installedCount}/${buildableHardware.length} hardware groups installed`;
    if (motion === "wave") return "Demonstrating arm control";
    if (motion === "walk") return "Demonstrating balance loop";
    if (exploded) return "Components separated";
    if (xray) return "Internal systems visible";
    return "Robot ready to explore";
  }, [labMode, runningFlow, flowStep, scenario, selectedHardware, installedCount, buildableHardware.length, motion, exploded, xray]);

  useEffect(() => {
    if (motion === "idle") return;
    const timer = window.setTimeout(() => setMotion("idle"), 4300);
    return () => window.clearTimeout(timer);
  }, [motion]);

  useEffect(() => {
    if (!runningFlow) return;
    const timer = window.setTimeout(() => {
      if (flowStep < scenario.steps.length - 1) setFlowStep((value) => value + 1);
      else setRunningFlow(false);
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [runningFlow, flowStep, scenario.steps.length]);

  function selectSystem(key: SystemKey) {
    setSelected(key);
    setDetailTab("overview");
    if (labMode !== "anatomy") setLabMode("anatomy");
  }

  function chooseHardware(item: HardwareItem) {
    setSelectedHardwareId(item.id);
    setHardwareCategory(item.category);
  }

  function toggleHardwareInstalled(id: string) {
    setInstalledHardware((currentSet) => {
      const next = new Set(currentSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function installCurrentStage() {
    setInstalledHardware((currentSet) => {
      const next = new Set(currentSet);
      stageHardware.forEach((item) => next.add(item.id));
      return next;
    });
  }

  function startScenario() {
    setFlowStep(0);
    setRunningFlow(true);
    setMotion(scenario.motion);
  }

  function changeScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setFlowStep(0);
    setRunningFlow(false);
    setMotion("idle");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#explorer" aria-label="Robot Anatomy home">
          <span className="brand-mark" aria-hidden="true">R<span>A</span></span>
          <span><strong>ROBOT ANATOMY</strong><small>Interactive engineering lab</small></span>
        </a>

        <nav className="lab-mode-nav" aria-label="Learning laboratory mode">
          <button className={labMode === "anatomy" ? "active" : ""} onClick={() => setLabMode("anatomy")} type="button"><span>01</span> Anatomy</button>
          <button className={labMode === "hardware" ? "active" : ""} onClick={() => { setLabMode("hardware"); setXray(true); }} type="button"><span>02</span> Hardware</button>
          <button className={labMode === "action" ? "active" : ""} onClick={() => setLabMode("action")} type="button"><span>03</span> Action flow</button>
          <button className={labMode === "build" ? "active" : ""} onClick={() => { setLabMode("build"); setXray(true); }} type="button"><span>04</span> Build studio</button>
        </nav>

        <div className="model-badge"><span>HR-01</span><strong>FULL SYSTEM LAB</strong><i /></div>
      </header>

      <section className={`workspace mode-${labMode}`} id="explorer">
        <aside className="systems-panel" aria-label={labMode === "anatomy" ? "Robot systems" : labMode === "hardware" ? "Complete robot hardware" : labMode === "action" ? "Real robot actions" : "Robot assembly stages"}>
          {labMode === "anatomy" && <>
            <div className="eyebrow">10 CONNECTED SYSTEMS</div>
            <h1>Inside a<br />humanoid robot</h1>
            <p className="intro-copy">Select any body system. Study its real components, inputs, outputs, operating sequence and safety feedback.</p>
            <nav className="system-list deep-list" aria-label="Choose a robot body system">
              {systemOrder.map((key) => {
                const item = systems[key];
                return <button className={`system-button ${selected === key ? "active" : ""}`} data-color={item.color} key={key} onClick={() => selectSystem(key)} type="button" aria-pressed={selected === key}>
                  <span className="system-number">{item.label}</span><span className="system-icon" aria-hidden="true">{item.icon}</span><span className="system-copy"><b>{item.shortName}</b><small>{item.family}</small></span><span className="system-arrow" aria-hidden="true">→</span>
                </button>;
              })}
            </nav>
          </>}

          {labMode === "hardware" && <>
            <div className="eyebrow">COMPLETE HARDWARE MAP</div>
            <h1>Every part<br />inside the robot</h1>
            <p className="intro-copy">Explore installed hardware and workshop equipment. Select a category, then click any component to trace how it works and connects.</p>
            <div className="hardware-category-grid" role="tablist" aria-label="Hardware categories">
              {hardwareCategoryOrder.map((key) => <button key={key} type="button" role="tab" aria-selected={hardwareCategory === key} className={hardwareCategory === key ? "active" : ""} onClick={() => { setHardwareCategory(key); const first = hardwareItems.find((item) => item.category === key); if (first) setSelectedHardwareId(first.id); }}><span>{hardwareCategories[key].icon}</span><b>{hardwareCategories[key].name}</b></button>)}
            </div>
            <div className="hardware-count-line"><span>{categoryHardware.length} GROUPS</span><small>{hardwareCategories[hardwareCategory].summary}</small></div>
            <nav className="hardware-item-list" aria-label={`${hardwareCategories[hardwareCategory].name} parts`}>
              {categoryHardware.map((item) => <button type="button" key={item.id} className={selectedHardwareId === item.id ? "active" : ""} onClick={() => chooseHardware(item)}><span>{item.icon}</span><div><b>{item.name}</b><small>QTY {item.quantity} · {item.location}</small></div><i>→</i></button>)}
            </nav>
          </>}

          {labMode === "action" && <>
            <div className="eyebrow">FROM INPUT TO REAL ACTION</div>
            <h1>Watch the<br />whole loop</h1>
            <p className="intro-copy">Choose a real task, then run it to see information, energy and feedback travel through the robot.</p>
            <nav className="scenario-list" aria-label="Choose an action scenario">
              {(Object.keys(scenarios) as ScenarioKey[]).map((key, index) => <button type="button" key={key} className={scenarioKey === key ? "active" : ""} onClick={() => changeScenario(key)}><span>0{index + 1}</span><b>{scenarios[key].name}</b><i>→</i></button>)}
            </nav>
            <div className="scenario-goal"><span>LEARNING GOAL</span><p>{scenario.goal}</p></div>
            <button className={`run-flow-button ${runningFlow ? "running" : ""}`} type="button" onClick={startScenario}><span>{runningFlow ? "●" : "▶"}</span>{runningFlow ? "RUNNING LIVE SIGNAL" : "RUN COMPLETE ACTION"}</button>
          </>}

          {labMode === "build" && <>
            <div className="eyebrow">BEGINNING TO COMMISSIONING</div>
            <h1>Build it<br />in real order</h1>
            <p className="intro-copy">A realistic system-level sequence. Each stage must pass its test before the next stage begins.</p>
            <nav className="build-list" aria-label="Choose robot assembly stage">
              {buildStages.map((stage, index) => <button type="button" key={stage.title} className={buildStage === index ? "active" : index < buildStage ? "complete" : ""} onClick={() => { setBuildStage(index); setMotion("idle"); }}><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.title}</b><i>{index < buildStage ? "✓" : "→"}</i></button>)}
            </nav>
          </>}
        </aside>

        <section className="viewer-panel" aria-label="Interactive humanoid robot model">
          <div className="viewer-grid" aria-hidden="true" />
          <div className="viewer-heading"><div><span className="live-dot" /> DIGITAL CUTAWAY · HR-01</div><span>{labMode === "anatomy" ? "CLICK A REAL COMPONENT" : labMode === "hardware" ? "COMPLETE BILL OF HARDWARE" : labMode === "action" ? "LIVE CLOSED-LOOP TRACE" : "INTERACTIVE ASSEMBLY BENCH"}</span></div>

          {labMode === "hardware" && <div className="hardware-focus-card" data-color={systems[selectedHardware.system].color}>
            <div className="hardware-focus-icon">{selectedHardware.icon}</div><div><span>{hardwareCategories[selectedHardware.category].name} · QTY {selectedHardware.quantity}</span><strong>{selectedHardware.name}</strong><small>{selectedHardware.location}</small></div>
          </div>}

          {labMode === "action" && <div className="flow-strip" aria-label="Action signal steps">
            {scenario.steps.map((step, index) => <button type="button" key={`${scenarioKey}-${step.title}`} className={`${flowStep === index ? "active" : ""} ${flowStep > index ? "complete" : ""}`} onClick={() => { setFlowStep(index); setRunningFlow(false); }}><span>{index + 1}</span><b>{step.title}</b><small>{systems[step.system].shortName}</small></button>)}
          </div>}

          {labMode === "build" && <><div className="assembly-banner"><span>STAGE {String(buildStage + 1).padStart(2, "0")}</span><strong>{buildStages[buildStage].title}</strong><small>{buildStages[buildStage].subtitle}</small></div><div className="assembly-total"><strong>{installedPercent}%</strong><span>VIRTUAL BUILD COMPLETE</span><small>{installedCount} of {buildableHardware.length} groups installed</small></div></>}

          <div className="model-stage">
            <RobotModel active={activeSystem} rotation={rotation} exploded={exploded} xray={xray || labMode === "hardware" || labMode === "build"} motion={motion} labMode={labMode} buildStage={buildStage} onSelect={selectSystem} />
            <div className="part-callout callout-head" data-active={["vision", "audio", "compute"].includes(activeSystem)}><span /> HEAD · PERCEPTION + AI</div>
            <div className="part-callout callout-arm" data-active={["motion", "touch", "network"].includes(activeSystem)}><span /> ACTUATOR + CONTROL LOOP</div>
            <div className="part-callout callout-foot" data-active={activeSystem === "balance"}>GROUND FORCE ARRAY <span /></div>
          </div>

          {labMode === "hardware" && <div className="connection-trace" aria-label="Selected hardware connection path">
            <span><i>1</i><b>POWER</b><small>{selectedHardware.power}</small></span><em>→</em><span><i>2</i><b>DATA</b><small>{selectedHardware.data}</small></span><em>→</em><span className="active"><i>3</i><b>HARDWARE</b><small>{selectedHardware.name}</small></span><em>→</em><span><i>4</i><b>CONNECTS</b><small>{selectedHardware.connects}</small></span>
          </div>}

          <div className="view-controls" aria-label="Model controls">
            <button type="button" onClick={() => setRotation((value) => value - 30)} aria-label="Rotate robot left">↶</button>
            <button type="button" onClick={() => setRotation(0)} aria-label="Reset robot view">⌂</button>
            <button type="button" onClick={() => setRotation((value) => value + 30)} aria-label="Rotate robot right">↷</button><span />
            <button className={xray ? "control-active" : ""} type="button" onClick={() => setXray((value) => !value)} aria-pressed={xray}>X-RAY</button>
            <button className={exploded ? "control-active" : ""} type="button" onClick={() => setExploded((value) => !value)} aria-pressed={exploded}>EXPLODE</button>
          </div>
          <div className="viewer-status"><span><i /> {status}</span><span>{labMode === "anatomy" ? "Select hotspots · Compare layers · Read real signal flow" : labMode === "hardware" ? "Trace power · data · mechanics · verification" : labMode === "build" ? "Install every group · verify each stage · commission safely" : "Every action uses sensing → planning → control → feedback"}</span></div>
        </section>

        {labMode === "anatomy" && <aside className="detail-panel" data-color={current.color} aria-live="polite">
          <div className="detail-topline"><span>SYSTEM {current.label} · {current.family}</span><span>REAL COMPONENT VIEW</span></div>
          <div className="detail-identity"><div className="detail-icon" aria-hidden="true">{current.icon}</div><div><small>{current.location}</small><h2>{current.name}</h2></div></div>
          <p className="detail-summary">{current.summary}</p>
          <div className="detail-tabs" role="tablist" aria-label="System detail level">
            {(["overview", "components", "sequence"] as DetailTab[]).map((tab) => <button key={tab} className={detailTab === tab ? "active" : ""} onClick={() => setDetailTab(tab)} type="button" role="tab" aria-selected={detailTab === tab}>{tab === "overview" ? "How it works" : tab === "components" ? "Real parts" : "Step by step"}</button>)}
          </div>

          {detailTab === "overview" && <div className="tab-content">
            <div className="signal-card"><span>PHYSICAL + DATA FLOW</span><strong>{current.signal}</strong><div className="signal-line"><i /><i /><i /><i /></div></div>
            <section className="detail-section"><h3>WHAT ACTUALLY HAPPENS</h3><p>{current.purpose}</p></section>
            <section className="real-example"><span>REAL TASK EXAMPLE</span><p>{current.realExample}</p></section>
            <div className="feedback-grid"><div><span>↻</span><p><b>Feedback</b>{current.feedback}</p></div><div><span>!</span><p><b>Protection</b>{current.safety}</p></div></div>
          </div>}

          {detailTab === "components" && <div className="tab-content component-cards">
            {current.parts.map((part, index) => <article key={part.name}><header><span>{String(index + 1).padStart(2, "0")}</span><b>{part.name}</b></header><p>{part.role}</p><dl><div><dt>INPUT</dt><dd>{part.input}</dd></div><div><dt>OUTPUT</dt><dd>{part.output}</dd></div></dl></article>)}
          </div>}

          {detailTab === "sequence" && <div className="tab-content sequence-list"><ol>{current.sequence.map((step, index) => <li key={step}><span>{index + 1}</span><div><small>STEP {String(index + 1).padStart(2, "0")}</small><p>{step}</p></div></li>)}</ol><div className="loop-note"><span>↻</span><p><b>This is a closed loop</b>The sequence repeats continuously. New measurements correct the next command.</p></div></div>}

          <div className="motion-lab"><div><span>PHYSICAL DEMONSTRATION</span><strong>Watch control become body motion</strong></div><div className="motion-actions"><button className={motion === "wave" ? "playing" : ""} onClick={() => setMotion("wave")} type="button"><span>▶</span> Wave arm</button><button className={motion === "walk" ? "playing" : ""} onClick={() => setMotion("walk")} type="button"><span>▶</span> Balance</button></div></div>
          <button className="lesson-button" type="button" onClick={() => { const next = systemOrder[(systemOrder.indexOf(selected) + 1) % systemOrder.length]; selectSystem(next); }}>NEXT CONNECTED SYSTEM <span>→</span></button>
        </aside>}

        {labMode === "hardware" && <aside className="detail-panel hardware-detail" data-color={systems[selectedHardware.system].color} aria-live="polite">
          <div className="detail-topline"><span>HARDWARE {hardwareItems.indexOf(selectedHardware) + 1}/{hardwareItems.length}</span><span>{selectedHardware.stage === 0 ? "WORKSHOP EQUIPMENT" : installedHardware.has(selectedHardware.id) ? "INSTALLED IN BUILD" : "REQUIRED HARDWARE"}</span></div>
          <div className="hardware-title-row"><div className="hardware-large-icon">{selectedHardware.icon}</div><div><small>{hardwareCategories[selectedHardware.category].name} · {systems[selectedHardware.system].family}</small><h2>{selectedHardware.name}</h2></div></div>
          <div className="hardware-meta-row"><span><b>QUANTITY</b>{selectedHardware.quantity}</span><span><b>LOCATION</b>{selectedHardware.location}</span><span><b>BUILD STAGE</b>{selectedHardware.stage === 0 ? "Workshop" : `${selectedHardware.stage} / 8`}</span></div>
          <section className="hardware-explain"><span>WHAT IT DOES</span><p>{selectedHardware.job}</p></section>
          <section className="hardware-explain"><span>HOW IT PHYSICALLY WORKS</span><p>{selectedHardware.works}</p></section>
          <div className="hardware-io-grid"><div><span>ϟ</span><p><b>POWER</b>{selectedHardware.power}</p></div><div><span>⇄</span><p><b>DATA / SIGNAL</b>{selectedHardware.data}</p></div><div className="wide"><span>⌁</span><p><b>PHYSICAL & ELECTRICAL CONNECTIONS</b>{selectedHardware.connects}</p></div></div>
          <section className="install-card"><div><span>01</span><p><b>INSTALLATION</b>{selectedHardware.install}</p></div><div><span>02</span><p><b>VERIFY BEFORE USE</b>{selectedHardware.verify}</p></div></section>
          {selectedHardware.stage > 0 ? <button className={`install-hardware-button ${installedHardware.has(selectedHardware.id) ? "installed" : ""}`} type="button" onClick={() => toggleHardwareInstalled(selectedHardware.id)}><span>{installedHardware.has(selectedHardware.id) ? "✓" : "+"}</span>{installedHardware.has(selectedHardware.id) ? "INSTALLED — REMOVE FROM BUILD" : "INSTALL THIS HARDWARE IN BUILD"}</button> : <div className="tool-note"><span>WORKSHOP ONLY</span><p>This equipment is required to assemble or verify the robot, but it is not installed inside the robot.</p></div>}
          <button className="lesson-button" type="button" onClick={() => { const index = hardwareItems.indexOf(selectedHardware); chooseHardware(hardwareItems[(index + 1) % hardwareItems.length]); }}>NEXT HARDWARE GROUP <span>→</span></button>
        </aside>}

        {labMode === "action" && <aside className="detail-panel action-detail" data-color={systems[scenario.steps[flowStep].system].color} aria-live="polite">
          <div className="detail-topline"><span>LIVE FLOW · {flowStep + 1}/{scenario.steps.length}</span><span>{runningFlow ? "SIGNAL MOVING" : "PAUSED"}</span></div>
          <div className="flow-step-number">{String(flowStep + 1).padStart(2, "0")}</div>
          <small className="flow-family">{systems[scenario.steps[flowStep].system].family} · {systems[scenario.steps[flowStep].system].location}</small>
          <h2>{scenario.steps[flowStep].title}</h2>
          <p className="detail-summary">{scenario.steps[flowStep].detail}</p>
          <div className="signal-card active-signal"><span>CURRENT SIGNAL</span><strong>{scenario.steps[flowStep].signal}</strong><div className="signal-line"><i /><i /><i /><i /></div></div>
          <section className="detail-section"><h3>ACTIVE HARDWARE</h3><p>{systems[scenario.steps[flowStep].system].parts.map((part) => part.name).join(" · ")}</p></section>
          <section className="detail-section"><h3>WHY FEEDBACK MATTERS</h3><p>{systems[scenario.steps[flowStep].system].feedback}</p></section>
          <ol className="mini-flow">{scenario.steps.map((step, index) => <li key={step.title} className={flowStep === index ? "active" : flowStep > index ? "complete" : ""}><span>{index < flowStep ? "✓" : index + 1}</span><div><b>{step.title}</b><small>{systems[step.system].shortName}</small></div></li>)}</ol>
          <button className="lesson-button" type="button" onClick={startScenario}>{runningFlow ? "RESTART COMPLETE FLOW" : "RUN FROM THE BEGINNING"}<span>▶</span></button>
        </aside>}

        {labMode === "build" && <aside className="detail-panel build-detail" data-color={systems[buildStages[buildStage].system].color} aria-live="polite">
          <div className="detail-topline"><span>ASSEMBLY {buildStage + 1}/{buildStages.length}</span><span>GATED TEST PROCESS</span></div>
          <div className="build-stage-mark"><span>{String(buildStage + 1).padStart(2, "0")}</span><small>STAGE</small></div>
          <h2>{buildStages[buildStage].title}</h2><p className="detail-summary">{buildStages[buildStage].subtitle}</p>
          <section className="build-explanation"><h3>WHAT THE ENGINEER DOES</h3><p>{buildStages[buildStage].detail}</p></section>
          <section className="engineering-note"><span>ENGINEERING REFERENCE</span><p>HR-01 is an educational system architecture. Before physical construction, calculate actuator torque, frame strength, battery current, thermal limits and certified safety functions for your exact robot.</p></section>
          <section className="assembly-checklist"><div className="checklist-heading"><h3>INSTALL HARDWARE GROUPS</h3><span>{stageHardware.filter((item) => installedHardware.has(item.id)).length}/{stageHardware.length} DONE</span></div><div>{stageHardware.map((item) => <button type="button" key={item.id} className={installedHardware.has(item.id) ? "installed" : ""} onClick={() => toggleHardwareInstalled(item.id)}><span>{installedHardware.has(item.id) ? "✓" : "+"}</span><div><b>{item.name}</b><small>QTY {item.quantity} · {item.location}</small></div><i>INSTALL</i></button>)}</div><button className="install-stage-button" type="button" onClick={installCurrentStage}>✓ INSTALL ALL HARDWARE IN THIS STAGE</button></section>
          <section className="commission-test"><span>PASS BEFORE CONTINUING</span><p>{buildStages[buildStage].test}</p></section>
          <div className="build-progress"><div><span style={{width: `${installedPercent}%`}} /></div><small>{installedPercent}% OF REQUIRED HARDWARE INSTALLED</small></div>
          <div className="build-nav"><button type="button" disabled={buildStage === 0} onClick={() => setBuildStage((value) => Math.max(0, value - 1))}>← PREVIOUS</button><button type="button" disabled={buildStage === buildStages.length - 1} onClick={() => setBuildStage((value) => Math.min(buildStages.length - 1, value + 1))}>NEXT STAGE →</button></div>
        </aside>}
      </section>
    </main>
  );
}
