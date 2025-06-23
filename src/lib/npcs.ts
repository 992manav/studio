import type { Npc } from './types';

// Aisle X positions: -16, -8, 8, 16
// Aisle Z length: -18 to 18

export const npcs: Npc[] = [
  {
    id: 1,
    name: 'Brenda',
    personality: 'A friendly but slightly overwhelmed mom trying to get shopping done with her kids. She is looking for snacks and juice boxes.',
    position: [-10, 0, 5],
    color: '#3498db',
    path: [
      [-8.75, 0, 15],
      [-8.75, 0, -15],
      [-7.25, 0, -15],
      [-7.25, 0, 15],
    ]
  },
  {
    id: 2,
    name: 'Kevin',
    personality: 'A college student on a budget, looking for instant noodles and energy drinks. He is a bit sarcastic and hurried.',
    position: [10, 0, -10],
    color: '#e67e22',
    path: [
      [8.75, 0, -15],
      [8.75, 0, 15],
      [7.25, 0, 15],
      [7.25, 0, -15],
    ]
  },
  {
    id: 3,
    name: 'Karen',
    personality: 'An assertive and picky shopper who knows exactly what she wants and is not afraid to complain. She is currently looking for organic kale.',
    position: [-12, 0, -15],
    color: '#e74c3c',
    path: [
      [-16.75, 0, -15],
      [-16.75, 0, 15],
      [-15.25, 0, 15],
      [-15.25, 0, -15],
    ]
  },
  {
    id: 4,
    name: 'Chad',
    personality: 'A fitness enthusiast looking for protein powder and workout gear. He talks a lot about his gym routine.',
    position: [12, 0, 15],
    color: '#2ecc71',
     path: [
      [16.75, 0, 15],
      [16.75, 0, -15],
      [15.25, 0, -15],
      [15.25, 0, 15],
    ]
  },
  {
    id: 5,
    name: 'Eleanor',
    personality: 'A sweet elderly lady moving slowly and carefully, admiring all the different products. She loves to chat.',
    position: [0, 0, -20],
    color: '#9b59b6',
    path: [
        [-18, 0, -21.25],
        [18, 0, -21.25],
    ]
  },
  {
    id: 6,
    name: 'Marcus',
    personality: 'A serious-looking man in a suit, seems to be on a very specific mission, possibly for his boss. He is efficient and direct.',
    position: [-10, 0, 10],
    color: '#34495e',
    path: [
        [-16.75, 0, 10],
        [-16.75, 0, -10],
        [15.25, 0, -10],
        [15.25, 0, 10],
        [8.75, 0, 10],
        [8.75, 0, -10],
        [-7.25, 0, -10],
        [-7.25, 0, 10],
    ]
  }
];
