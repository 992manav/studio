import type { Product } from './types';

export const products: Product[] = [];
let currentId = 1;

// Shelf tops (y): ~0.025, 0.87, 1.71, 2.55, 3.39. Add half of product height.
const shelfY = {
  bottom: 0.025,
  low: 0.87,
  mid: 1.71,
  high: 2.55,
  top: 3.39,
};

const stockShelf = (baseProduct: Omit<Product, 'id' | 'position'>, startPos: [number, number, number], count: number, direction: 'x' | 'z') => {
  for (let i = 0; i < count; i++) {
    const position: [number, number, number] = [...startPos];
    const spacing = (direction === 'z' ? baseProduct.size[2] : baseProduct.size[0]) + 0.05; // small gap between products
    if (direction === 'z') {
      position[2] += i * spacing;
    } else {
      position[0] += i * spacing;
    }

    products.push({
      ...baseProduct,
      id: currentId++,
      position: [position[0], position[1] + baseProduct.size[1] / 2, position[2]],
    });
  }
};


// --- AISLE 1: Groceries & Prepared Food (x = -16) ---

// Left Side (x = -16.75)
stockShelf({
    name: 'Great Value Milk', price: 3.5, description: 'Fresh and nutritious whole milk.', image: 'https://images.unsplash.com/photo-1550583724-b2692b2ae389?q=80&w=400', category: 'Groceries', size: [0.5, 1, 0.5], hint: 'milk carton'
}, [-16.75, shelfY.mid, -18], 15, 'z');

stockShelf({
    name: 'Great Value Eggs', price: 2.50, description: 'One dozen Grade A large eggs.', image: 'https://images.unsplash.com/photo-1598965675045-45c5e7207d03?q=80&w=400', category: 'Groceries', size: [1, 0.4, 0.5], hint: 'egg carton'
}, [-16.75, shelfY.low, -18], 10, 'z');

stockShelf({
    name: 'Marketside Chicken Wrap', price: 3.98, description: 'Ready-to-eat chicken and bacon ranch wrap.', image: 'https://images.unsplash.com/photo-1626084995995-5645842348a2?q=80&w=400', category: 'Groceries', size: [0.8, 0.5, 0.8], hint: 'chicken wrap package'
}, [-16.75, shelfY.bottom, -5], 10, 'z');

stockShelf({
    name: 'Fresh Cravings Salsa', price: 3.98, description: 'Restaurant style salsa, medium heat.', image: 'https://images.unsplash.com/photo-1512756184132-5a21a50352d0?q=80&w=400', category: 'Groceries', size: [0.4, 0.5, 0.4], hint: 'salsa jar'
}, [-16.75, shelfY.bottom, 5], 15, 'z');


// Right Side (x = -15.25)
stockShelf({
    name: 'Great Value Bread', price: 2.24, description: 'Classic white sandwich bread.', image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=400', category: 'Groceries', size: [0.5, 0.5, 1], hint: 'bread loaf'
}, [-15.25, shelfY.low, -18], 12, 'z');

stockShelf({
    name: 'Honey Nut Cheerios', price: 4.12, description: 'A family size box of whole grain oat cereal.', image: 'https://images.unsplash.com/photo-1621945142079-c5601b6c6b3b?q=80&w=400', category: 'Groceries', size: [0.8, 1, 0.3], hint: 'cereal box'
}, [-15.25, shelfY.mid, -18], 10, 'z');

stockShelf({
    name: 'Quaker Oats', price: 3.88, description: 'Old fashioned rolled oats.', image: 'https://images.unsplash.com/photo-1616410011239-2a9fbab23b84?q=80&w=400', category: 'Groceries', size: [0.6, 0.8, 0.6], hint: 'oats container'
}, [-15.25, shelfY.mid, -8], 10, 'z');

stockShelf({
    name: 'Spaghetti Pasta', price: 1.28, description: 'A box of classic spaghetti.', image: 'https://images.unsplash.com/photo-1579584390349-881e55b55050?q=80&w=400', category: 'Groceries', size: [0.8, 0.2, 0.4], hint: 'pasta box'
}, [-15.25, shelfY.high, 0], 20, 'z');

stockShelf({
    name: 'Marinara Sauce', price: 2.14, description: 'A jar of traditional marinara sauce.', image: 'https://images.unsplash.com/photo-1598103442385-a4a03a2a6b46?q=80&w=400', category: 'Groceries', size: [0.4, 0.7, 0.4], hint: 'sauce jar'
}, [-15.25, shelfY.high, 10], 15, 'z');


// --- AISLE 2: More Groceries & Snacks (x = -8) ---

// Left Side (x = -8.75)
stockShelf({
    name: 'Lays Classic Chips', price: 3.50, description: 'A party size bag of classic potato chips.', image: 'https://images.unsplash.com/photo-1599490659213-e2b84a5b241b?q=80&w=400', category: 'Groceries', size: [0.8, 1, 0.4], hint: 'potato chips'
}, [-8.75, shelfY.mid, -18], 15, 'z');

stockShelf({
    name: 'Doritos Nacho Cheese', price: 3.50, description: 'A party size bag of Doritos.', image: 'https://images.unsplash.com/photo-1714716258283-35a1723e753d?q=80&w=400', category: 'Groceries', size: [0.8, 1, 0.4], hint: 'tortilla chips'
}, [-8.75, shelfY.mid, -5], 15, 'z');

stockShelf({
    name: 'Oreo Cookies', price: 3.78, description: 'A family size pack of classic Oreo cookies.', image: 'https://images.unsplash.com/photo-1622240506728-1424b4c7444a?q=80&w=400', category: 'Groceries', size: [0.7, 0.3, 0.2], hint: 'cookie package'
}, [-8.75, shelfY.low, -18], 20, 'z');

stockShelf({
    name: 'Chips Ahoy!', price: 3.78, description: 'A family size pack of chocolate chip cookies.', image: 'https://images.unsplash.com/photo-1598232939886-3e4b7858d4e0?q=80&w=400', category: 'Groceries', size: [0.7, 0.3, 0.2], hint: 'cookie package'
}, [-8.75, shelfY.low, -5], 20, 'z');

// Right Side (x = -7.25)
const sodaCaseSize: [number, number, number] = [1.2, 0.4, 0.8];
stockShelf({
    name: 'Coca-Cola 12-Pack', price: 5.98, description: 'A 12-pack of classic Coca-Cola.', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=400', category: 'Groceries', size: sodaCaseSize, hint: 'coke case'
}, [-7.25, shelfY.bottom, -18], 10, 'z');
stockShelf({
    name: 'Pepsi 12-Pack', price: 5.98, description: 'A 12-pack of classic Pepsi cola.', image: 'https://i5.walmartimages.com/asr/44ae0c53-8880-4627-92ed-a7fcb2c76bbb.cf2b37989bb855161c5e558b43feef1e.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'pepsi case'
}, [-7.25, shelfY.low, -18], 10, 'z');
stockShelf({
    name: 'Dr Pepper 12-Pack', price: 5.98, description: 'A 12-pack of Dr Pepper soda.', image: 'https://images.unsplash.com/photo-1623945239924-f7256d84f334?q=80&w=400', category: 'Groceries', size: sodaCaseSize, hint: 'dr pepper case'
}, [-7.25, shelfY.bottom, -8], 10, 'z');
stockShelf({
    name: 'Mtn Dew 12-Pack', price: 5.98, description: 'A 12-pack of Mtn Dew soda.', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=400', category: 'Groceries', size: sodaCaseSize, hint: 'mountain dew case'
}, [-7.25, shelfY.low, -8], 10, 'z');


// --- AISLE 3: Home Goods & Apparel (x = 8) ---
// Left Side (x = 8.75)
stockShelf({
    name: 'Mainstays Bath Towel', price: 4.97, description: 'Soft and absorbent 100% cotton bath towel.', image: 'https://images.unsplash.com/photo-1596631102148-3a444c9f1092?q=80&w=400', category: 'Home Goods', size: [1, 0.2, 0.8], hint: 'folded towel'
}, [8.75, shelfY.low, -18], 15, 'z');

stockShelf({
    name: 'T-fal Cookware Set', price: 69.99, description: '18-piece nonstick cookware set.', image: 'https://images.unsplash.com/photo-1583777526436-193448937adc?q=80&w=400', category: 'Home Goods', size: [1.5, 1.2, 1.5], hint: 'cookware set box'
}, [8.75, shelfY.top, -10], 4, 'z');

stockShelf({
    name: 'George Foreman Grill', price: 29.99, description: 'Classic plate grill for 2 servings.', image: 'https://images.unsplash.com/photo-1619495113948-2c263c93bf20?q=80&w=400', category: 'Home Goods', size: [1, 0.8, 1], hint: 'grill box'
}, [8.75, shelfY.high, 0], 8, 'z');

stockShelf({
    name: 'Oster Blender', price: 24.96, description: 'A powerful 6-speed kitchen blender.', image: 'https://images.unsplash.com/photo-1589254066228-c3343431d1f6?q=80&w=400', category: 'Home Goods', size: [0.6, 0.8, 0.6], hint: 'blender box'
}, [8.75, shelfY.high, 10], 10, 'z');

// Right Side (x = 7.25)
stockShelf({
    name: 'Hanes T-Shirt', price: 6.0, description: 'Comfortable 100% cotton crewneck t-shirt.', image: 'https://images.unsplash.com/photo-1581655353419-7cfc186af430?q=80&w=400', category: 'Apparel', size: [0.8, 0.1, 1], hint: 'folded shirt'
}, [7.25, shelfY.mid, -18], 12, 'z');

stockShelf({
    name: 'Wrangler Mens Jeans', price: 19.98, description: 'Regular fit straight leg jeans for men.', image: 'https://images.unsplash.com/photo-1602293589914-9e296ba2a7c4?q=80&w=400', category: 'Apparel', size: [0.8, 0.1, 1], hint: 'folded jeans'
}, [7.25, shelfY.mid, -5], 12, 'z');

stockShelf({
    name: 'Mainstays Pillow', price: 9.99, description: 'A standard size soft bed pillow.', image: 'https://images.unsplash.com/photo-1616627561821-f8a45371b272?q=80&w=400', category: 'Home Goods', size: [1.2, 0.5, 0.8], hint: 'bed pillow'
}, [7.25, shelfY.high, 5], 10, 'z');


// --- AISLE 4: Pharmacy, Personal Care, Outdoors (x = 16) ---
// Left Side (x = 16.75)
stockShelf({
    name: 'Equate Ibuprofen', price: 8.98, description: 'Pain reliever/fever reducer. 200mg tablets.', image: 'https://images.unsplash.com/photo-1607619056574-7d8d3ee536b2?q=80&w=400', category: 'Pharmacy', size: [0.3, 0.5, 0.3], hint: 'medicine bottle'
}, [16.75, shelfY.bottom, -18], 20, 'z');

stockShelf({
    name: 'Equate Allergy Relief', price: 12.48, description: '24-hour non-drowsy allergy relief tablets.', image: 'https://images.unsplash.com/photo-1550572017-53f8a4176a02?q=80&w=400', category: 'Pharmacy', size: [0.3, 0.5, 0.3], hint: 'medicine box'
}, [16.75, shelfY.bottom, -8], 20, 'z');

stockShelf({
    name: 'Ozark Trail Tent', price: 49.99, description: '4-person dome tent.', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', category: 'Outdoors', size: [1, 1, 1], hint: 'camping tent package'
}, [16.75, shelfY.top, 0], 5, 'z');

stockShelf({
    name: 'Coleman Cooler', price: 24.98, description: '48-Quart Performance 3-Day Cooler.', image: 'https://images.unsplash.com/photo-1579949434451-c5181a3ade15?q=80&w=400', category: 'Outdoors', size: [1.5, 1.2, 1.2], hint: 'beverage cooler'
}, [16.75, shelfY.low, 10], 6, 'z');

// Right Side (x = 15.25)
stockShelf({
    name: 'Neutrogena Face Wash', price: 8.49, description: 'Hydro Boost hydrating facial cleansing gel.', image: 'https://images.unsplash.com/photo-1556912959-50756a2f6a73?q=80&w=400', category: 'Personal Care', size: [0.3, 0.8, 0.3], hint: 'face cleanser'
}, [15.25, shelfY.mid, -18], 15, 'z');

stockShelf({
    name: 'CeraVe Moisturizer', price: 14.99, description: 'Moisturizing cream for face and body.', image: 'https://images.unsplash.com/photo-1629198687980-3f347463878b?q=80&w=400', category: 'Personal Care', size: [0.6, 0.5, 0.6], hint: 'lotion jar'
}, [15.25, shelfY.mid, -10], 15, 'z');

stockShelf({
    name: 'Colgate Toothpaste', price: 3.49, description: 'Cavity protection fluoride toothpaste.', image: 'https://images.unsplash.com/photo-1601642247347-11e2926cfd50?q=80&w=400', category: 'Personal Care', size: [0.8, 0.2, 0.15], hint: 'toothpaste box'
}, [15.25, shelfY.low, 0], 25, 'z');

stockShelf({
    name: 'Banana Boat Sunscreen', price: 7.97, description: 'SPF 50 broad spectrum sport sunscreen lotion.', image: 'https://images.unsplash.com/photo-1521223617336-d2e37f847843?q=80&w=400', category: 'Outdoors', size: [0.3, 0.8, 0.3], hint: 'sunscreen bottle'
}, [15.25, shelfY.low, 10], 20, 'z');


// --- Back Aisle: Electronics, Toys, Sporting Goods (z = -22) ---
// Back Side (z = -22.75)
stockShelf({
    name: 'onn. 50" TV', price: 198.0, description: '50" Class 4K UHD LED Roku Smart TV.', image: 'https://images.unsplash.com/photo-1593784944554-205d0d9039a9?q=80&w=400', category: 'Electronics', size: [4.5, 2.5, 0.2], hint: 'television box'
}, [-18, shelfY.mid, -22.75], 6, 'x');

stockShelf({
    name: 'onn. Bluetooth Speaker', price: 20.00, description: 'Portable bluetooth speaker.', image: 'https://images.unsplash.com/photo-1589100249429-4764215f9b1f?q=80&w=400', category: 'Electronics', size: [0.8, 0.5, 0.4], hint: 'speaker box'
}, [-2, shelfY.bottom, -22.75], 8, 'x');

stockShelf({
    name: 'Apple AirPods', price: 129.00, description: '2nd Gen Apple AirPods w/ Charging Case.', image: 'https://images.unsplash.com/photo-1590695378732-d12a6435a4d3?q=80&w=400', category: 'Electronics', size: [0.3, 0.4, 0.3], hint: 'airpods box'
}, [6, shelfY.bottom, -22.75], 10, 'x');

// Front Side (z = -21.25)
stockShelf({
    name: 'LEGO Classic Bricks', price: 20.00, description: 'A box of 484 classic LEGO bricks.', image: 'https://images.unsplash.com/photo-1555431189-0fabf2617799?q=80&w=400', category: 'Toys', size: [1.2, 0.8, 0.5], hint: 'lego box'
}, [-18, shelfY.low, -21.25], 8, 'x');

stockShelf({
    name: 'Barbie Dreamhouse', price: 179.00, description: 'The ultimate dollhouse with 3 stories.', image: 'https://images.unsplash.com/photo-1632722884579-2a133118e9c1?q=80&w=400', category: 'Toys', size: [2.5, 2.5, 1], hint: 'dollhouse box'
}, [-5, shelfY.top, -21.25], 2, 'x');

stockShelf({
    name: 'Nerf Elite 2.0 Blaster', price: 14.97, description: 'Includes 16 Nerf Elite darts.', image: 'https://images.unsplash.com/photo-1542045233-1329a7335459?q=80&w=400', category: 'Toys', size: [1.5, 0.8, 0.4], hint: 'toy gun box'
}, [0, shelfY.low, -21.25], 6, 'x');

stockShelf({
    name: 'Spalding Basketball', price: 15.88, description: 'Official size street basketball.', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400', category: 'Sporting Goods', size: [0.8, 0.8, 0.8], hint: 'basketball'
}, [10, shelfY.mid, -21.25], 8, 'x');

stockShelf({
    name: 'PlayStation 5', price: 499.99, description: 'The Sony PlayStation 5 console.', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400', category: 'Electronics', size: [1.2, 1.4, 0.6], hint: 'console box'
}, [-10, shelfY.high, -21.25], 4, 'x');

stockShelf({
    name: 'Wilson Football', price: 19.99, description: 'Official size NFL football.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400', category: 'Sporting Goods', size: [0.5, 0.5, 0.8], hint: 'american football'
}, [10, shelfY.low, -21.25], 10, 'x');


// --- Center Pallet Displays ---
const pepsiStackPos = { x: -4, y: sodaCaseSize[1] / 2, z: 15 };
for (let i = 0; i < 4; i++) { // height
  for (let j = 0; j < 4; j++) { // width
    for (let k = 0; k < 3; k++) { // depth
      products.push({
        id: currentId++,
        name: 'Pepsi 12-Pack (Display)',
        price: 5.98,
        description: 'A 12-pack of classic Pepsi cola.',
        image: 'https://i5.walmartimages.com/asr/44ae0c53-8880-4627-92ed-a7fcb2c76bbb.cf2b37989bb855161c5e558b43feef1e.jpeg', // Updated image link
        category: 'Groceries',
        position: [
          pepsiStackPos.x + j * sodaCaseSize[0],
          sodaCaseSize[1] / 2 + i * sodaCaseSize[1],
          pepsiStackPos.z + k * sodaCaseSize[2],
        ],
        size: sodaCaseSize,
        hint: 'pepsi case',
      });
    }
  }
}
const dewStackPos = { x: 2, y: sodaCaseSize[1] / 2, z: 15 };
for (let i = 0; i < 3; i++) { // height
  for (let j = 0; j < 3; j++) { // width
    for (let k = 0; k < 2; k++) { // depth
        products.push({
        id: currentId++,
        name: 'Mtn Dew 12-Pack (Display)',
        price: 5.98,
        description: 'A 12-pack of Mtn Dew soda.',
        image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=400',
        category: 'Groceries',
        position: [
          dewStackPos.x + j * sodaCaseSize[0],
          sodaCaseSize[1] / 2 + i * sodaCaseSize[1],
          dewStackPos.z + k * sodaCaseSize[2],
        ],
        size: sodaCaseSize,
        hint: 'mountain dew case',
      });
    }
  }
}


export const trendingProducts: string[] = [
  'onn. 50" TV',
  'Lays Classic Chips',
  'Great Value Milk',
  'LEGO Classic Bricks',
  'Spalding Basketball',
  'Apple AirPods',
  'Barbie Dreamhouse',
  'Pepsi 12-Pack',
  'Mtn Dew 12-Pack',
  'PlayStation 5',
  'Oreo Cookies',
  'Wilson Football'
];
