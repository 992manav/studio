import type { Npc } from './types';

// Aisle X positions: -16, -8, 8, 16
// Walkable X lanes: ~ -19, -12, 0, 12, 19
// Aisle Z length: -20 (back) to 20 (front)

export const npcs: Npc[] = [
  {
    id: 1,
    name: 'Brenda',
    personality: 'A friendly but slightly overwhelmed mom trying to get shopping done with her kids. She is looking for snacks and juice boxes.',
    position: [-12, 0, 5],
    color: '#3498db',
    path: [
      [-12, 0, 18], 
      [-19, 0, 18],
      [-19, 0, -18],
      [-12, 0, -18],
    ]
  },
  {
    id: 2,
    name: 'Kevin',
    personality: 'A college student on a budget, looking for instant noodles and energy drinks. He is a bit sarcastic and hurried.',
    position: [12, 0, -10],
    color: '#e67e22',
    path: [
      [12, 0, 18],
      [12, 0, -18],
      [8, 0, -18],
      [8, 0, 18],
    ]
  },
  {
    id: 3,
    name: 'Karen',
    personality: 'An assertive and picky shopper who knows exactly what she wants and is not afraid to complain. She is currently looking for organic kale.',
    position: [-19, 0, -15],
    color: '#e74c3c',
    path: [
      [-19, 0, 18],
      [19, 0, 18], 
      [19, 0, -18],
      [-19, 0, -18],
    ]
  },
  {
    id: 4,
    name: 'Chad',
    personality: 'A fitness enthusiast looking for protein powder and workout gear. He talks a lot about his gym routine.',
    position: [19, 0, 15],
    color: '#2ecc71',
     path: [
      [19, 0, -18],
      [0, 0, -20],
      [0, 0, 18],
      [19, 0, 18],
    ]
  },
  {
    id: 5,
    name: 'Eleanor',
    personality: 'A sweet elderly lady moving slowly and carefully, admiring all the different products. She loves to chat.',
    position: [0, 0, -20],
    color: '#9b59b6',
    path: [
        [-19, 0, -20],
        [19, 0, -20],
        [19, 0, 20],
        [-19, 0, 20],
    ]
  },
  {
    id: 6,
    name: 'Marcus',
    personality: 'A helpful store employee, ensuring shelves are stocked.',
    position: [0, 0, 10],
    color: '#34495e',
    isEmployee: true,
    path: [
        [-12, 0, 10],
        [-12, 0, -15],
        [0, 0, -20],
        [12, 0, -15],
        [12, 0, 10],
        [0, 0, 10],
    ]
  },
  {
    id: 7,
    name: 'Chloe',
    personality: 'A friendly employee in the electronics department, ready to answer questions.',
    position: [0, 0, -18],
    color: '#00bcd4',
    isEmployee: true,
    path: [
      [-18, 0, -21],
      [18, 0, -21],
      [18, 0, -20],
      [-18, 0, -20],
    ]
  },
  {
    id: 8,
    name: 'Ben',
    personality: 'A helpful employee working the front of the store, keeping things tidy.',
    position: [12, 0, 10],
    color: '#795548',
    isEmployee: true,
    path: [
      [12, 0, 18],
      [12, 0, -18],
      [-12, 0, -18],
      [-12, 0, 18],
    ]
  },
  {
    id: 9,
    name: 'Olivia',
    personality: 'A cheerful foodie and home chef, browsing for unique and high-quality ingredients. She\'s patient and observant.',
    position: [-19, 0, 10],
    color: '#8bc34a',
    path: [
      [-19, 0, 18],
      [-19, 0, -18],
      [-12, 0, -18],
      [-12, 0, 18],
    ]
  },
  {
    id: 10,
    name: 'David',
    personality: 'A practical, no-nonsense DIY enthusiast looking for tools and supplies for a home project. He\'s focused and moves with purpose.',
    position: [0, 0, 15],
    color: '#ff9800',
    path: [
      [8, 0, 15],
      [8, 0, -15],
      [16, 0, -15],
      [16, 0, 15],
    ]
  }
];
