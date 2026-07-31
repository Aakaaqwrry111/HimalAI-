# 🏔️ Himal AI

> **Real-time AI & Crowdsourced Trail Intelligence for High-Altitude Himalayan Exploration.**

Himal AI bridges the critical gap between static mountain maps and dynamic ground realities. Built specifically for high-altitude Himalayan routes (Annapurna, Everest, Mardi, Langtang, and beyond), Himal AI combines AI itinerary generation, real-time hazard crowdsourcing, computer vision peak recognition, and local teahouse intelligence into a single reactive application.

---

## ✨ Key Features

* **🤖 AI Journey Builder:** Generates acclimatization-aware trekking itineraries tailored to a trekker's physical fitness, trip duration, and altitude safety limits to help prevent Acute Mountain Sickness (AMS).
* **📡 Real-Time Community Trail Wire:** A decentralized live dispatch feed powered by Firebase Firestore. Trekkers, guides, and lodge owners can broadcast geotagged updates:
  * ⚠️ **Hazard Alerts:** Landslides, loose gravel, or severe weather warnings.
  * 🥾 **Trail Conditions:** Snow cover, mud levels, or path stability.
  * 🛖 **Teahouse Updates:** Solar hot water, Wi-Fi connectivity, and room availability.
  * 💬 **General Dispatches:** Trail news and weather observations.
* **📷 AI Lens (Peak Vision):** Computer-vision tool allowing trekkers to point their camera at surrounding Himalayan peaks and landmarks for instant identification and contextual history.
* **🗺️ Smart Map & TrekSafe:** Interactive elevation profiling, route waypoint markers, high-altitude emergency protocols, and offline safety advisories.
* **🏅 Explorer Passport:** Gamified digital passport tracking travel milestones, visited passes, and awarding verified badges for contributing safety dispatches on the trail.
* **🛖 Teahouse Directory:** Live directory enabling local *sahu-jis* to update lodge amenities, occupancy, and services in real time.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling & Motion:** Tailwind CSS, Framer Motion, Lucide React
* **Backend & Database:** Firebase Auth (Google OAuth), Cloud Firestore
* **Real-time Engine:** Firestore `onSnapshot` real-time listeners with local optimistic UI updates

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0 or higher)
* `npm` or `pnpm`

### 2. Clone the Repository

```bash
git clone [https://github.com/your-username/himal-ai.git](https://github.com/your-username/himal-ai.git)
cd himal-ai
