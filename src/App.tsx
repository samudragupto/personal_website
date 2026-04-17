import { type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronDown, ChevronUp, Menu, Pin, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Splitting from "splitting";
import { Analytics } from "@vercel/analytics/react";

type CertCategory = "all" | "ibm" | "upskillist" | "cognitive";
type LeetLang = "python" | "cpp";
type PublicationType = "patent" | "journal" | "conference" | "article";
type Level = "hard" | "medium" | "easy";
type SectionId = "home" | "about" | "featured" | "experience" | "projects" | "education" | "certifications" | "journey" | "awards" | "publications" | "leetcode" | "contact";

type MediaItem = {
  type: "image" | "video";
  src: string;
};

type AmbientParticle = {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
};

type DemoWindowProps = {
  title: string;
  demoVideo: string;
  enableBackdrop: boolean;
};

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const navItems: Array<{ label: string; id: SectionId }> = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Featured", id: "featured" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Certifications", id: "certifications" },
  { label: "Journey", id: "journey" },
  { label: "Awards", id: "awards" },
  { label: "Publications", id: "publications" },
  { label: "Problem Solving", id: "leetcode" },
  { label: "Contact", id: "contact" },
];

const roles = ["Systems programmer focused on CUDA, AI infrastructure, and low-level security", "GPU Engineer", "AI Infrastructure Builder", "Firmware Security Researcher"];

const oneMinuteProfile = [
  "Identity: Systems programmer focused on CUDA, AI infrastructure, and low-level security.",
  "Current status: BTech CSE (DS&AI), 2024-2028.",
  "Objective: Research internship / systems-AI engineering roles.",
];

const techTape = [
  "CUDA",
  "C++",
  "Systems Programming",
  "AI Infrastructure",
  "Security Research",
  "x86 Assembly",
  "LLM Runtime",
  "Performance Engineering",
];

const certifications = [
  {
    title: "Certificate of Participation IBM TechXchange Dev Day: Open Source LLMs",
    date: "Apr 2025",
    issuer: "BeMyApp",
    credentialId: "d2f3b9d7-ab33-42bf-84fb-a4ae3f9b4175",
    category: "ibm" as const,
    link: "https://www.virtualbadge.io/certificate-validator?credential=d2f3b9d7-ab33-42bf-84fb-a4ae3f9b4175",
  },
  {
    title: "Python Programming",
    date: "Apr 2025",
    issuer: "Upskillist",
    credentialId: "hr4yknf5r3j90hr4yknvof3vog4fz0ev",
    expiry: "Apr 2030",
    category: "upskillist" as const,
    link: "https://www.upskillist.com/certificate/en/xUJHa4cH/hr4yknf5r3j90hr4yknvof3vog4fz0ev",
  },
  {
    title: "Certificate of Completion - I built a virtual agent at IBM TechXchange Dev Day: Virtual Agents",
    date: "Jan 2025",
    issuer: "BeMyApp",
    credentialId: "05a22f34-8ed5-470c-a622-3dadf595b0d1",
    category: "ibm" as const,
    link: "https://www.virtualbadge.io/certificate-validator?credential=05a22f34-8ed5-470c-a622-3dadf595b0d1",
  },
  {
    title: "Certificate of Participation IBM TechXchange Dev Day: Virtual Agents",
    date: "Jan 2025",
    issuer: "BeMyApp",
    credentialId: "caf6871f-2a59-4917-b885-8cd9f1d7f244",
    category: "ibm" as const,
    link: "https://www.virtualbadge.io/certificate-validator?credential=caf6871f-2a59-4917-b885-8cd9f1d7f244",
  },
  {
    title: "HR Employee Management",
    date: "Dec 2024",
    issuer: "Upskillist",
    credentialId: "h7yfn8gjv95ug3h7yfn8ghsvcc2hhn06",
    category: "upskillist" as const,
    link: "https://www.upskillist.com/certificate/en/Y9OtG03u/h7yfn8gjv95ug3h7yfn8ghsvcc2hhn06",
  },
  {
    title: "Python Programming",
    date: "Nov 2024",
    issuer: "Upskillist",
    credentialId: "tztkmxu7rrpy15l3rmp4tztkmvb5zm1p",
    category: "upskillist" as const,
    link: "https://www.upskillist.com/certificate/en/O4cfI79Y/tztkmxu7rrpy15l3rmp4tztkmvb5zm1p",
  },
  {
    title: "Python Programming",
    date: "Nov 2024",
    issuer: "Upskillist",
    credentialId: "qp2mv6b9u56fxnrbqp2mv88xb56cb51r",
    category: "upskillist" as const,
    link: "https://www.upskillist.com/certificate/en/aYIhzb33/qp2mv6b9u56fxnrbqp2mv88xb56cb51r",
  },
  {
    title: "Prompt Engineering for Everyone",
    date: "Nov 2024",
    issuer: "Cognitive Class",
    credentialId: "0f6d92b1f2914b37b84376196d1d1cf7",
    category: "cognitive" as const,
    link: "https://courses.cognitiveclass.ai/certificates/0f6d92b1f2914b37b84376196d1d1cf7",
  },
  {
    title: "Python 101 for Data Science",
    date: "Nov 2024",
    issuer: "Cognitive Class",
    credentialId: "c1b9df1d0bcd441591445a981b28e75c",
    category: "cognitive" as const,
    link: "https://courses.cognitiveclass.ai/certificates/c1b9df1d0bcd441591445a981b28e75c",
  },
];

const pinnedItems = [
  {
    title: "RegPilot - Top 10 Finalist, GenAI Zurich Hackathon 2026",
    period: "2026",
    summary:
      "Selected in the final rounds from 93 submissions. Participation and final pitch were remote, not onsite in Switzerland. RegPilot is a GenAI-powered compliance analysis system for Swiss finance with privacy-first and local-first design principles.",
    details: [
      "Designed the solution for regulatory interpretation workflows where sensitive financial context cannot leave controlled environments.",
      "Focused on practical analysis flow: policy parsing, requirement mapping, and actionable compliance guidance for teams.",
      "Built and presented as Team RegPilot during the final rounds against top projects from the global submission pool.",
    ],
    links: [
      { label: "GitHub", href: "https://lnkd.in/g2hNyVW9" },
      { label: "Devpost", href: "https://lnkd.in/g37AGqY3" },
      { label: "Pitch Video", href: "https://youtu.be/Ppa2-2N4lgE" },
      { label: "Remote Final Pitch", href: "https://youtu.be/EPoxws-Iv0o" },
    ],
  },
  {
    title: "AAIMB 2026 Conference Presentation - S.A. Engineering College",
    period: "2026",
    summary:
      "Presented research on a hybrid deep-learning framework for sentiment analysis and pattern recognition in social media. Shared methodology, ablation findings, and deployment metrics in a peer research setting.",
    details: [
      "Paper: A Hybrid Deep Learning Framework for Sentiment Analysis and Pattern Recognition in Social Media (BiLSTM + CNN + attention).",
      "Reported Sentiment140 performance: 94.2% accuracy, 93.8% precision, 94.4% recall, 94.1% F1, with 4-6% improvement over prior baselines.",
      "Efficiency findings highlighted 2.2ms inference latency, 450 samples/sec throughput, and a smaller/faster profile than larger transformer baselines.",
    ],
    links: [
      { label: "Conference Video", href: "https://www.youtube.com/watch?v=0dUQILDT_Cg" },
      {
        label: "Presentation Slides",
        href: "https://github.com/samudragupto/Hybrid-Sentiment-Analysis-Presentation/tree/main/presentation",
      },
    ],
  },
];

const experienceSections = [
  {
    key: "hackathon",
    title: "Hackathon",
    entries: [
      {
        role: "Top 10 Finalist - GenAI Zurich Hackathon 2026 (Remote)",
        org: "RegPilot",
        period: "2026",
        location: "Remote participation",
        details: [
          "Reached the final rounds from 93 submissions with a privacy-first compliance analysis platform for Swiss finance.",
          "Focused on local-first architecture, regulatory mapping workflows, and actionable compliance guidance using GenAI.",
          "Presented in remote final rounds; participation was fully remote and not onsite in Switzerland.",
        ],
        links: [
          { label: "GitHub", href: "https://lnkd.in/g2hNyVW9" },
          { label: "Devpost", href: "https://lnkd.in/g37AGqY3" },
          { label: "Pitch Video", href: "https://youtu.be/Ppa2-2N4lgE" },
          { label: "Remote Final Pitch", href: "https://youtu.be/EPoxws-Iv0o" },
        ],
      },
    ],
  },
  {
    key: "leadership",
    title: "Leadership",
    entries: [
      {
        role: "Joint Secretary Elect",
        org: "The Institution of Engineers (India)",
        period: "Apr 2025 - Present",
        location: "Chennai, Tamil Nadu, India",
        details: [
          "Elected as Joint Secretary for IEI activities at Dr. M.G.R. Educational and Research Institute.",
          "Supporting student engineering initiatives, chapter coordination, and technical engagement programs.",
        ],
        links: [],
      },
    ],
  },
  {
    key: "internship",
    title: "Internship",
    entries: [],
  },
] as const;

const projects = [
  {
    title: "GENESIS: GPU-Accelerated Planetary Evolution & Ecosystem Simulator",
    period: "Mar 2026 - Present",
    summary:
      "Architected and developed a massive-scale artificial life and planetary simulator written entirely in C++ and CUDA. Offloaded 100% of computational workload to the GPU to remove CPU-GPU bottlenecks and simulate millions of interacting entities in real-time.",
    highlights: [
      "Engineered a custom CUDA neural AI engine to evaluate 200,000+ unique MLPs in parallel with agent-specific weights decoded directly from VRAM.",
      "Implemented NVIDIA Thrust radix sorting and spatial hashing for O(1) neighbor lookups and high-density collision handling.",
      "Built GPU-native evolution loops: crossover, distance-based speciation, and cuRAND mutation across 256-float genomes.",
      "Sustained approximately 0.35ms macro-ticks (~2,850 TPS) on RTX 4060 using multi-stream overlap of physics, AI, and ecosystem updates.",
    ],
    skills: ["C++", "CUDA", "GPU Kernels", "Neural Simulation", "Performance Engineering"],
    link: "https://github.com/samudragupto/GENESIS-CUDA",
    demoVideo: "https://youtu.be/ok9CsE8X-0I?si=5GSwlLlNeaHT0giB",
    evidence: {
      problem:
        "Simulate massive artificial-life ecosystems without CPU-GPU bottlenecks while preserving real-time interactivity.",
      approach: [
        "Built a full CUDA-first architecture with custom GEMM kernels evaluating 200,000+ unique agent MLPs in parallel.",
        "Used Thrust radix sorting + spatial hashing for O(1) neighborhood queries and high-density collision handling.",
        "Implemented on-device genetic evolution with cuRAND mutation and distance-based speciation across 256-float genomes.",
      ],
      result: "Sustained ~0.35ms per macro-tick (~2,850 TPS) on RTX 4060 with multi-stream overlap of physics, AI, and ecosystem updates.",
    },
  },
  {
    title: "Vector Forth Kernel",
    period: "Jan 2026 - Present",
    summary:
      "Vector Forth Kernel is a custom bare-metal x86-64 operating system built from scratch in C and x86-64 Assembly for deep systems-level understanding.",
    highlights: [
      "Implemented two-stage MBR bootloader with real-mode to long-mode transition and higher-half kernel mapping.",
      "Built physical and virtual memory managers, IDT/PIC interrupts, keyboard/timer/VGA/serial drivers, and PCI enumeration.",
      "Integrated a threaded-code Forth VM with runtime compilation and a persistent block filesystem with built-in visual editor.",
      "Added SIMD-accelerated vector stack operations using 128-bit XMM registers.",
    ],
    skills: ["Operating Systems", "x86-64", "Assembly", "C", "SIMD"],
    link: "https://github.com/samudragupto/vector-forth-kernel",
    demoVideo: "https://youtu.be/89slxI0GuRA?si=agu9WRPFdG-2w2tL",
    evidence: {
      problem:
        "Build a bare-metal x86-64 OS and language runtime from scratch to deeply understand boot, memory, interrupts, and execution model internals.",
      approach: [
        "Implemented two-stage MBR bootloader and full 16-bit real mode to 64-bit long mode transition with higher-half mapping.",
        "Developed physical/virtual memory managers, IDT/PIC handling, PS/2/PIT/VGA/serial drivers, and PCI enumeration.",
        "Integrated a threaded-code Forth VM with runtime compilation and SIMD vector stack operations using XMM registers.",
      ],
      result: "Delivered a working custom kernel stack with persistent block filesystem and runtime-compiled Forth execution on bare metal.",
    },
  },
  {
    title: "Custom TinyLlama CUDA Inference Runtime",
    period: "2026",
    summary:
      "Built an end-to-end LLM inference runtime from HTTP request to tokenized input, CUDA decode, paged KV-cache management, and JSON response serving.",
    highlights: [
      "Implemented custom CUDA kernels with FP16/INT8 mixed precision for practical inference acceleration.",
      "Designed paged KV-cache memory handling for autoregressive decode efficiency and lower memory churn.",
      "Integrated tokenizer encode/decode and OpenAI-compatible chat completion HTTP API.",
      "Validated TinyLlama-style weight loading and full GPU-backed text generation flow.",
    ],
    skills: ["CUDA", "C++", "LLM Infra", "KV Cache", "Inference Serving"],
    link: "https://github.com/samudragupto/llm-cuda-engine-stable",
    demoVideo: "https://youtu.be/7X0L90IBKgY?si=P44lYAcI4HOMIlq5",
    evidence: {
      problem:
        "Understand and implement LLM inference internals beyond framework wrappers, from request handling to GPU decode and response serving.",
      approach: [
        "Implemented custom CUDA kernels with FP16/INT8 mixed precision and paged KV-cache for efficient autoregressive decoding.",
        "Built tokenizer encode/decode path and integrated OpenAI-compatible HTTP API serving.",
        "Designed end-to-end runtime path: HTTP request -> tokenizer -> CUDA decode -> KV cache -> generated JSON response.",
      ],
      result: "Produced a functional GPU-backed TinyLlama-style inference runtime with practical memory-aware serving behavior.",
    },
  },
  {
    title: "Firmware Implant Detector (x86 Assembly)",
    period: "Jan 2026 - Feb 2026",
    summary:
      "Designed a bootable forensic security tool written fully in x86 Assembly (NASM) that audits firmware integrity directly from USB without relying on an operating system.",
    highlights: [
      "Implemented a multi-stage MBR bootloader and manual CPU mode switching between 16-bit real mode and 32-bit protected mode.",
      "Configured GDT and memory handling for low-level forensic scan execution.",
      "Added CRC32 baseline checks, implant signatures (LoJax, MosaicRegressor, HackingTeam), and entropy heuristics for packed payload detection.",
      "Interacted directly with IVT, Option ROMs, BIOS Data Area, and raw disk sectors for persistence and integrity baselining.",
    ],
    skills: ["x86 Assembly", "NASM", "Firmware Security", "Forensics", "QEMU"],
    link: "https://github.com/samudragupto/Firmware-Detector",
    evidence: {
      problem:
        "Detect firmware-level persistence and implants from a trusted execution path that does not depend on the host operating system.",
      approach: [
        "Built a multi-stage USB boot flow in NASM with explicit mode switching between 16-bit real mode and 32-bit protected mode.",
        "Implemented CRC32 integrity checks, implant signature scanning, and entropy heuristics for suspicious payload detection.",
        "Interfaced directly with IVT, Option ROMs, BIOS Data Area, and raw disk sectors for baseline persistence and anomaly comparison.",
      ],
      result: "Validated bootable bare-metal forensic scanning in QEMU with repeatable firmware integrity baseline generation.",
    },
  },
  {
    title: "AI-Powered Predictive Maintenance System for Fleet Vehicles",
    period: "Feb 2026 - Mar 2026",
    summary:
      "Developed an AI-powered predictive maintenance platform for connected fleet telemetry that predicts component failures and automates maintenance planning.",
    highlights: [
      "Implemented real-time telemetry ingestion and ML-driven failure prediction.",
      "Built event-driven orchestration with Kafka and service-level diagnosis/cost/scheduling workflows.",
      "Delivered fleet dashboarding and driver behavior analytics including UEBA-style monitoring.",
    ],
    skills: ["Python", "FastAPI", "Kafka", "PostgreSQL", "XGBoost", "React"],
    link: "https://github.com/samudragupto/predictive-maintenance-system",
  },
  {
    title: "GPU-Powered Real Time Universe Simulation",
    period: "Mar 2026",
    summary:
      "Built a real-time universe simulation engine using C++, CUDA, OpenGL, and Barnes-Hut N-body gravity to visualize large particle systems interactively.",
    highlights: [
      "Integrated CUDA force computation with OpenGL rendering pipeline for real-time simulation.",
      "Implemented runtime controls for bloom, trails, overlays, and camera modes.",
      "Created performance-oriented branches to scale particle counts for stress scenarios.",
    ],
    skills: ["C++", "CUDA", "OpenGL", "Barnes-Hut", "Rendering"],
    link: "https://github.com/samudragupto/universe-sim",
    demoVideo: "https://youtu.be/KP0aLJnDQw4?si=ZcamAWxmvSh0aYo9",
  },
  {
    title: "NutriScan: AI-Powered Grocery Analytics Platform",
    period: "Jan 2026",
    summary:
      "Designed and deployed a full-stack SaaS application that audits grocery receipts for nutritional quality and spending efficiency using GenAI and computer vision.",
    highlights: [
      "Integrated Gemini workflows for context-aware dietary recommendations.",
      "Built OCR pipeline converting receipts into structured JSON for analytics.",
      "Shipped CI/CD with GitHub Actions and Docker-based environment consistency.",
      "Combined OpenFoodFacts/USDA APIs with local SQLite for app-state and user flows.",
    ],
    skills: ["Python", "Gemini", "Streamlit", "OCR", "Docker", "CI/CD"],
    link: "https://github.com/samudragupto/grocery_health_analyzer",
  },
  {
    title: "Defence Portal",
    period: "Nov 2025",
    summary:
      "AI-enabled defence cyber incident and safety portal focused on rapid triage, role-based intelligence views, and high-assurance security controls.",
    highlights: [
      "Designed multi-input threat detection flow across messages, URLs, docs, and media.",
      "Specified defense-grade MFA stack (smart card, biometric, TOTP) and secure architecture layers.",
      "Added emergency escalation workflow alignment for CERT-style response queues.",
    ],
    skills: ["Cybersecurity", "AI/ML", "React", "Node.js", "MongoDB", "Threat Intelligence"],
    link: "https://github.com/samudragupto/Defence-Portal",
  },
  {
    title: "Forest Rights Act - Decision Support System V1",
    period: "Sep 2025 - Oct 2025",
    summary:
      "Built a fraud detection decision-support dashboard to streamline insurance and financial claim verification with ML-assisted risk prioritization.",
    highlights: [
      "Integrated REST APIs and WebSocket updates for real-time claim state synchronization.",
      "Delivered interactive analyst workflows with filtering, action controls, and risk visibility.",
      "Reduced manual review overhead through structured triage and model-backed recommendations.",
    ],
    skills: ["JavaScript", "REST APIs", "WebSocket", "Node.js", "Fraud Detection"],
    link: "https://github.com/samudragupto/FRA-IMPLEMENTATION",
  },
  {
    title: "Water Quality Intelligence System V3",
    period: "Sep 2025 - Oct 2025",
    summary:
      "Developed a real-time water quality monitoring system that combines IoT ingestion, Flask dashboarding, and AI risk insights.",
    highlights: [
      "Implemented live sensor visualization and contamination risk alerting.",
      "Added outbreak prediction workflows and trend-aware decision views.",
      "Designed modular architecture for scaling and future integration.",
    ],
    skills: ["Python", "Flask", "IoT", "AI/ML", "Dashboard Engineering"],
    link: "https://github.com/samudragupto/Water-Quality-Intelligence-System",
  },
  {
    title: "Environmental Analysis Bot",
    period: "University Project",
    summary:
      "Built a sensor-driven environmental monitoring bot using ESP8266/ESP32 ecosystem and embedded programming workflows.",
    highlights: [
      "Worked with NodeMCU ESP8266, ESP32-CAM, DHT11, MQ7, and motor driver modules.",
      "Applied Arduino IDE-based control logic and embedded C programming practices.",
      "Strengthened fundamentals in robotics integration and hardware-software interfacing.",
    ],
    skills: ["Embedded C", "Arduino", "ESP8266", "ESP32", "Sensors", "Robotics"],
    link: "https://github.com/samudragupto",
  },
];

const projectArtifacts: Record<string, string[]> = {
  "GENESIS: GPU-Accelerated Planetary Evolution & Ecosystem Simulator": [
    "YouTube Walkthrough",
    "GitHub Repository",
    "Benchmark",
    "System Architecture",
  ],
  "Vector Forth Kernel": ["Kernel Walkthrough", "Boot Sequence", "System Information", "Operations"],
  "Custom TinyLlama CUDA Inference Runtime": ["Architecture Deep Dive", "CUDA Kernel Notes", "Serving API Flow"],
  "AI-Powered Predictive Maintenance System for Fleet Vehicles": ["Dashboard", "Vehicle Details", "Cost Generator", "System Flow"],
  "GPU-Powered Real Time Universe Simulation": ["YouTube Demo", "GitHub Repository", "Simulation Scenarios"],
  "Firmware Implant Detector (x86 Assembly)": ["GitHub Repository", "Boot Flow", "Forensic Scan Output"],
  "NutriScan: AI-Powered Grocery Analytics Platform": ["Source Code", "Live Demo", "Dashboard", "OCR Pipeline"],
  "Defence Portal": ["Threat Dashboard", "Incident Workflow", "Security Architecture"],
  "Forest Rights Act - Decision Support System V1": ["GitHub Repository", "Dashboard UI", "Realtime Monitoring"],
  "Water Quality Intelligence System V3": ["GitHub Repository", "Alert Dashboard", "Trend Analytics"],
  "Environmental Analysis Bot": ["Certificate", "Circuit Diagram", "Team Build"],
};

const topProjectRoleContribution: Record<string, { role: string; contribution: string }> = {
  "GENESIS: GPU-Accelerated Planetary Evolution & Ecosystem Simulator": {
    role: "Role: System Architect + CUDA Runtime Engineer",
    contribution: "Contribution: Built the full GPU-first simulation core and performance path.",
  },
  "Vector Forth Kernel": {
    role: "Role: Kernel + Runtime Developer",
    contribution: "Contribution: Implemented boot, memory, drivers, and Forth VM stack.",
  },
  "Custom TinyLlama CUDA Inference Runtime": {
    role: "Role: Inference Systems Engineer",
    contribution: "Contribution: Built CUDA decode path, KV-cache, tokenizer, and API serving.",
  },
  "GPU-Powered Real Time Universe Simulation": {
    role: "Role: GPU Simulation Engineer",
    contribution: "Contribution: Integrated CUDA N-body compute with OpenGL render pipeline.",
  },
};

const education = [
  {
    institute: "Dr MGR Educational and Research Institute",
    degree: "Bachelor of Technology - BTech, CSE (DS&AI)",
    period: "2024 - 2028",
    logo: "/images/education/mgr-logo.png",
    short: "MGR",
  },
  {
    institute: "Delhi Public School, Siliguri",
    degree: "10+2",
    period: "2015 - 2024",
    logo: "/images/education/dps-logo.png",
    short: "DPS",
  },
];

const technicalSkills = {
  languages: ["Python", "C++", "JavaScript", "C", "x86 Assembly (NASM)", "SQL", "HTML/CSS", "Embedded C", "PowerShell"],
  frameworks: [
    "Flask",
    "React.js",
    "Node.js",
    "Socket.IO",
    "Streamlit",
    "NumPy",
    "Pandas",
    "Matplotlib",
    "Seaborn",
    "Plotly",
    "scikit-learn",
    "TensorFlow",
    "PyTorch",
    "XGBoost",
    "Chart.js",
    "bcrypt",
  ],
  tools: ["Git", "GitHub Actions", "Docker", "VS Code", "QEMU", "MongoDB Atlas", "PostgreSQL", "SQLite", "Arduino IDE", "npm"],
  domains: [
    "REST APIs",
    "WebSocket",
    "CI/CD",
    "GenAI (Gemini)",
    "Computer Vision",
    "OCR",
    "IoT",
    "Systems Programming",
    "Firmware Security",
    "Malware Analysis",
    "Low-Level Programming",
    "Embedded Systems",
    "DS & Algorithms",
  ],
};

const journeyEvents = [
  {
    id: "malaysia",
    track: "International",
    title: "Malaysia - UCSI University & Kuala Lumpur",
    date: "3-7 Oct 2025",
    summary: "International tech exposure visit with workshops, industry interactions, and cultural learning.",
    details:
      "5-day academic exposure program with Dr. M.G.R. University. Sessions covered AI-driven cybersecurity and software development life cycle, along with CelcomDigi industry visit.",
    skills: [
      "International Collaboration",
      "AI & Cybersecurity",
      "Software Development Life Cycle",
      "Industry Exposure",
      "Cross-cultural Communication",
      "Presentation",
      "Teamwork",
      "Professional Networking",
    ],
    photos: [
      "/images/journey/malaysia/1.jpg",
      "/images/journey/malaysia/2.jpg",
      "/images/journey/malaysia/3.jpg",
      "/images/journey/malaysia/4.jpg",
      "/images/journey/malaysia/5.jpg",
      "/images/journey/malaysia/6.jpg",
    ],
    videos: ["/images/journey/malaysia/video1.mp4", "/images/journey/malaysia/video2.mp4"],
  },
  {
    id: "kerala",
    track: "National",
    title: "Kerala - IEI National Conference",
    date: "10-11 Jun 2025",
    summary: "National-level paper presentation on water sustainability and reduction strategies.",
    details:
      "Presented \"Water Footprint - Analysis & Reduction Strategies\" at IEI Kerala State Centre. Selected among national entries and published with DOI indexing.",
    skills: [
      "Research Writing",
      "Technical Presentation",
      "Conference Communication",
      "Environmental Engineering",
      "Academic Publishing",
      "Collaboration",
    ],
    photos: [
      "/images/journey/kerala/1.jpg",
      "/images/journey/kerala/2.jpg",
      "/images/journey/kerala/3.jpg",
      "/images/journey/kerala/4.jpg",
      "/images/journey/kerala/5.jpg",
      "/images/journey/kerala/6.jpg",
      "/images/journey/kerala/7.jpg",
      "/images/journey/kerala/8.jpg",
    ],
    videos: [],
  },
  {
    id: "stpi-chennai",
    track: "Industrial Visit",
    title: "STPI Chennai - Department of Data Science Industrial Visit",
    date: "08 Apr 2026",
    summary: "Industrial exposure visit to Software Technology Park of India (STPI), Taramani, Chennai.",
    details:
      "Department of Data Science organized this industrial visit for the 2024 batch at STPI, Taramani, Chennai. The visit covered STPI research initiatives, internship and placement opportunities, data center and networking infrastructure, startup incubation, and government IT-industry support programs. A technical seminar by Mr. Senthil and Mrs. Sangeetha from STPI helped students understand real IT work environments and practical career pathways.",
    skills: [
      "Industry Exposure",
      "Data Center Fundamentals",
      "Networking Infrastructure",
      "Startup Incubation Awareness",
      "Career Planning",
      "Technical Seminar Participation",
    ],
    photos: [
      "/images/journey/stpi/1.jpg",
      "/images/journey/stpi/2.jpg",
      "/images/journey/stpi/3.jpg",
      "/images/journey/stpi/4.jpg",
      "/images/journey/stpi/5.jpg",
    ],
    videos: [],
  },
];

const journeyTrackOrder = ["International", "National", "Industrial Visit"] as const;

const awards = [
  {
    id: "audi-international-collab",
    event: "AUDI DEST 2026",
    title: "International Collaboration Excellence",
    date: "15 Apr 2026",
    description:
      "Awarded for international collaboration excellence during the academic year 2025-2026, recognizing global engagement and academic contribution.",
    photos: ["/images/awards/audi-dest/3.jpg", "/images/awards/audi-dest/4.jpg"],
    videos: ["/images/awards/audi-dest/video1.mp4"],
  },
  {
    id: "audi-student-research",
    event: "AUDI DEST 2026",
    title: "Student Research Achievement",
    date: "15 Apr 2026",
    description:
      "Recognized for student research achievement in the academic year 2025-2026, acknowledging research excellence and innovation for patent-oriented work.",
    photos: ["/images/awards/audi-dest/1.jpg", "/images/awards/audi-dest/2.jpg"],
    videos: [],
  },
];

const publications = [
  {
    title: "System and Method of Portable Electromechanical Braille Display for Visually Impaired Users",
    kind: "patent" as const,
    source: "Patent (Published) | Application No: 202541107021",
    date: "2025",
    description:
      "Developed a portable electromechanical Braille display that converts digital text into tactile Braille output using a low-cost, energy-efficient solenoid-based 2x3 actuator array.",
    link: "#",
  },
  {
    title:
      "A Hybrid Deep Learning Framework for Sentiment Analysis and Pattern Recognition in Social Media: Advanced Neural Architecture with Attention Mechanisms for Enhanced Classification",
    kind: "conference" as const,
    source: "AAIMB 2026 | S.A. Engineering College",
    date: "2026",
    description:
      "Conference presentation by Arrhat Nag and M. Gayathri. The hybrid BiLSTM+CNN+attention model demonstrated strong sentiment classification and pattern-recognition performance on large-scale social data.",
    metrics: ["94.2% Accuracy", "2.2ms Inference", "450/s Throughput", "47.3M Parameters", "+4-6% SOTA Gain"],
    link: "https://www.youtube.com/watch?v=0dUQILDT_Cg",
  },
  {
    title: "Scopus-Indexed Journal Paper (Upcoming)",
    kind: "journal" as const,
    source: "Under Preparation",
    date: "Coming Soon",
    description:
      "Extended manuscript based on the hybrid sentiment-analysis research is being prepared for submission to a Scopus-indexed venue.",
    link: "#",
  },
  {
    title: "Water Footprint - Analysis and Reduction Strategies",
    kind: "journal" as const,
    source: "Zenodo / OpenAIRE Indexed",
    date: "Sep 2025",
    description: "Research work on water-footprint analysis methodologies and reduction strategies, published with DOI indexing.",
    link: "https://doi.org/10.5281/zenodo.17234737",
  },
  {
    title: "Paper Presentation - Blue Planet, Green Future (IEI Kerala)",
    kind: "conference" as const,
    source: "Institution of Engineers (India)",
    date: "Jun 2025",
    description: "National conference presentation at IEI Kerala State Centre on water sustainability and practical reduction strategy frameworks.",
    link: "https://explore.openaire.eu/search/result?pid=10.5281%2Fzenodo.17234737",
  },
  {
    title: "The Great Claude Code Leak: Investigation",
    kind: "article" as const,
    source: "Medium",
    date: "2026",
    link: "https://lnkd.in/gasNVpHh",
  },
];

const leetcodeData = {
  python: {
    totals: { total: 292, hard: 139, medium: 105, easy: 48 },
    hard: [
      "#4 Median of Two Sorted Arrays",
      "#10 Regular Expression Matching",
      "#23 Merge k Sorted Lists",
      "#25 Reverse Nodes in k-Group",
      "#30 Substring with Concatenation of All Words",
      "#32 Longest Valid Parentheses",
      "#37 Sudoku Solver",
      "#41 First Missing Positive",
      "#42 Trapping Rain Water",
      "#44 Wildcard Matching",
      "#52 N-Queens II",
      "#60 Permutation Sequence",
      "#65 Valid Number",
      "#68 Text Justification",
      "#76 Minimum Window Substring",
      "#84 Largest Rectangle in Histogram",
      "#85 Maximal Rectangle",
      "#87 Scramble String",
      "#123 Best Time to Buy and Sell Stock III",
      "#126 Word Ladder II",
      "#127 Word Ladder",
      "#132 Palindrome Partitioning II",
      "#135 Candy",
      "#146 LRU Cache",
      "#149 Max Points on a Line",
      "#174 Dungeon Game",
      "#188 Best Time to Buy and Sell Stock IV",
      "#212 Word Search II",
      "#214 Shortest Palindrome",
      "#218 The Skyline Problem",
      "#224 Basic Calculator",
      "#233 Number of Digit One",
      "#239 Sliding Window Maximum",
      "#282 Expression Add Operators",
      "#295 IPO",
      "#301 Remove Invalid Parentheses",
      "#332 Reconstruct Itinerary",
      "#354 Russian Doll Envelopes",
      "#363 Max Sum of Rectangle No Larger Than K",
      "#381 Insert Delete GetRandom O(1) - Duplicates",
      "#391 Perfect Rectangle",
      "#407 Trapping Rain Water II",
      "#432 All O'one Data Structure",
      "#440 K-th Smallest in Lexicographical Order",
      "#446 Arithmetic Slices II - Subsequence",
      "#458 Poor Pigs",
      "#460 LFU Cache",
      "#466 Count The Repetitions",
      "#493 Reverse Pairs",
      "#552 Student Attendance Record II",
      "#679 24 Game",
      "#753 Cracking the Safe",
      "#770 Basic Calculator IV",
      "#782 Transform to Chessboard",
      "#992 Subarrays with K Different Integers",
      "#996 Number of Squareful Arrays",
      "#1157 Grid Illumination",
      "#1192 Critical Connections in a Network",
      "#1250 Check If It Is a Good Array",
      "#1301 Maximize Number of Nice Divisors",
      "#1453 Closest Prime Numbers in Range",
      "#1569 Number of Ways to Divide a Long Corridor",
      "#1579 Largest Component Size by Common Factor",
      "#1632 Replace Non-Coprime Numbers in Array",
      "#1691 Maximum Number of Events That Can Be Attended II",
      "#1713 Delete Duplicate Folders in System",
      "#1723 GCD Sort of an Array",
      "#1751 Maximum Number of Tasks You Can Assign",
      "#1787 Graph Connectivity With Threshold",
      "#1808 Maximize Score after N Operations",
      "#1916 Count Ways to Build Rooms in an Ant Colony",
      "#1970 Largest Color Value in a Directed Graph",
      "#2014 Longest Subsequence Repeated k Times",
      "#2025 Maximum Fruits Harvested After at Most K Steps",
      "#2029 Kth Smallest Product of Two Sorted Arrays",
      "#2045 Minimum Difference in Sums After Removal of Elements",
      "#2050 Count Ways to Build Rooms in an Ant Colony",
      "#2097 Valid Arrangement of Pairs",
      "#2122 Count Good Triplets in an Array",
      "#2157 Painting a Grid With Three Different Colors",
      "#2197 Sum of k-Mirror Numbers",
      "#2209 Minimum Cost to Change the Final Value of Expression",
      "#2234 Count Array Pairs Divisible by K",
      "#2258 Maximum Candies You Can Get from Boxes",
      "#2272 Count the Number of Ideal Arrays",
      "#2306 Tree of Coprimes",
      "#2386 Minimum Score After Removals on a Tree",
      "#2398 Count Ways to Make Array With Product",
      "#2407 The Earliest and Latest Rounds Where Players Compete",
      "#2444 Count Subarrays With Fixed Bounds",
      "#2448 Count Subarrays With Score Less Than K",
      "#2472 Design a Text Editor",
      "#2551 Count the Number of Powerful Integers",
      "#2577 Meeting Rooms III",
      "#2818 Maximum Product of Subsequences With Alternating Sum Equal to K",
      "#2901 Minimum Pair Removal to Sort Array II",
      "#2999 Fruits into Baskets III",
      "#3001 Find the Minimum Area to Cover All Ones II",
      "#3004 Find the Number of Ways to Place People II",
      "#3007 Find the Original Typed String II",
      "#3008 Find the K-th Character in String Game II",
      "#3010 Count Number of Trapezoids II",
      "#3012 Minimize Stability Factor of Array",
      "#3015 Smallest Divisible Digit Code II",
      "#3016 Find the Count of Monotonic Pairs I",
      "#3017 Count Number of Balanced Permutations",
      "#3018 Length of Longest V-Shaped Diagonal Segment",
      "#3020 Maximize Subarrays After Removing One Conflicting Pair",
      "#3022 Minimum Operations to Make Array Elements Zero",
      "#3025 Check If Digits Are Equal After Operations II",
      "#3030 Final Array After K Multiplication Operations II",
      "#3035 Find Minimum Time to Reach Last Room II",
      "#3040 Maximize the Number of Target Nodes After Connecting Trees II",
      "#3045 Total Characters in String After Transformations II",
      "#3050 The Dining Problem",
    ],
    medium: [
      "#2 Add Two Numbers",
      "#3 Longest Substring Without Repeating Characters",
      "#36 Valid Sudoku",
      "#153 Find Minimum in Rotated Sorted Array",
      "#430 Flatten a Multilevel Doubly Linked List",
      "#498 Diagonal Traverse",
      "#528 Random Pick with Weight",
      "#738 Monotone Increasing Digits",
      "#808 Soup Servings",
      "#837 New 21 Game",
      "#904 Fruit Into Baskets",
      "#1012 Smallest Integer Divisible by K",
      "#1094 Design Browser History",
      "#1432 Max Difference You Can Get From Changing an Integer",
      "#1448 Count Good Numbers",
      "#1679 Count Nice Pairs in an Array",
      "#1797 Design Authentication Manager",
      "#1814 Count the Number of Good Subarrays",
      "#2009 Sort Matrix by Diagonals",
      "#2055 Number of People Aware of a Secret",
      "#2101 Detonate the Maximum Bombs",
      "#2411 Smallest Subarrays With Maximum Bitwise OR",
      "#2416 Number of Subarrays with GCD Equal to K",
      "#2430 Minimize the Maximum Difference of Pairs",
      "#2439 Minimum Operations to Make the Integer Zero",
      "#2512 Longest Subarray With Maximum Bitwise AND",
      "#2523 Partition Array Such that Maximum Difference is K",
      "#2563 Find Minimum Time to Reach Last Room I",
      "#2564 Find the Minimum Area to Cover All Ones I",
      "#2597 The Number of Beautiful Subsets",
      "#2719 Partition Array for Maximum XOR and AND",
      "#2998 Fruits Into Baskets II",
      "#3002 Find the Count of Good Integers",
      "#3003 Find the Number of Ways to Place People I",
      "#3034 Find Minimum Time to Reach Last Room I",
      "#3039 Maximize the Number of Target Nodes After Connecting Trees I",
      "#3044 Total Characters in String After Transformation I",
    ],
    easy: ["#1 Two Sum", "#2900 Minimum Pair Removal to Sort Array I", "#3000 Separate Squares I"],
  },
  cpp: {
    totals: { total: 4, hard: 3, medium: 1, easy: 0 },
    hard: ["Minimum Number of Operations to Make String Sorted", "Count Number of Balanced Permutations", "Find the Number of Ways to Place People II"],
    medium: ["Maximum Product of Two Integers With No Common Bits"],
    easy: [],
  },
};

function parseProblemEntry(entry: string) {
  const matched = entry.match(/^#\s?(\d+)\s+(.+)$/);
  if (!matched) {
    return { title: entry, id: "" };
  }

  return { id: `#${matched[1]}`, title: matched[2] };
}

function toYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (parsed.hostname.includes("youtube.com")) {
      const byQuery = parsed.searchParams.get("v");
      if (byQuery) return `https://www.youtube.com/embed/${byQuery}`;

      const pathParts = parsed.pathname.split("/").filter(Boolean);
      if (pathParts[0] === "shorts" && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`;
      }
    }

    return "";
  } catch {
    return "";
  }
}

function parseGitHubRepo(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("github.com")) return "";
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return "";
    return `${parts[0]}/${parts[1]}`;
  } catch {
    return "";
  }
}

function findFirstYouTubeLink(links: Array<{ label: string; href: string }>) {
  return links.find((link) => toYouTubeEmbedUrl(link.href));
}

function triggerTextScramble(element: HTMLElement) {
  const targetText = element.dataset.scrambleText ?? element.textContent ?? "";
  if (!targetText) return;
  element.dataset.scrambleText = targetText;

  gsap.killTweensOf(element);
  gsap.to({ progress: 0 }, {
    progress: targetText.length + 4,
    duration: 0.8,
    ease: "power2.out",
    onUpdate(self) {
      const progress = Math.floor(self.targets()[0].progress as number);
      const resolved = targetText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < progress) return targetText[index];
          return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
        })
        .join("");
      element.textContent = resolved;
    },
    onComplete() {
      element.textContent = targetText;
    },
  });
}

function ProjectDemoWindow({ title, demoVideo, enableBackdrop }: DemoWindowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pt-2">
      <p className="text-xs uppercase tracking-wider text-white/50">Demo Window</p>
      <div className="relative mt-2 w-full max-w-3xl overflow-hidden border border-white/15 bg-black/60">
        {!shouldReduceMotion && enableBackdrop ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(34,211,238,0.26),transparent_42%),radial-gradient(circle_at_80%_75%,rgba(139,92,246,0.24),transparent_45%)]"
              animate={{ opacity: [0.45, 0.62, 0.45], scale: [1, 1.03, 1] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(56,189,248,0.14)_45%,transparent_70%)]"
              animate={{ x: ["-12%", "12%", "-12%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : null}
        <div className="relative z-10 p-2 md:p-3">
          <iframe
            src={toYouTubeEmbedUrl(demoVideo)}
            title={`${title} demo video`}
            className="aspect-video w-full border border-white/15 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, shouldReduceMotion, inView]);

  return <span ref={ref}>{displayValue}</span>;
}

function TiltPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 170, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 170, damping: 24 });

  const handleMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      style={shouldReduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      className={className}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}

function MagneticLink({ href, children, className, target, rel }: { href: string; children: ReactNode; className: string; target?: string; rel?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20 });
  const springY = useSpring(y, { stiffness: 260, damping: 20 });

  const onMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const deltaX = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
    const deltaY = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
    x.set(deltaX);
    y.set(deltaY);
  };

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

function LowCostBackgroundGlow({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.06, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function App() {
  const appRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const [activeRole, setActiveRole] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [certFilter, setCertFilter] = useState<CertCategory>("all");
  const [publicationType, setPublicationType] = useState<"all" | PublicationType>("all");
  const [activeJourney, setActiveJourney] = useState("malaysia");
  const [activeAward, setActiveAward] = useState("audi-international-collab");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [lcLang, setLcLang] = useState<LeetLang>("python");
  const [openDifficulty, setOpenDifficulty] = useState<Record<Level, boolean>>({ hard: false, medium: false, easy: false });
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [openCerts, setOpenCerts] = useState<Record<string, boolean>>({});
  const [openExperience, setOpenExperience] = useState<Record<string, boolean>>({
    hackathon: false,
    leadership: false,
    internship: false,
  });
  const [cursorState, setCursorState] = useState({ x: 0, y: 0, active: false, pressed: false });
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const enableHeavyFx = !shouldReduceMotion && !isLowPerformance;

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = "deviceMemory" in navigator ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) || 4 : 4;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const detect = () => {
      const slowNetwork = Boolean(connection?.saveData) || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
      const low = media.matches || window.innerWidth < 1280 || cores <= 6 || memory <= 8 || slowNetwork;
      setIsLowPerformance(low);
    };

    detect();
    window.addEventListener("resize", detect);
    media.addEventListener("change", detect);
    return () => {
      window.removeEventListener("resize", detect);
      media.removeEventListener("change", detect);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("perf-lite", isLowPerformance);
    return () => {
      document.body.classList.remove("perf-lite");
    };
  }, [isLowPerformance]);

  const ambientDensity = isLowPerformance ? 0.45 : 0.78;

  const ambientParticles = useMemo<AmbientParticle[]>(
    () =>
      Array.from({ length: Math.max(8, Math.floor(24 * ambientDensity)) }, (_, index) => ({
        id: index,
        size: 2 + (index % 4),
        left: (index * 19) % 100,
        top: (index * 37) % 100,
        duration: 5 + (index % 7),
        delay: (index % 5) * 0.6,
      })),
    [ambientDensity],
  );

  const yParallax = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : -70]);
  const gridOpacity = useTransform(scrollY, [0, 500], [0.35, 0.12]);
  const heroScale = useTransform(scrollY, [0, 460], [1, shouldReduceMotion ? 1 : 0.94]);
  const heroOpacity = useTransform(scrollY, [0, 420], [1, shouldReduceMotion ? 1 : 0.45]);

  const filteredCerts = useMemo(
    () => (certFilter === "all" ? certifications : certifications.filter((item) => item.category === certFilter)),
    [certFilter],
  );

  const filteredPublications = useMemo(
    () => (publicationType === "all" ? publications : publications.filter((item) => item.kind === publicationType)),
    [publicationType],
  );

  const featuredProjectTitles = useMemo(
    () => [
      "GENESIS: GPU-Accelerated Planetary Evolution & Ecosystem Simulator",
      "Vector Forth Kernel",
      "Custom TinyLlama CUDA Inference Runtime",
      "GPU-Powered Real Time Universe Simulation",
    ],
    [],
  );

  const topProjects = useMemo(
    () => projects.filter((project) => featuredProjectTitles.includes(project.title)),
    [featuredProjectTitles],
  );

  const dropdownProjects = useMemo(
    () => projects.filter((project) => !featuredProjectTitles.includes(project.title)),
    [featuredProjectTitles],
  );

  const activeJourneyEntry = journeyEvents.find((event) => event.id === activeJourney) ?? journeyEvents[0];
  const activeAwardEntry = awards.find((award) => award.id === activeAward) ?? awards[0];
  const groupedJourneyEvents = useMemo(
    () =>
      journeyTrackOrder.map((track) => ({
        track,
        events: journeyEvents.filter((event) => event.track === track),
      })),
    [],
  );

  const totals = leetcodeData[lcLang].totals;
  const percentages = {
    hard: totals.total ? (totals.hard / totals.total) * 100 : 0,
    medium: totals.total ? (totals.medium / totals.total) * 100 : 0,
    easy: totals.total ? (totals.easy / totals.total) * 100 : 0,
  };
  const currentYear = new Date().getFullYear();
  const selectedImpact = useMemo(
    () => [
      { value: "Top 10/93", label: "GenAI Zurich" },
      { value: "1", label: "Published Patent Application" },
      { value: String(projects.length), label: "Projects Shipped" },
      { value: String(leetcodeData.python.totals.total), label: "LeetCode Solved" },
      { value: String(publications.length), label: "Publications" },
    ],
    [],
  );

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = window.setInterval(() => setActiveRole((value) => (value + 1) % roles.length), 2200);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), shouldReduceMotion ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || isLowPerformance) return;
    const handleMove = (event: MouseEvent) => setMouse({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [shouldReduceMotion, isLowPerformance]);

  useEffect(() => {
    if (shouldReduceMotion || isLowPerformance) return;

    const onMove = (event: PointerEvent) => {
      setCursorState((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
    };
    const onDown = () => setCursorState((prev) => ({ ...prev, pressed: true }));
    const onUp = () => setCursorState((prev) => ({ ...prev, pressed: false }));

    const interactiveNodes = Array.from(document.querySelectorAll<HTMLElement>("a, button, [role='button']"));
    const activate = () => setCursorState((prev) => ({ ...prev, active: true }));
    const deactivate = () => setCursorState((prev) => ({ ...prev, active: false }));

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    interactiveNodes.forEach((node) => {
      node.addEventListener("mouseenter", activate);
      node.addEventListener("mouseleave", deactivate);
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      interactiveNodes.forEach((node) => {
        node.removeEventListener("mouseenter", activate);
        node.removeEventListener("mouseleave", deactivate);
      });
    };
  }, [shouldReduceMotion, isLowPerformance]);

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        setActiveSection(visible[0].target.id as SectionId);
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [activeSection]);

  useEffect(() => {
    setOpenCerts({});
  }, [certFilter]);

  useEffect(() => {
    if (!selectedMedia) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMedia(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedMedia]);

  useEffect(() => {
    // Keep all difficulty dropdowns collapsed until user explicitly opens one.
    setOpenDifficulty({ hard: false, medium: false, easy: false });
  }, [lcLang]);

  useEffect(() => {
    if (shouldReduceMotion || isLowPerformance) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [shouldReduceMotion, isLowPerformance]);

  useEffect(() => {
    if (shouldReduceMotion || isLowPerformance || !appRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const splitTargets = Splitting({ target: ".section-title[data-split='true']", by: "chars" });
      splitTargets.forEach((result) => {
        if (!result.el || !result.chars?.length) return;
        gsap.set(result.chars, { opacity: 0, y: 18 });
        ScrollTrigger.create({
          trigger: result.el,
          start: "top 82%",
          once: true,
          onEnter: () => {
            triggerTextScramble(result.el);
            gsap.to(result.chars ?? [], {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
              stagger: 0.014,
              delay: 0.08,
            });
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("main section[id]").forEach((section) => {
        const heading = section.querySelector("h2");

        if (heading) {
          gsap.fromTo(
            heading,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true,
              },
            },
          );
        }

        const revealTargets = Array.from(section.querySelectorAll("article, .reveal-block")).slice(0, 8);
        if (revealTargets.length) {
          gsap.fromTo(
            revealTargets,
            { y: 38, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: section,
                start: "top 72%",
                once: true,
              },
            },
          );
        }
      });

      gsap.fromTo(
        ".hero-orb",
        { yPercent: 0, rotate: 0 },
        {
          yPercent: -16,
          rotate: 6,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        ".tech-tape",
        { xPercent: 0 },
        {
          xPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: ".tech-tape-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        "#home .hero-copy",
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -18,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      ScrollTrigger.create({
        trigger: ".tech-tape-wrap",
        start: "top top",
        end: "+=180",
        pin: true,
        pinSpacing: false,
        scrub: true,
      });

      // Avoid pinned columns here because they can cause overlap/clipping on some viewports.

      gsap.utils.toArray<HTMLElement>("#projects article").forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0.25 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 45%",
              scrub: 0.8,
            },
            delay: Math.min(index * 0.02, 0.12),
          },
        );
      });

      gsap.fromTo(
        "#leetcode",
        { backgroundColor: "rgba(255,255,255,0.02)" },
        {
          backgroundColor: "rgba(34,211,238,0.06)",
          ease: "none",
          scrollTrigger: {
            trigger: "#leetcode",
            start: "top 70%",
            end: "bottom 20%",
            scrub: 1,
          },
        },
      );
    }, appRef);

    return () => ctx.revert();
  }, [shouldReduceMotion, isLowPerformance]);

  return (
    <motion.div
      ref={appRef}
      className="min-h-screen bg-[#060816] text-white selection:bg-cyan-300/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <AnimatePresence>
        {showIntro && (
          <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-[#060816]" exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="text-center">
              <p className="text-xs uppercase tracking-[0.45em] text-cyan-200">Loading Experience</p>
                <p className="mt-2 text-2xl font-semibold">ARRHAT NAG</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500"
        style={{ scaleX: scrollYProgress }}
      />

      {enableHeavyFx && <LowCostBackgroundGlow className="pointer-events-none fixed inset-0 z-[0] bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.14),transparent_38%),radial-gradient(circle_at_78%_72%,rgba(139,92,246,0.14),transparent_42%)]" />}

      {enableHeavyFx && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-10 hidden h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl lg:block"
          animate={{ x: mouse.x - 130, y: mouse.y - 130 }}
          transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.5 }}
        />
      )}

      {enableHeavyFx && (
        <>
          <motion.div
            aria-hidden
            className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] hidden h-2.5 w-2.5 rounded-full bg-cyan-200 lg:block"
            animate={{
              x: cursorState.x - 5,
              y: cursorState.y - 5,
              scale: cursorState.pressed ? 0.72 : 1,
            }}
            transition={{ type: "spring", stiffness: 520, damping: 32, mass: 0.24 }}
          />
          <motion.div
            aria-hidden
            className="cursor-ring pointer-events-none fixed left-0 top-0 z-[69] hidden h-10 w-10 rounded-full border border-cyan-200/65 lg:block"
            animate={{
              x: cursorState.x - 20,
              y: cursorState.y - 20,
              scale: cursorState.active ? 1.45 : 1,
              opacity: cursorState.active ? 0.95 : 0.6,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.6 }}
          />
        </>
      )}

      <div aria-hidden className="aurora-bg pointer-events-none fixed inset-0 z-[1]" />
      <div aria-hidden className="beam-layer pointer-events-none fixed inset-0 z-[2]" />
      <div aria-hidden className="noise-overlay pointer-events-none fixed inset-0 z-[2]" />

      {enableHeavyFx && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
          {ambientParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full bg-cyan-200/40"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{ y: [0, -18, 0], opacity: [0.15, 0.75, 0.15] }}
              transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
            />
          ))}
        </div>
      )}

      <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-[#060816]/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <a href="#home" className="text-sm font-semibold tracking-[0.16em] text-cyan-200 md:text-base">
            SAMUDRAGUPTO
          </a>

          <div className="hidden items-center gap-2 text-xs uppercase tracking-wider md:flex">
            {navItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-md px-2.5 py-1.5 transition ${activeSection === item.id ? "text-cyan-100" : "text-white/70 hover:text-white"}`}
              >
                {activeSection === item.id ? <motion.span layoutId="nav-active-pill" className="absolute inset-0 -z-10 rounded-md border border-cyan-300/45 bg-cyan-300/10" /> : null}
                {item.label}
              </motion.a>
            ))}
          </div>

          <button className="inline-flex h-10 w-10 items-center justify-center border border-white/20 md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)} aria-label="Toggle navigation">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/10 bg-[#060816]/95 px-6 py-4 md:hidden">
              <div className="flex flex-col gap-3 text-xs uppercase tracking-wider">
                {navItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-md border px-3 py-2 transition ${activeSection === item.id ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100" : "border-white/10 text-white/75 hover:border-white/25 hover:text-white"}`}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <div className="relative flex flex-col items-end gap-3">
          {navItems.map((item) => (
            <motion.a key={item.id} href={`#${item.id}`} whileHover={{ x: -2 }} className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45 transition hover:text-cyan-200">
              <span className={`transition ${activeSection === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{item.label}</span>
              <span className={`h-2.5 w-2.5 rounded-full border ${activeSection === item.id ? "border-cyan-300 bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.7)]" : "border-white/30 bg-transparent"}`} />
            </motion.a>
          ))}
        </div>
      </div>

      <main className="relative z-[3]">
        <section id="home" className="immersive-section relative flex min-h-screen items-center overflow-hidden pt-16">
          <motion.div aria-hidden className="absolute inset-0" style={{ opacity: gridOpacity }}>
            <div className="hero-grid absolute inset-0" />
            <div className="scan-lines absolute inset-0" />
            <motion.div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" animate={{ y: shouldReduceMotion ? 0 : [0, 24, -16, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" animate={{ y: shouldReduceMotion ? 0 : [0, -24, 16, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
          </motion.div>

          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-copy space-y-7">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
                  Arrhat Nag
                  <span className="block text-2xl tracking-[0.18em] text-white/60 md:text-3xl">Samudragupto</span>
                </h1>
                <div className="min-h-[3.5rem] text-base text-cyan-200 md:min-h-[2.5rem] md:text-2xl">
                  <AnimatePresence mode="wait">
                    <motion.span key={roles[activeRole]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      {roles[activeRole]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                Systems programmer focused on CUDA, AI infrastructure, and low-level security. I build performance-first software from firmware and kernels to GPU runtimes and production-ready AI systems.
              </p>

              <div className="max-w-2xl border border-white/15 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">One-minute profile</p>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  {oneMinuteProfile.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

                <div className="flex flex-wrap items-center gap-4">
                <MagneticLink href="#projects" className="inline-flex items-center gap-2 border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-medium tracking-wide text-cyan-100 transition hover:bg-cyan-300/20">
                  Explore Work
                  <ArrowUpRight className="h-4 w-4" />
                </MagneticLink>
                 <MagneticLink href="/assets/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm font-medium tracking-wide text-white/85 transition hover:border-cyan-300/40 hover:text-cyan-100">
                   Resume / CV
                   <ArrowUpRight className="h-4 w-4" />
                 </MagneticLink>
                 <MagneticLink href="mailto:arrhat@arrhat.com" className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm font-medium tracking-wide text-white/85 transition hover:border-cyan-300/40 hover:text-cyan-100">
                   Contact / Hire Me
                   <ArrowUpRight className="h-4 w-4" />
                 </MagneticLink>
                <MagneticLink href="https://github.com/samudragupto" target="_blank" rel="noreferrer" className="px-4 py-2 text-sm text-white/75 hover:text-white">
                  GitHub
                </MagneticLink>
                <MagneticLink href="https://www.linkedin.com/in/arrhatnag/" target="_blank" rel="noreferrer" className="px-4 py-2 text-sm text-white/75 hover:text-white">
                  LinkedIn
                </MagneticLink>
                 <MagneticLink href="https://leetcode.com/u/Arrhat/" target="_blank" rel="noreferrer" className="px-4 py-2 text-sm text-white/75 hover:text-white">
                   LeetCode
                 </MagneticLink>
                 <MagneticLink href="https://www.youtube.com/@arrhat" target="_blank" rel="noreferrer" className="px-4 py-2 text-sm text-white/75 hover:text-white">
                   YouTube
                 </MagneticLink>
                 <MagneticLink href="https://medium.com/@arrhatnag1" target="_blank" rel="noreferrer" className="px-4 py-2 text-sm text-white/75 hover:text-white">
                   Medium
                 </MagneticLink>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {selectedImpact.map((item) => (
                  <div key={item.label} className="border border-white/15 bg-white/[0.02] px-3 py-3">
                    <p className="text-lg font-semibold text-cyan-100">{item.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div style={{ y: yParallax }} className="hero-orb relative">
              <div className="relative mx-auto aspect-square w-full max-w-sm border border-white/15 bg-white/[0.03]">
                <div className="absolute inset-6 border border-white/10" />
                <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(34,211,238,0.25),transparent_48%),radial-gradient(circle_at_70%_68%,rgba(139,92,246,0.25),transparent_48%)]" animate={{ rotate: shouldReduceMotion ? 0 : 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }} />
                <div className="absolute inset-0 grid place-content-center text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Available For</p>
                  <p className="mt-2 text-2xl font-semibold text-cyan-100">Internships</p>
                  <p className="mt-3 text-sm text-white/60">Systems | CUDA | AI Infra</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/65" animate={{ y: shouldReduceMotion ? 0 : [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="h-6 w-6" />
          </motion.a>
        </section>

        <section className="tech-tape-wrap relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
          <motion.div
            className="tech-tape flex min-w-max gap-8 px-6"
            animate={{ x: shouldReduceMotion ? 0 : ["0%", "-50%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {[...techTape, ...techTape, ...techTape].map((item, index) => (
              <span key={`${item}-${index}`} className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                {item}
              </span>
            ))}
          </motion.div>
        </section>

        <section id="about" className="immersive-section mx-auto w-full max-w-6xl px-6 py-24">
          <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            About
          </motion.h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">
            Core profile: systems programming, CUDA acceleration, AI infrastructure, and low-level security engineering.
          </p>

          <div className="mt-10 space-y-10">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-xl font-medium">Technical Skills: Languages</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                 {technicalSkills.languages.map((skill, index) => (
                   <motion.span key={skill} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25, delay: index * 0.015 }} whileHover={{ y: -3 }} className="border border-white/10 px-3 py-1 text-xs text-white/75">
                    {skill}
                   </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-xl font-medium">Technical Skills: Frameworks & Libraries</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                 {technicalSkills.frameworks.map((skill, index) => (
                   <motion.span key={skill} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25, delay: index * 0.01 }} whileHover={{ y: -3 }} className="border border-white/10 px-3 py-1 text-xs text-white/75">
                    {skill}
                   </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-xl font-medium">Technical Skills: Developer Tools</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                 {technicalSkills.tools.map((skill, index) => (
                   <motion.span key={skill} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25, delay: index * 0.015 }} whileHover={{ y: -3 }} className="border border-white/10 px-3 py-1 text-xs text-white/75">
                    {skill}
                   </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-xl font-medium">Technical Skills: Technologies & Domains</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                 {technicalSkills.domains.map((skill, index) => (
                   <motion.span key={skill} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25, delay: index * 0.015 }} whileHover={{ y: -3 }} className="border border-white/10 px-3 py-1 text-xs text-white/75">
                    {skill}
                   </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="featured" className="immersive-section mx-auto w-full max-w-6xl px-6 pb-24">
          <motion.h2 data-split="true" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            Featured
          </motion.h2>
          <div className="mt-10 space-y-8">
             {pinnedItems.map((item) => (
               <TiltPanel key={item.title} className="origin-center">
                 <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: 0.35 }} className="border-l border-cyan-300/60 pl-5">
                   <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-200/80">
                     <Pin className="h-3.5 w-3.5" />
                     Featured Achievement
                   </p>
                    <p className="mt-2 text-xs uppercase tracking-wider text-white/60">{item.period}</p>
                    <h3 className="mt-3 text-xl font-medium text-white/90">{item.title}</h3>
                   <p className="mt-2 text-sm text-white/70">{item.summary}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
                      {item.details.map((point) => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                   <div className="mt-4 flex flex-wrap gap-3">
                     {item.links.map((linkItem) => (
                       <a key={linkItem.label} href={linkItem.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
                         {linkItem.label}
                         <ArrowUpRight className="h-4 w-4" />
                       </a>
                     ))}
                   </div>
                    {findFirstYouTubeLink(item.links) ? (
                      <div className="mt-5 w-full max-w-3xl border border-white/15 bg-black/50 p-2">
                        <iframe
                          src={toYouTubeEmbedUrl(findFirstYouTubeLink(item.links)!.href)}
                          title={`${item.title} featured video`}
                          className="aspect-video w-full border border-white/10 bg-black"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    ) : null}
                 </motion.article>
               </TiltPanel>
             ))}
          </div>
        </section>

        <section id="experience" className="immersive-section mx-auto w-full max-w-6xl px-6 pb-24">
          <motion.h2 data-split="true" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            Experience / Roles
          </motion.h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {experienceSections.map((section, index) => (
              <motion.article
                key={section.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.06 }}
                className="border border-white/15 bg-white/[0.02]"
              >
                <button
                  onClick={() => setOpenExperience((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Track</p>
                    <h3 className="mt-2 text-xl font-medium text-white/95">{section.title}</h3>
                  </div>
                  {openExperience[section.key] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <AnimatePresence>
                  {openExperience[section.key] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-t border-white/10 px-5 pb-5"
                    >
                      {section.entries.length === 0 ? (
                        <p className="pt-4 text-sm text-white/55">No internship entries added yet.</p>
                      ) : (
                        <div className="space-y-5 pt-4">
                          {section.entries.map((entry) => (
                            <div key={`${section.key}-${entry.role}`} className="space-y-2">
                              <p className="text-sm text-cyan-200/80">{entry.period}</p>
                              <h4 className="text-base font-semibold text-white/90">{entry.role}</h4>
                              <p className="text-sm text-white/70">{entry.org}</p>
                              <p className="text-xs uppercase tracking-wider text-white/50">{entry.location}</p>
                              <ul className="space-y-1 pt-1 text-sm text-white/65">
                                {entry.details.map((point) => (
                                  <li key={point}>- {point}</li>
                                ))}
                              </ul>
                              {entry.links.length > 0 ? (
                                <div className="flex flex-wrap gap-3 pt-2">
                                  {entry.links.map((link) => (
                                    <a
                                      key={link.label}
                                      href={link.href}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-cyan-200 hover:text-cyan-100"
                                    >
                                      {link.label}
                                      <ArrowUpRight className="h-3.5 w-3.5" />
                                    </a>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="projects" className="immersive-section border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto w-full max-w-6xl space-y-12 px-6 py-24">
            <div className="space-y-10">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold leading-[1.08] md:text-5xl">
                Projects
              </motion.h2>
              <p className="mt-2 max-w-2xl text-sm text-white/60">Core builds and applied systems projects.</p>

              <div className="space-y-10">
              {topProjects.map((project, index) => (
                <TiltPanel key={project.title} className="origin-center">
                  <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: index * 0.03 }} className="grid gap-5 border-t border-white/10 pt-8 md:grid-cols-[1.2fr_1fr] md:items-start">
                    <div className="space-y-3">
                      <p className="text-sm text-cyan-200/70">{project.period}</p>
                      <h3 className="text-2xl font-semibold">{project.title}</h3>
                      {topProjectRoleContribution[project.title] ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                            {topProjectRoleContribution[project.title].role}
                          </span>
                          <span className="border border-white/20 bg-white/[0.03] px-3 py-1 text-xs text-white/80">
                            {topProjectRoleContribution[project.title].contribution}
                          </span>
                        </div>
                      ) : null}
                      {project.evidence ? (
                        <div className="max-w-2xl space-y-4 text-sm text-white/75">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/85">Problem</p>
                            <p className="mt-1 leading-relaxed">{project.evidence.problem}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/85">Technical approach</p>
                            <ul className="mt-2 space-y-2 text-white/65">
                              {project.evidence.approach.map((point) => (
                                <li key={point} className="leading-relaxed">- {point}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/85">Measurable result</p>
                            <p className="mt-1 leading-relaxed text-white/70">{project.evidence.result}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="max-w-2xl text-white/70">{project.summary}</p>
                          <ul className="max-w-2xl space-y-2 pt-1 text-sm text-white/65">
                            {project.highlights.map((point) => (
                              <li key={point} className="leading-relaxed">- {point}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {projectArtifacts[project.title]?.length ? (
                        <div className="pt-2">
                          <p className="text-xs uppercase tracking-wider text-white/50">Project Media</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {projectArtifacts[project.title].map((artifact) => (
                              <span key={artifact} className="border border-cyan-300/30 bg-cyan-300/5 px-2 py-1 text-[11px] uppercase tracking-wide text-cyan-100/85">
                                {artifact}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {project.demoVideo ? <ProjectDemoWindow title={project.title} demoVideo={project.demoVideo} enableBackdrop={enableHeavyFx} /> : null}
                      {parseGitHubRepo(project.link) ? (
                        <div className="pt-2">
                          <p className="text-xs uppercase tracking-wider text-white/50">GitHub Preview</p>
                          <div className="mt-2 inline-flex min-w-[220px] items-center justify-between border border-white/15 bg-white/[0.02] px-3 py-2 text-xs text-white/75">
                            <span className="uppercase tracking-wider text-cyan-200/80">repo</span>
                            <span className="font-mono text-[11px] text-white/80">{parseGitHubRepo(project.link)}</span>
                          </div>
                        </div>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
                          GitHub
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                        {project.demoVideo ? (
                          <a href={project.demoVideo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
                            Demo video
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {project.skills.map((skill) => (
                        <motion.span key={skill} whileHover={{ y: -1 }} className="border border-white/10 px-3 py-1 text-xs text-white/70">
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.article>
                </TiltPanel>
              ))}

              <div className="border-t border-white/10 pt-8">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllProjects((prev) => !prev)}
                  className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-white/80 transition hover:border-cyan-300 hover:text-cyan-100"
                >
                  {showAllProjects ? "Hide more projects" : `Show more projects (${dropdownProjects.length})`}
                  {showAllProjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </motion.button>

                <AnimatePresence>
                  {showAllProjects && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-8 space-y-10">
                        {dropdownProjects.map((project, index) => (
                          <TiltPanel key={project.title} className="origin-center">
                            <motion.article
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              whileHover={{ y: -2 }}
                              transition={{ duration: 0.3, delay: index * 0.03 }}
                              className="grid gap-5 border-t border-white/10 pt-8 md:grid-cols-[1.2fr_1fr] md:items-start"
                            >
                              <div className="space-y-3">
                                <p className="text-sm text-cyan-200/70">{project.period}</p>
                                <h3 className="text-2xl font-semibold">{project.title}</h3>
                                <p className="max-w-2xl text-white/70">{project.summary}</p>
                                <ul className="max-w-2xl space-y-2 pt-1 text-sm text-white/65">
                                  {project.highlights.map((point) => (
                                    <li key={point} className="leading-relaxed">- {point}</li>
                                  ))}
                                </ul>
                                {projectArtifacts[project.title]?.length ? (
                                  <div className="pt-2">
                                    <p className="text-xs uppercase tracking-wider text-white/50">Project Media</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {projectArtifacts[project.title].map((artifact) => (
                                        <span key={artifact} className="border border-cyan-300/30 bg-cyan-300/5 px-2 py-1 text-[11px] uppercase tracking-wide text-cyan-100/85">
                                          {artifact}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                                {project.demoVideo ? <ProjectDemoWindow title={project.title} demoVideo={project.demoVideo} enableBackdrop={enableHeavyFx} /> : null}
                                {parseGitHubRepo(project.link) ? (
                                  <div className="pt-2">
                                    <p className="text-xs uppercase tracking-wider text-white/50">GitHub Preview</p>
                                    <div className="mt-2 inline-flex min-w-[220px] items-center justify-between border border-white/15 bg-white/[0.02] px-3 py-2 text-xs text-white/75">
                                      <span className="uppercase tracking-wider text-cyan-200/80">repo</span>
                                      <span className="font-mono text-[11px] text-white/80">{parseGitHubRepo(project.link)}</span>
                                    </div>
                                  </div>
                                ) : null}
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                  <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
                                    View link
                                    <ArrowUpRight className="h-4 w-4" />
                                  </a>
                                  {project.demoVideo ? (
                                    <a href={project.demoVideo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
                                      Demo video
                                      <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 md:justify-end">
                                {project.skills.map((skill) => (
                                  <motion.span key={skill} whileHover={{ y: -1 }} className="border border-white/10 px-3 py-1 text-xs text-white/70">
                                    {skill}
                                  </motion.span>
                                ))}
                              </div>
                            </motion.article>
                          </TiltPanel>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section id="education" className="immersive-section mx-auto w-full max-w-6xl px-6 py-24">
          <motion.h2 data-split="true" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            Education
          </motion.h2>

          <div className="mt-10 space-y-8">
            {education.map((item, index) => (
              <motion.article
                key={item.institute}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="grid gap-4 border-l border-white/15 pl-5 sm:grid-cols-[72px_1fr] sm:items-center"
              >
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden border border-white/15 bg-white/[0.03] text-xs font-semibold tracking-wider text-cyan-100/80">
                  <span>{item.short}</span>
                  <img
                    src={item.logo}
                    alt={`${item.institute} logo`}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white/90">{item.institute}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.degree}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-cyan-200/70">{item.period}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="certifications" className="immersive-section mx-auto w-full max-w-6xl px-6 py-24">
          <motion.h2 data-split="true" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            Licenses & Certifications
          </motion.h2>

          <div className="mt-8 flex flex-wrap gap-2">
            {(["all", "ibm", "upskillist", "cognitive"] as const).map((filter) => (
              <button key={filter} onClick={() => setCertFilter(filter)} className={`border px-4 py-2 text-xs uppercase tracking-wider transition ${certFilter === filter ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-white/15 text-white/65 hover:text-white"}`}>
                {filter}
              </button>
            ))}
          </div>

          <motion.div layout className="mt-8 space-y-4">
            <AnimatePresence>
              {filteredCerts.map((cert) => {
                const certKey = `${cert.title}-${cert.credentialId}`;
                const isOpen = Boolean(openCerts[certKey]);

                return (
                  <motion.div layout key={certKey} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-l border-white/15 pl-5">
                    <button
                      type="button"
                      onClick={() => setOpenCerts((prev) => ({ ...prev, [certKey]: !prev[certKey] }))}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wider text-cyan-200/70">{cert.date}</p>
                        <h3 className="mt-1 text-lg text-white/90">{cert.title}</h3>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
                    </button>

                    <AnimatePresence>
                      {isOpen ? (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="pt-3 text-sm text-white/60">
                            <p>{cert.issuer}</p>
                            <p className="mt-1 text-xs text-white/55">Credential ID: {cert.credentialId}</p>
                            {cert.expiry ? <p className="text-xs text-white/55">Expires: {cert.expiry}</p> : null}
                            <a href={cert.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-cyan-200 hover:text-cyan-100">
                              Show credential
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="journey" className="immersive-section border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <motion.h2 data-split="true" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
              Life Journey
            </motion.h2>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div className="journey-timeline-col space-y-8">
                {groupedJourneyEvents.map((group, groupIndex) => (
                  <div key={group.track} className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">{group.track}</p>
                    <div className="space-y-4">
                      {group.events.map((event, eventIndex) => (
                        <motion.button
                          key={event.id}
                          onClick={() => setActiveJourney(event.id)}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: groupIndex * 0.08 + eventIndex * 0.06 }}
                          className={`w-full border-l pl-5 text-left transition ${activeJourney === event.id ? "border-cyan-300" : "border-white/20"}`}
                        >
                          <p className="text-xs uppercase tracking-wider text-cyan-200/70">{event.date}</p>
                          <div className="mt-1 flex items-center justify-between gap-4">
                            <h3 className="text-xl font-medium">{event.title}</h3>
                            {activeJourney === event.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                          <p className="mt-2 text-sm text-white/70">{event.summary}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <motion.div key={activeJourneyEntry.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="journey-detail-col space-y-6">
                <p className="text-sm leading-relaxed text-white/65">{activeJourneyEntry.details}</p>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-200/80">Skills Gained</p>
                  <div className="flex flex-wrap gap-2">
                    {activeJourneyEntry.skills.map((skill) => (
                      <motion.span key={skill} whileHover={{ y: -2 }} className="border border-white/10 px-3 py-1 text-xs text-white/70">
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-200/80">Photos ({activeJourneyEntry.photos.length})</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activeJourneyEntry.photos.map((photo, imageIndex) => (
                      <motion.button
                        key={photo}
                        onClick={() => setSelectedMedia({ type: "image", src: photo })}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: imageIndex * 0.04 }}
                        className="group relative aspect-[4/3] overflow-hidden border border-white/15"
                      >
                        <img src={photo} alt={`${activeJourneyEntry.title} photo ${imageIndex + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                        <span className="absolute inset-0 bg-gradient-to-t from-[#060816]/60 to-transparent" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {activeJourneyEntry.videos.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-200/80">Videos ({activeJourneyEntry.videos.length})</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {activeJourneyEntry.videos.map((video) => (
                        <button key={video} onClick={() => setSelectedMedia({ type: "video", src: video })} className="group relative aspect-video overflow-hidden border border-white/15 text-left">
                          <video src={video} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" muted playsInline />
                          <span className="absolute inset-0 bg-gradient-to-t from-[#060816]/60 to-transparent" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="awards" className="immersive-section relative mx-auto w-full max-w-6xl px-6 py-24">
          <motion.div
            aria-hidden
            initial={{ opacity: 0.2, scale: 0.92 }}
            whileInView={{ opacity: 0.5, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute -right-16 top-10 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl"
          />
          <motion.h2 data-split="true" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            Awards
          </motion.h2>
          <p className="mt-3 text-sm uppercase tracking-[0.28em] text-cyan-200/70">AUDI DEST 2026</p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.1fr]"
          >
            <div className="space-y-4">
              {awards.map((award, index) => (
                <motion.button
                  key={award.id}
                  type="button"
                  onClick={() => setActiveAward(award.id)}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  transition={{ delay: index * 0.06 }}
                  className={`w-full border-l pl-5 text-left transition ${activeAward === award.id ? "border-cyan-300" : "border-white/20"}`}
                >
                  <p className="text-xs uppercase tracking-wider text-cyan-200/70">{award.date}</p>
                  <h3 className="mt-1 text-xl font-medium">{award.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{award.description}</p>
                </motion.button>
              ))}
            </div>

            <motion.div key={activeAwardEntry.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="space-y-5">
              <p className="text-sm leading-relaxed text-white/70">{activeAwardEntry.description}</p>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-200/80">Photos ({activeAwardEntry.photos.length})</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {activeAwardEntry.photos.map((photo, index) => (
                    <motion.button
                      key={photo}
                      onClick={() => setSelectedMedia({ type: "image", src: photo })}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -4 }}
                      className="group relative aspect-[4/3] overflow-hidden border border-white/15"
                    >
                      <img src={photo} alt={`${activeAwardEntry.title} photo ${index + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#060816]/55 to-transparent" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {activeAwardEntry.videos.length > 0 ? (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-200/80">Videos ({activeAwardEntry.videos.length})</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeAwardEntry.videos.map((video) => (
                      <motion.button whileHover={{ y: -4 }} key={video} onClick={() => setSelectedMedia({ type: "video", src: video })} className="group relative aspect-video overflow-hidden border border-white/15 text-left">
                        <video src={video} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" muted playsInline />
                        <span className="absolute inset-0 bg-gradient-to-t from-[#060816]/60 to-transparent" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        </section>

        <section id="publications" className="immersive-section mx-auto w-full max-w-6xl px-6 py-24">
          <motion.h2 data-split="true" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            Publications
          </motion.h2>

          <div className="mt-8 flex flex-wrap gap-2">
            {(["all", "patent", "journal", "conference", "article"] as const).map((kind) => (
              <button key={kind} onClick={() => setPublicationType(kind)} className={`border px-4 py-2 text-xs uppercase tracking-wider transition ${publicationType === kind ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-white/15 text-white/65 hover:text-white"}`}>
                {kind === "patent" ? "patents" : kind}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-6">
            {filteredPublications.map((item) => (
              <motion.a key={item.title} href={item.link} target={item.link === "#" ? undefined : "_blank"} rel={item.link === "#" ? undefined : "noreferrer"} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="block border-l border-white/15 pl-5">
                <p className="text-xs uppercase tracking-wider text-cyan-200/70">
                  {item.kind} | {item.source} | {item.date}
                </p>
                <h3 className="mt-2 text-xl text-white/90">{item.title}</h3>
                {"description" in item && item.description ? <p className="mt-2 max-w-3xl text-sm text-white/65">{item.description}</p> : null}
                {"metrics" in item && Array.isArray(item.metrics) ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.metrics.map((metric) => (
                      <span key={metric} className="border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                        {metric}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.a>
            ))}
          </div>
        </section>

        <section id="leetcode" className="immersive-section border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <motion.h2 data-split="true" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
              Problem Solving - LeetCode
            </motion.h2>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href="https://leetcode.com/u/Arrhat/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-white/75 transition hover:border-cyan-300/40 hover:text-cyan-100">
                LeetCode Profile
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="https://github.com/samudragupto/LeetCode" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-white/75 transition hover:border-cyan-300/40 hover:text-cyan-100">
                Python Solutions Repo
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="https://github.com/samudragupto/LeetCode-C-" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-white/75 transition hover:border-cyan-300/40 hover:text-cyan-100">
                C++ Solutions Repo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex gap-2">
              {(["python", "cpp"] as const).map((lang) => (
                <button key={lang} onClick={() => setLcLang(lang)} className={`border px-4 py-2 text-xs uppercase tracking-wider transition ${lcLang === lang ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-white/15 text-white/65"}`}>
                  {lang}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total", totals.total],
                ["Hard", totals.hard],
                ["Medium", totals.medium],
                ["Easy", totals.easy],
              ].map(([label, value]) => (
                <div key={String(label)} className="border border-white/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-wider text-white/60">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-cyan-100">
                    <CountUp value={Number(value)} />
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-2">
              {([
                ["hard", percentages.hard],
                ["medium", percentages.medium],
                ["easy", percentages.easy],
              ] as const).map(([label, width]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-white/60">
                    <span>{label}</span>
                    <span>{width.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/10">
                    <motion.div className="h-2 bg-gradient-to-r from-cyan-400 to-violet-400" initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-5">
              {(["hard", "medium", "easy"] as const).map((level) => (
                <div key={level} className="border-t border-white/10 pt-5">
                  <button className="flex w-full items-center justify-between text-left" onClick={() => setOpenDifficulty((prev) => ({ ...prev, [level]: !prev[level] }))}>
                    <span className="text-lg capitalize">{level} problems</span>
                    {openDifficulty[level] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {openDifficulty[level] && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <ul className="mt-4 space-y-2 text-sm text-white/80">
                          {(leetcodeData[lcLang][level] as string[]).length ? (
                            (leetcodeData[lcLang][level] as string[]).map((entry) => {
                              const problem = parseProblemEntry(entry);

                              return (
                                <li key={entry} className="flex items-center justify-between gap-4 border border-white/15 bg-white/[0.02] px-4 py-3">
                                  <span className="min-w-0 truncate text-white/85">{problem.title}</span>
                                  {problem.id ? <span className="shrink-0 font-mono text-xs text-cyan-200/90">{problem.id}</span> : null}
                                </li>
                              );
                            })
                          ) : (
                            <li className="border border-white/15 bg-white/[0.02] px-4 py-3 text-white/60">No solved problems yet in this difficulty.</li>
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </section>

        <section id="contact" className="immersive-section mx-auto w-full max-w-6xl px-6 py-24">
          <motion.h2 data-split="true" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title text-3xl font-semibold md:text-5xl">
            Contact
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 flex flex-wrap gap-4">
            <a href="mailto:arrhat@arrhat.com" className="inline-flex items-center gap-2 border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-medium tracking-wide text-cyan-100 transition hover:bg-cyan-300/20">
              Email / Hire Me
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="/assets/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm font-medium tracking-wide text-white/85 transition hover:border-cyan-300/40 hover:text-cyan-100">
              Resume / CV
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050714]/80">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/75">Arrhat Nag</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                Systems, CUDA, and AI infrastructure portfolio focused on low-level engineering, applied security, and production-grade builds.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">Navigation</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/75">
                <a href="#featured" className="border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">Featured</a>
                <a href="#experience" className="border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">Experience</a>
                <a href="#projects" className="border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">Projects</a>
                <a href="#awards" className="border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">Awards</a>
                <a href="#publications" className="border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">Publications</a>
                <a href="#leetcode" className="border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">Problem Solving</a>
                <a href="#contact" className="border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">Contact</a>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">Contact</p>
              <div className="mt-3 flex flex-col gap-3 text-sm text-white/75">
                <a href="mailto:arrhat@arrhat.com" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">
                  arrhat@arrhat.com
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a href="/assets/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">
                  Resume / CV
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a href="https://www.youtube.com/@arrhat" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">
                  YouTube
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a href="https://medium.com/@arrhatnag1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 transition hover:border-cyan-300/40 hover:text-cyan-100">
                  Medium
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-5 text-xs uppercase tracking-wider text-white/45">
            <p>Copyright {currentYear} Arrhat Nag</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedMedia && (
          <motion.button
            aria-label="Close media viewer"
            className="fixed inset-0 z-[70] grid place-items-center bg-[#05070f]/92 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
          >
            {selectedMedia.type === "image" ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                src={selectedMedia.src}
                alt="Journey enlarged preview"
                className="max-h-[85vh] w-full max-w-5xl object-contain"
              />
            ) : (
              <motion.video
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                src={selectedMedia.src}
                controls
                autoPlay
                className="max-h-[85vh] w-full max-w-5xl"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
      <Analytics />
    </motion.div>
  );
}