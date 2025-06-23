import type { Product } from './types';

// Shelf positions based on a larger store layout
// Main Aisles (length 40) at x = -16, -8, 8, 16. Products at x +/- 0.75
// Back Aisle (length 40) at z = -22. Products at z +/- 0.75
// Shelf tops (y): ~0.025, 0.87, 1.71, 2.55, 3.39. Add half of product height.

const sodaDisplayProducts: Product[] = [];
const sodaCaseSize: [number, number, number] = [1.2, 0.4, 0.8];
const pepsiImage = 'https://source.unsplash.com/400x400/?pepsi-case';
const mtnDewImage = 'https://source.unsplash.com/400x400/?mountain-dew-case';
const starryImage = 'https://source.unsplash.com/400x400/?soda-case,lemon,lime';
const drPepperImage = 'https://source.unsplash.com/400x400/?dr-pepper-case';

let currentId = 100;

// Create Pepsi Stack (like image)
const pepsiStackPos = { x: -4, y: sodaCaseSize[1] / 2, z: 15 };
for (let i = 0; i < 4; i++) { // height
  for (let j = 0; j < 4; j++) { // width
    for (let k = 0; k < 3; k++) { // depth
      sodaDisplayProducts.push({
        id: currentId++,
        name: 'Pepsi 12-Pack',
        price: 5.98,
        description: 'A 12-pack of classic Pepsi cola.',
        image: pepsiImage,
        category: 'Groceries',
        position: [
          pepsiStackPos.x + j * sodaCaseSize[0],
          pepsiStackPos.y + i * sodaCaseSize[1],
          pepsiStackPos.z + k * sodaCaseSize[2],
        ],
        size: sodaCaseSize,
        hint: 'pepsi case',
      });
    }
  }
}

// Create Mtn Dew Stack
const dewStackPos = { x: 2, y: sodaCaseSize[1] / 2, z: 15 };
for (let i = 0; i < 3; i++) { // height
  for (let j = 0; j < 3; j++) { // width
    for (let k = 0; k < 2; k++) { // depth
      sodaDisplayProducts.push({
        id: currentId++,
        name: 'Mtn Dew 12-Pack',
        price: 5.98,
        description: 'A 12-pack of Mtn Dew soda.',
        image: mtnDewImage,
        category: 'Groceries',
        position: [
          dewStackPos.x + j * sodaCaseSize[0],
          dewStackPos.y + i * sodaCaseSize[1],
          dewStackPos.z + k * sodaCaseSize[2],
        ],
        size: sodaCaseSize,
        hint: 'mountain dew case',
      });
    }
  }
}

// Create Starry Stack
const starryStackPos = { x: 6, y: sodaCaseSize[1] / 2, z: 15 };
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 2; j++) {
      sodaDisplayProducts.push({
        id: currentId++,
        name: 'Starry 12-Pack',
        price: 5.98,
        description: 'A 12-pack of Starry lemon-lime soda.',
        image: starryImage,
        category: 'Groceries',
        position: [
          starryStackPos.x + j * sodaCaseSize[0],
          starryStackPos.y + i * sodaCaseSize[1],
          starryStackPos.z,
        ],
        size: sodaCaseSize,
        hint: 'lemon lime soda',
      });
  }
}

export const products: Product[] = [
  // Aisle at x=-16: Groceries & Prepared Food
  {
    id: 1,
    name: 'Great Value Milk',
    price: 3.5,
    description: 'Fresh and nutritious whole milk. A household essential.',
    image: 'https://source.unsplash.com/400x400/?milk-carton',
    category: 'Groceries',
    position: [-16.75, 1.71 + 0.75, -10],
    size: [0.5, 1.5, 0.5],
    hint: 'milk carton'
  },
  {
    id: 12,
    name: 'Great Value Eggs',
    price: 2.50,
    description: 'One dozen Grade A large eggs.',
    image: 'https://source.unsplash.com/400x400/?egg-carton',
    category: 'Groceries',
    position: [-16.75, 0.87 + 0.35, -4],
    size: [1, 0.7, 0.5],
    hint: 'egg carton'
  },
  {
    id: 15,
    name: 'Fresh Cravings Salsa',
    price: 3.98,
    description: 'Restaurant style salsa, medium heat.',
    image: 'https://source.unsplash.com/400x400/?salsa-jar',
    category: 'Groceries',
    position: [-16.75, 0.025 + 0.3, 0],
    size: [0.6, 0.6, 0.6],
    hint: 'salsa jar'
  },
  {
    id: 21,
    name: 'Marketside Chicken Wrap',
    price: 3.98,
    description: 'A delicious ready-to-eat chicken and bacon ranch wrap.',
    image: 'https://source.unsplash.com/400x400/?chicken-wrap',
    category: 'Groceries',
    position: [-16.75, 0.025 + 0.25, 4],
    size: [0.8, 0.5, 0.8],
    hint: 'chicken wrap package'
  },


  // Aisle at x=-8: More Groceries & Snacks
  {
    id: 3,
    name: 'Marketside Pizza',
    price: 5.0,
    description: 'Delicious pepperoni pizza, ready to bake.',
    image: 'https://source.unsplash.com/400x400/?pizza-box',
    category: 'Groceries',
    position: [-8.75, 0.87 + 0.1, -7],
    size: [1.2, 0.2, 1.2],
    hint: 'pizza box'
  },
  {
    id: 22,
    name: 'Dr Pepper 12-Pack',
    price: 5.98,
    description: 'A 12-pack of Dr Pepper soda.',
    image: drPepperImage,
    category: 'Groceries',
    position: [-8.75, 0.025 + sodaCaseSize[1]/2, 10],
    size: sodaCaseSize,
    hint: 'dr pepper case'
  },


  // Aisle at x=8: Home Goods & Apparel
  {
    id: 5,
    name: 'Hanes T-Shirt',
    price: 6.0,
    description: 'Comfortable and durable 100% cotton crewneck t-shirt.',
    image: 'https://source.unsplash.com/400x400/?folded-shirt',
    category: 'Apparel',
    position: [8.75, 1.71 + 0.05, -8],
    size: [0.8, 0.1, 1],
    hint: 'folded shirt'
  },
   {
    id: 19,
    name: 'Wrangler Mens Jeans',
    price: 19.98,
    description: 'Regular fit straight leg jeans for men.',
    image: 'https://source.unsplash.com/400x400/?folded-jeans',
    category: 'Apparel',
    position: [8.75, 1.71 + 0.05, -10],
    size: [0.8, 0.1, 1],
    hint: 'folded jeans'
  },
  {
    id: 7,
    name: 'Mainstays Bath Towel',
    price: 4.97,
    description: 'Soft and absorbent 100% cotton bath towel.',
    image: 'https://source.unsplash.com/400x400/?folded-towel',
    category: 'Home Goods',
    position: [8.75, 0.87 + 0.1, 0],
    size: [1.5, 0.2, 1],
    hint: 'folded towel'
  },
  {
    id: 10,
    name: 'T-fal Cookware Set',
    price: 69.99,
    description: '18-piece nonstick cookware set, perfect for any kitchen.',
    image: 'https://source.unsplash.com/400x400/?cookware-set',
    category: 'Home Goods',
    position: [8.75, 2.55 + 0.75, -2],
    size: [2, 1.5, 2],
    hint: 'cookware set box'
  },
  {
    id: 16,
    name: 'George Foreman Grill',
    price: 29.99,
    description: 'Classic plate grill for 2 servings.',
    image: 'https://source.unsplash.com/400x400/?electric-grill',
    category: 'Home Goods',
    position: [8.75, 0.87 + 0.4, -5],
    size: [1, 0.8, 1],
    hint: 'grill box'
  },


  // Aisle at x=16: Pharmacy, Personal Care, Outdoors
  {
    id: 2,
    name: 'Equate Ibuprofen',
    price: 8.98,
    description: 'Pain reliever and fever reducer. 200mg tablets.',
    image: 'https://source.unsplash.com/400x400/?medicine-bottle',
    category: 'Pharmacy',
    position: [16.75, 0.025 + 0.4, 8],
    size: [0.4, 0.8, 0.3],
    hint: 'medicine bottle'
  },
  {
    id: 13,
    name: 'Equate Allergy Relief',
    price: 12.48,
    description: '24-hour non-drowsy allergy relief tablets.',
    image: 'https://source.unsplash.com/400x400/?medicine-box',
    category: 'Pharmacy',
    position: [16.75, 0.025 + 0.4, 10],
    size: [0.4, 0.8, 0.3],
    hint: 'medicine box'
  },
  {
    id: 23,
    name: 'Neutrogena Face Wash',
    price: 8.49,
    description: 'Hydro Boost hydrating facial cleansing gel.',
    image: 'https://source.unsplash.com/400x400/?face-wash',
    category: 'Personal Care',
    position: [16.75, 0.87 + 0.45, 12],
    size: [0.3, 0.9, 0.3],
    hint: 'face cleanser'
  },
  {
    id: 24,
    name: 'CeraVe Moisturizer',
    price: 14.99,
    description: 'Moisturizing cream for face and body with hyaluronic acid.',
    image: 'https://source.unsplash.com/400x400/?moisturizer-jar',
    category: 'Personal Care',
    position: [16.75, 0.87 + 0.4, 14],
    size: [0.8, 0.8, 0.8],
    hint: 'lotion jar'
  },
  {
    id: 6,
    name: 'Ozark Trail Tent',
    price: 49.99,
    description: '4-person dome tent, perfect for camping trips.',
    image: 'https://source.unsplash.com/400x400/?camping-tent',
    category: 'Outdoors',
    position: [16.75, 2.55 + 1, -4],
    size: [2, 2, 2],
    hint: 'camping tent package'
  },
  {
    id: 20,
    name: 'Coleman Cooler',
    price: 24.98,
    description: '48-Quart Performance 3-Day Cooler.',
    image: 'https://source.unsplash.com/400x400/?beverage-cooler',
    category: 'Outdoors',
    position: [16.75, 0.87 + 0.6, -6],
    size: [1.5, 1.2, 1.2],
    hint: 'beverage cooler'
  },


  // Back Aisle at z=-22: Electronics, Toys, Sporting Goods
  {
    id: 4,
    name: 'onn. 50" TV',
    price: 198.0,
    description: '50" Class 4K UHD (2160P) LED Roku Smart TV.',
    image: 'https://source.unsplash.com/400x400/?television',
    category: 'Electronics',
    position: [-10, 1.71 + 1.25, -22.75],
    size: [4.5, 2.5, 0.2],
    hint: 'television box'
  },
  {
    id: 14,
    name: 'onn. Bluetooth Speaker',
    price: 20.00,
    description: 'Portable bluetooth speaker with 8 hours of playtime.',
    image: 'https://source.unsplash.com/400x400/?bluetooth-speaker',
    category: 'Electronics',
    position: [-4, 0.025 + 0.25, -22.75],
    size: [0.8, 0.5, 0.4],
    hint: 'speaker box'
  },
  {
    id: 18,
    name: 'Apple AirPods',
    price: 129.00,
    description: '2nd Generation Apple AirPods with Charging Case.',
    image: 'https://source.unsplash.com/400x400/?earbuds',
    category: 'Electronics',
    position: [-6, 0.025 + 0.2, -22.75],
    size: [0.3, 0.4, 0.3],
    hint: 'airpods box'
  },
  {
    id: 8,
    name: 'LEGO Classic Bricks',
    price: 20.00,
    description: 'A box of 484 classic LEGO bricks for creative building.',
    image: 'https://source.unsplash.com/400x400/?lego',
    category: 'Toys',
    position: [3, 0.87 + 0.4, -22.75],
    size: [1.2, 0.8, 0.5],
    hint: 'lego box'
  },
  {
    id: 11,
    name: 'Barbie Dreamhouse',
    price: 179.00,
    description: 'The ultimate dollhouse with 3 stories, 8 rooms, and a working elevator.',
    image: 'https://source.unsplash.com/400x400/?dollhouse',
    category: 'Toys',
    position: [8, 2.55 + 1.5, -22.75],
    size: [2.5, 3, 1],
    hint: 'dollhouse box'
  },
  {
    id: 17,
    name: 'Nerf Elite 2.0 Blaster',
    price: 14.97,
    description: 'Includes 16 Nerf Elite darts and has a 8-dart rotating drum.',
    image: 'https://source.unsplash.com/400x400/?toy-gun',
    category: 'Toys',
    position: [0, 0.87 + 0.4, -22.75],
    size: [1.5, 0.8, 0.4],
    hint: 'toy gun box'
  },
  {
    id: 9,
    name: 'Spalding Basketball',
    price: 15.88,
    description: 'Official size and weight street basketball.',
    image: 'https://source.unsplash.com/400x400/?basketball',
    category: 'Sporting Goods',
    position: [15, 1.71 + 0.5, -22.75],
    size: [1, 1, 1],
    hint: 'basketball'
  },

  // Add soda display products
  ...sodaDisplayProducts
];

export const trendingProducts: string[] = [
  'onn. 50" TV',
  'Marketside Pizza',
  'Great Value Milk',
  'LEGO Classic Bricks',
  'Spalding Basketball',
  'Apple AirPods',
  'Barbie Dreamhouse',
  'Pepsi 12-Pack',
  'Mtn Dew 12-Pack'
];
