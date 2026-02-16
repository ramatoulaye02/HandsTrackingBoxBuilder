# 🖐️ Gemini Voxel Builder

A 3D voxel creation tool powered by hand tracking and Gemini AI structural generation. Build, erase, and navigate 3D structures using intuitive hand gestures, or let Gemini AI generate complex structures from natural language prompts.

![Hand Tracking Demo](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Vite](https://img.shields.io/badge/Vite-6.2-purple)

## ✨ Features

### 🎨 Hand Gesture Control
- **Pinch to Build**: Use your index finger and thumb pinch gesture to place voxels in 3D space
- **Real-time Tracking**: Powered by MediaPipe Tasks Vision for accurate hand landmark detection
- **Multiple Modes**: Switch between Build, Erase, and Navigate modes seamlessly

### 🤖 AI-Powered Generation
- **Gemini Integration**: Generate complete voxel structures from text descriptions
- **Magic Build**: Simply describe what you want, and let Gemini AI create it
- **Intelligent Structures**: AI understands spatial relationships and generates coherent 3D models

### 🎮 Intuitive Interface
- **Color Palette**: Choose from 8 vibrant colors for your voxels
- **3D Navigation**: Orbit camera mode for viewing your creation from any angle
- **Live Feedback**: Real-time status indicators for hand tracking and voxel count
- **Camera Toggle**: Turn camera tracking on/off as needed

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- A modern web browser with camera access
- Camera/webcam for hand tracking functionality

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ramatoulaye02/HandsTrackingBoxBuilder.git
cd HandsTrackingBoxBuilder
```

2. Install dependencies:
```bash
npm install
```

3. Set up Gemini API (if using AI features):
   - Obtain a Gemini API key from Google AI Studio
   - Configure the API key in your environment (see `services/geminiService.ts`)

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

6. **Grant camera permissions** when prompted to enable hand tracking

## 🎯 Usage

### Hand Gestures
1. **Show your hand** to the camera - the system will detect it automatically
2. **Pinch gesture** (touch index finger and thumb together) to place/remove voxels
3. The hand tracking indicator will show when your hand is detected

### Controls
- **Build Mode** (Green): Pinch to place voxels at cursor position
- **Erase Mode** (Red): Pinch to remove voxels at cursor position  
- **Navigate Mode** (Blue): Use hand movement to orbit the camera

### Color Selection
- Click any color in the palette to select it for building
- Current color is highlighted with a white border

### AI Magic Build
1. Type a description in the bottom prompt bar (e.g., "a small house", "a pyramid", "a tree")
2. Press Enter or click "Magic Build"
3. Watch as Gemini AI generates your structure

### Additional Controls
- **Camera Toggle** (top right): Enable/disable hand tracking camera
- **Reset Button** (top right): Clear all voxels from the scene

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2 with TypeScript
- **3D Rendering**: Three.js with React Three Fiber
- **Hand Tracking**: MediaPipe Tasks Vision
- **AI Generation**: Google Gemini API
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS (via utility classes)
- **Icons**: Heroicons

## 📦 Project Structure

```
HandsTrackingBoxBuilder/
├── components/
│   ├── HandTrackerOverlay.tsx    # Hand tracking camera overlay
│   └── VoxelScene.tsx             # 3D scene renderer
├── services/
│   └── geminiService.ts           # Gemini API integration
├── App.tsx                         # Main application component
├── types.ts                        # TypeScript type definitions
├── index.tsx                       # Application entry point
├── index.html                      # HTML template
├── metadata.json                   # App metadata
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available for educational and personal use.

## 🙏 Acknowledgments

- MediaPipe for hand tracking technology
- Google Gemini for AI-powered structure generation
- React Three Fiber community for 3D rendering capabilities

---

**Made with ❤️ using hand gestures and AI**
