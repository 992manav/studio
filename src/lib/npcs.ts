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
      [0, 0, -28],
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
        [-19, 0, -28],
        [19, 0, -28],
        [19, 0, 20],
        [-19, 0, 20],
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
  },
  // NEW EMPLOYEES
  {
    id: 11,
    name: 'Maria (Greeter)',
    personality: 'A warm and welcoming employee at the entrance.',
    position: [10, 0, 70],
    color: '#34495e',
    isEmployee: true,
    path: [
        [10, 0, 70],
        [-10, 0, 70],
    ]
  },
  {
    id: 12,
    name: 'Rick (Greeter)',
    personality: 'A helpful employee keeping the entrance area tidy.',
    position: [-10, 0, 70],
    color: '#795548',
    isEmployee: true,
    path: [
        [-10, 0, 70],
        [10, 0, 70],
    ]
  },
  {
    id: 13,
    name: 'James (Groceries)',
    personality: 'Diligently stocking cereal and soup in the grocery aisle.',
    position: [-16, 0, 0],
    color: '#00bcd4',
    isEmployee: true,
    path: [
        [-16, 0, -18],
        [-16, 0, 18],
    ]
  },
  {
    id: 14,
    name: 'Linda (Groceries)',
    personality: 'Restocking snacks and drinks, always with a smile.',
    position: [-8, 0, 10],
    color: '#607d8b',
    isEmployee: true,
    path: [
        [-8, 0, -15],
        [-8, 0, 15],
    ]
  },
    {
    id: 15,
    name: 'Robert (Home Goods)',
    personality: 'Neatly folding towels and organizing kitchenware.',
    position: [8, 0, 5],
    color: '#cddc39',
    isEmployee: true,
    path: [
        [8, 0, -18],
        [8, 0, 18],
    ]
  },
  {
    id: 16,
    name: 'Patricia (Apparel)',
    personality: 'Helping customers find the right size jeans.',
    position: [16, 0, 0],
    color: '#ffc107',
    isEmployee: true,
    path: [
        [16, 0, -15],
        [16, 0, 15],
    ]
  },
    {
    id: 17,
    name: 'Susan (Electronics)',
    personality: 'Expert on the latest video games and toys.',
    position: [-10, 0, -29],
    color: '#4caf50',
    isEmployee: true,
    path: [
        [-15, 0, -29],
        [15, 0, -29],
    ]
  },
   {
    id: 18,
    name: 'Mike (Electronics)',
    personality: 'An employee helping customers in the electronics section.',
    position: [10, 0, -29],
    color: '#f44336',
    isEmployee: true,
    path: [
      [15, 0, -29],
      [-15, 0, -29],
    ]
  },
];
