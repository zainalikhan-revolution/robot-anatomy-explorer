# 🤖 Robot Anatomy Explorer

An interactive educational laboratory that helps students explore, understand and virtually assemble a humanoid robot.

🌐 **Live Website:**
https://robot-anatomy-explorer.masterkhan737.chatgpt.site

## About the Project

Robot Anatomy Explorer transforms complex humanoid robotics into a visual, interactive and student-friendly learning experience.

Instead of learning only through diagrams and theory, students can explore the robot’s internal systems, examine its hardware, follow control signals and understand the correct engineering assembly sequence.

The project is especially intended for students and institutions that may not yet have access to expensive physical humanoid robotics hardware.

## Main Features

* 10 connected humanoid robot systems
* 51 detailed hardware groups
* Clickable robot components
* X-ray and exploded hardware views
* Animated movement demonstrations
* Power, data and mechanical connection tracing
* Closed-loop action simulations
* Walking and balance-control explanations
* Eight-stage virtual assembly studio
* Installation and hardware-testing guidance
* Responsive desktop and mobile interface
* Student-friendly engineering explanations

## Learning Laboratory

The application contains four main learning sections.

### 1. Robot Anatomy

Students can explore ten connected systems:

1. Vision and depth sensing
2. Hearing and speech
3. Artificial intelligence and computing
4. Internal control network
5. Energy and power
6. Actuators and joints
7. Balance and body sensing
8. Hands and touch
9. Skeleton and cooling
10. Safety and supervision

Each system explains:

* Its purpose
* Physical location
* Real components
* Inputs and outputs
* Operating sequence
* Feedback mechanism
* Real-world example
* Safety protection

### 2. Hardware Explorer

The Hardware Explorer contains 51 hardware groups organized into eight categories:

* Frame and structural components
* Actuators and transmissions
* Computers and controllers
* Sensors
* Battery and power electronics
* Wiring and communication buses
* Safety and cooling systems
* Workshop and testing tools

Students can inspect the quantity, location, power requirements, data signals, connections, installation procedure and testing method for each hardware group.

### 3. Action Flow

This section demonstrates how different robot systems work together through a closed feedback loop:

```text
Sense → Understand → Plan → Move → Measure → Correct
```

Example simulations include:

* Seeing and picking up a cup
* Walking and recovering balance
* Hearing and following a command

The active sensors, computers, controllers, motors and safety systems are identified during every stage.

### 4. Build Studio

Students can virtually assemble the humanoid robot through eight engineering stages:

1. Frame and bearings
2. Actuators and transmissions
3. Power and protection
4. Communication harness
5. Computers and software
6. Perception and body sensors
7. Covers, hands and cooling
8. Calibration and safe commissioning

Each stage includes:

* Required hardware
* Installation sequence
* Engineering explanation
* Verification procedure
* Safety test before continuing
* Overall assembly progress

## Technologies Used

* Next.js
* React
* TypeScript
* HTML5
* CSS
* Tailwind CSS
* Vinext
* Cloudflare-compatible deployment

## Running the Project Locally

### Requirements

* Node.js 22.13 or newer
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/robot-anatomy-explorer.git
```

Open the project directory:

```bash
cd robot-anatomy-explorer
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address displayed in the terminal.

## Production Build

Create a production build:

```bash
npm run build
```

Run the available automated tests:

```bash
npm test
```

## Project Structure

```text
robot-anatomy-explorer/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── public/
├── scripts/
├── tests/
├── worker/
├── package.json
├── package-lock.json
└── README.md
```

## Educational Purpose

This project is an educational system-level reference for understanding humanoid robotics.

It is not a certified mechanical, electrical or safety design for constructing a full-size physical humanoid robot. A physical robot requires:

* Actuator torque calculations
* Structural strength analysis
* Battery and wiring calculations
* Thermal testing
* Risk assessment
* Emergency protection systems
* Qualified engineering supervision

Students should begin with simulations and small low-power robotics projects before attempting advanced physical construction.

## Future Development

Planned improvements include:

* Full WebGL 3D humanoid model
* Realistic articulated joint movement
* More real-world robot missions
* Interactive circuit and wiring lessons
* Component shopping-list generator
* Arduino, Python and ROS programming lessons
* English and Urdu learning modes
* Student quizzes and progress tracking
* Teacher dashboard and classroom activities

## Vision

The goal of Robot Anatomy Explorer is to make advanced robotics education visual, accessible and understandable for every student—regardless of whether their institution currently owns expensive robotics hardware.

## Creator

Created by **Muhammad Arafat Khan** as an educational technology initiative for students, teachers and future robotics engineers.

## Live Demonstration

Explore the complete interactive laboratory:

https://robot-anatomy-explorer.masterkhan737.chatgpt.site

## License

No open-source license is currently included. All rights are reserved by the project owner unless written permission is provided.

---

If you find this project useful, please give the repository a ⭐ and share your feedback.
