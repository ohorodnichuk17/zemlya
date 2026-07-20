# 🌾 Zemlya: Land Management & Soil Recovery Advisor

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/.NET-10.0-blue.svg)](https://dotnet.microsoft.com/)
[![Frontend](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)

**Zemlya** is a decision-support advisory system designed for Ukrainian territorial communities (ОТГ) and small-scale farmers to manage, monitor, and restore agricultural soils degraded and contaminated by military actions. 

Rather than relying on dangerous physical field testing in mined areas, **Zemlya** combines remote sensing, regional GIS databases, and scientific agricultural models to calculate immediate soil recovery plans.

---

## 📸 Project Demonstration

### 1. Dashboard & Field Overview
![Dashboard](3.png)

### 2. Ecological Recommendations & Recovery Calendar
![Recovery Recommendations](1.png)

### 3. Integrated Scientific Soil Database (Organic Portal)
![GIS Soil Map](2.png)

---

## 🌟 Key Features

* **Multi-Tenant Architecture**: Dedicated and secure portals for **Farmers** (managing fields and crops), **Agronomists** (monitoring soil health), and **State Auditors** (certifying safe fields).
* **Automatic Soil Eco-Alerts**: Triggers chemical hazard warnings when high shelling impact levels are logged, blocking food cultivation for hyperaccumulator crops (like sunflowers) and recommending industrial/biodiesel use instead.
* **Agro-Chemical Recovery Scheduling**: Calculates optimal dosages of soil sorbents (Zeolite, Biochar, Lime, Activated Carbon) to adsorb heavy metals (Lead, Cadmium, Zinc) and neutralize powder gases.
* **Academic GIS Integration**: Seamlessly pulls soil types, natural pH acidity, and humus parameters from the **Organic Portal** database developed by researchers at the **National University of Water and Environmental Engineering (NUWEE, Rivne)**.

---

## 🛠️ Tech Stack & Architecture

* **Backend**: ASP.NET Core (.NET 10), **Vertical Slice Architecture** (isolated feature slices), CQRS (MediatR), PostgreSQL, EF Core, and YARP Reverse Proxy.
* **Frontend**: React (TypeScript), Material-UI, Leaflet Map, Redux Toolkit.

---

## 🚀 Setup & Installation

### Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
* [Node.js (v20+)](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

### 1. Run the Backend API
1. Navigate to the API folder:
   ```bash
   cd src/Zemlya.Api
   ```
2. Configure your database connection string in `appsettings.json`.
3. Apply migrations and run the server:
   ```bash
   dotnet run
   ```

### 2. Run the Web Frontend
1. Navigate to the Web folder:
   ```bash
   cd src/Zemlya.Web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🛰️ Project Roadmap

* **YOLOv8 Crater Detection**: Train and deploy a YOLOv8 object detection model (using the `ukraine-aerial-crater-dataset`) to automatically detect and map artillery craters on satellite orthophotos.
* **Agro API Integration**: Transition from standard weather forecasts to the `/agro/1.0/soil` API to fetch real-time soil surface temperature ($t_{0}$), sowing-depth temperature ($t_{10}$), and precise moisture indexes.
* **Public Municipal Portal**: Open ecological data pages for municipalities to showcase demining priorities and attract international recovery grants.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with 💚 by **Yuliia & Nazar Team** (NUWEE, Rivne, 2026).
