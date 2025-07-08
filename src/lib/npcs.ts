import type { Npc } from "./types";

// Aisle X positions: -16, -8, 8, 16
// Walkable X lanes: ~ -19, -12, 0, 12, 19
// Aisle Z length: -20 (back) to 20 (front)

export const npcs: Npc[] = [
  {
    id: 1,
    name: "Brenda",
    personality:
      "A friendly but slightly overwhelmed mom trying to get shopping done with her kids. She is looking for snacks and juice boxes.",
    position: [-12, 0, 5],
    color: "#3498db",
    path: [
      [-12, 0, 18],
      [-12, 0, -18],
    ],
  },
  {
    id: 2,
    name: "Kevin",
    personality:
      "A college student on a budget, looking for instant noodles and energy drinks. He is a bit sarcastic and hurried.",
    position: [12, 0, -10],
    color: "#e67e22",
    path: [
      [12, 0, 18],
      [12, 0, -18],
    ],
  },
  {
    id: 4,
    name: "Chad",
    personality:
      "A fitness enthusiast looking for protein powder and workout gear. He talks a lot about his gym routine.",
    position: [0, 0, 15],
    color: "#2ecc71",
    path: [
      [0, 0, 18],
      [0, 0, -18],
    ],
  },
  {
    id: 5,
    name: "Eleanor",
    personality:
      "A sweet elderly lady moving slowly and carefully, admiring all the different products. She loves to chat.",
    position: [0, 0, 10],
    color: "#9b59b6",
    path: [
      [0, 0, 15],
      [0, 0, -15],
    ],
  },
  // EMPLOYEES
  {
    id: 10,
    name: "Clara (Assistant)",
    personality:
      "The in-store avatar for the helpful AI assistant. Clara is knowledgeable, patient, and always ready to help customers find what they need.",
    position: [-5, 0, 31],
    color: "#f1c40f", // A distinct yellow/gold color
    isEmployee: true,
  },
  {
    id: 11,
    name: "Maria (Greeter)",
    personality: "A warm and welcoming employee at the entrance.",
    position: [10, 0, 60],
    color: "#34495e",
    isEmployee: true,
    path: [
      [10, 0, 50],
      [-10, 0, 50],
    ],
  },
  {
    id: 13,
    name: "James (Groceries)",
    personality: "Diligently stocking cereal and soup in the grocery aisle.",
    position: [-16, 0, 0],
    color: "#00bcd4",
    isEmployee: true,
    path: [
      [-16, 0, -18],
      [-16, 0, 18],
    ],
  },
];
