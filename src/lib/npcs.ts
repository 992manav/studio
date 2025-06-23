import type { Npc } from './types';

// Aisle X positions: -16, -8, 8, 16
// Aisle Z length: -18 to 18
// Walkable X lanes: ~ -19, -12, 0, 12, 19
// Walkable Z lanes: ~ -20 (back), 20 (front)

export const npcs: Npc[] = [
  {
    id: 1,
    name: 'Brenda',
    personality: 'A friendly but slightly overwhelmed mom trying to get shopping done with her kids. She is looking for snacks and juice boxes.',
    position: [-12, 0, 5], // Start in a safe lane
    color: '#3498db',
    path: [
      [-12, 0, 18],
      [-12, 0, -18],
    ]
  },
  {
    id: 2,
    name: 'Kevin',
    personality: 'A college student on a budget, looking for instant noodles and energy drinks. He is a bit sarcastic and hurried.',
    position: [12, 0, -10], // Start in a safe lane
    color: '#e67e22',
    path: [
      [12, 0, -18],
      [12, 0, 18],
    ]
  },
  {
    id: 3,
    name: 'Karen',
    personality: 'An assertive and picky shopper who knows exactly what she wants and is not afraid to complain. She is currently looking for organic kale.',
    position: [-19, 0, -15], // Start in a safe lane
    color: '#e74c3c',
    path: [
      [-19, 0, -18],
      [-19, 0, 18],
      [-12, 0, 18],
      [-12, 0, -18],
    ]
  },
  {
    id: 4,
    name: 'Chad',
    personality: 'A fitness enthusiast looking for protein powder and workout gear. He talks a lot about his gym routine.',
    position: [19, 0, 15], // Start in a safe lane
    color: '#2ecc71',
     path: [
      [19, 0, 18],
      [19, 0, -18],
      [12, 0, -18],
      [12, 0, 18],
    ]
  },
  {
    id: 5,
    name: 'Eleanor',
    personality: 'A sweet elderly lady moving slowly and carefully, admiring all the different products. She loves to chat.',
    position: [0, 0, -20], // Start in a safe lane
    color: '#9b59b6',
    path: [
        [-19, 0, -20],
        [19, 0, -20],
    ]
  },
  {
    id: 6,
    name: 'Marcus',
    personality: 'A serious-looking man in a suit, seems to be on a very specific mission, possibly for his boss. He is efficient and direct.',
    position: [-12, 0, 10], // Start in a safe lane
    color: '#34495e',
    path: [
        [-12, 0, 18],
        [12, 0, 18],
        [12, 0, -18],
        [-12, 0, -18],
    ]
  }
];
