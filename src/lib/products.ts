
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
    // Add a bit of random offset to make it look more natural
    const spacing = (direction === 'z' ? baseProduct.size[2] : baseProduct.size[0]) + 0.1;
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

const aisleZStart = -18;
const aisleXStart = -18;

// --- AISLE 1: Groceries (x = -16) ---
// Left shelf is at x=[-16.75, -16], center is -16.375
// Right shelf is at x=[-16, -15.25], center is -15.625
const aisle1XLeft = -16.375;
const aisle1XRight = -15.625;


// Left Side (Cereal, Canned Goods, Pasta, Milk, Water)
stockShelf({ name: 'Honey Nut Cheerios', price: 4.12, description: 'A family size box of whole grain oat cereal.', image: 'https://target.scene7.com/is/image/Target/GUEST_2c7e3c7f-9e3b-4f8d-9e4d-2e4f9e3b3d4f?wid=488&hei=488&fmt=pjpeg', category: 'Groceries', size: [0.8, 1, 0.3], hint: 'cereal box' }, [aisle1XLeft, shelfY.top, aisleZStart], 20, 'z');
stockShelf({ name: 'Quaker Oats', price: 3.88, description: 'Old fashioned rolled oats.', image: 'https://i5.walmartimages.com/seo/Quaker-Old-Fashioned-Rolled-Oats-42-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.6, 0.8, 0.6], hint: 'oats container' }, [aisle1XLeft, shelfY.top, aisleZStart + 8], 25, 'z');
stockShelf({ name: 'Campbell\'s Tomato Soup', price: 1.50, description: 'Classic condensed tomato soup.', image: 'https://i5.walmartimages.com/seo/Campbell-s-Condensed-Tomato-Soup-10-75-oz-Can_a5264875-9c86-455b-8041-e4a89966d11a.2a4729424686411f185a2195e7c8441d.jpeg', category: 'Groceries', size: [0.3, 0.5, 0.3], hint: 'soup can' }, [aisle1XLeft, shelfY.high, aisleZStart], 40, 'z');
stockShelf({ name: 'Progresso Chicken Noodle', price: 2.50, description: 'Ready-to-serve chicken noodle soup.', image: 'https://i5.walmartimages.com/seo/Progresso-Traditional-Chicken-Noodle-Soup-19-oz_72591669-e092-4424-850c-e2f7596895e6.3986427303310d54c0e0e377668b9415.jpeg', category: 'Groceries', size: [0.4, 0.6, 0.4], hint: 'soup can' }, [aisle1XLeft, shelfY.high, aisleZStart + 15], 40, 'z');
stockShelf({ name: 'Spaghetti Pasta', price: 1.28, description: 'A box of classic spaghetti.', image: 'https://i5.walmartimages.com/seo/Great-Value-Spaghetti-Pasta-16-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.8, 0.2, 0.4], hint: 'pasta box' }, [aisle1XLeft, shelfY.mid, aisleZStart], 30, 'z');
stockShelf({ name: 'Marinara Sauce', price: 2.14, description: 'A jar of traditional marinara sauce.', image: 'https://i5.walmartimages.com/seo/Great-Value-Marinara-Pasta-Sauce-24-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.4, 0.7, 0.4], hint: 'sauce jar' }, [aisle1XLeft, shelfY.mid, aisleZStart + 15], 30, 'z');
stockShelf({ name: 'Great Value Milk', price: 3.5, description: 'Fresh and nutritious whole milk.', image: 'https://i5.walmartimages.com/seo/Great-Value-Whole-Milk-Gallon-128-fl-oz_5f8a1e1b-1e0c-4a4b-9c3c-8b6b8d9f6e0a.7c4b3e9c5e7c8b6b8d9f6e0a.jpeg', category: 'Groceries', size: [0.5, 1, 0.5], hint: 'milk carton' }, [aisle1XLeft, shelfY.low, aisleZStart], 30, 'z');
stockShelf({ name: 'Tropicana Orange Juice', price: 4.20, description: 'No-pulp orange juice.', image: 'https://i5.walmartimages.com/seo/Tropicana-Pure-Premium-Original-No-Pulp-Orange-Juice-52-fl-oz_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Groceries', size: [0.5, 0.8, 0.5], hint: 'juice carton' }, [aisle1XLeft, shelfY.low, aisleZStart + 18], 25, 'z');
stockShelf({ name: 'Aquafina Water 24-pack', price: 5.99, description: 'A 24-pack of purified drinking water.', image: 'https://i5.walmartimages.com/seo/Aquafina-Purified-Drinking-Water-16-9-oz-24-Pack-Bottles_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Groceries', size: [1.5, 0.8, 1], hint: 'water case' }, [aisle1XLeft, shelfY.bottom, aisleZStart], 12, 'z');
stockShelf({ name: 'Folgers Coffee', price: 9.98, description: 'Classic medium roast ground coffee.', image: 'https://i5.walmartimages.com/seo/Folgers-Classic-Roast-Medium-Roast-Ground-Coffee-22-6-oz-Canister_f54c9a5b-98e3-4f96-b9a5-59b5b2a0c6a5.e4f4a3e74e6484a8a5f4a4b4a3a5f4a5.jpeg', category: 'Groceries', size: [0.6, 0.8, 0.6], hint: 'coffee can' }, [aisle1XLeft, shelfY.mid, aisleZStart + 28], 15, 'z');


// Right Side (Snacks, Bread, Eggs)
stockShelf({ name: 'Lays Classic Chips', price: 3.50, description: 'A party size bag of classic potato chips.', image: 'https://i5.walmartimages.com/seo/Lay-s-Classic-Potato-Chips-Party-Size-13-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.8, 1, 0.4], hint: 'potato chips' }, [aisle1XRight, shelfY.top, aisleZStart], 20, 'z');
stockShelf({ name: 'Doritos Nacho Cheese', price: 3.50, description: 'A party size bag of Doritos.', image: 'https://i5.walmartimages.com/seo/Doritos-Nacho-Cheese-Flavored-Tortilla-Chips-Party-Size-15-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.8, 1, 0.4], hint: 'tortilla chips' }, [aisle1XRight, shelfY.top, aisleZStart + 10], 20, 'z');
stockShelf({ name: 'Oreo Cookies', price: 3.78, description: 'A family size pack of classic Oreo cookies.', image: 'https://i5.walmartimages.com/seo/Oreo-Chocolate-Sandwich-Cookies-Family-Size-19-1-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.7, 0.3, 0.2], hint: 'cookie package' }, [aisle1XRight, shelfY.high, aisleZStart], 40, 'z');
stockShelf({ name: 'Chips Ahoy!', price: 3.78, description: 'A family size pack of chocolate chip cookies.', image: 'https://i5.walmartimages.com/seo/Chips-Ahoy-Original-Chocolate-Chip-Cookies-Family-Size-18-2-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.7, 0.3, 0.2], hint: 'cookie package' }, [aisle1XRight, shelfY.high, aisleZStart + 12], 40, 'z');
stockShelf({ name: 'Great Value Bread', price: 2.24, description: 'Classic white sandwich bread.', image: 'https://i5.walmartimages.com/seo/Great-Value-White-Bread-20-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: [0.5, 0.5, 1], hint: 'bread loaf' }, [aisle1XRight, shelfY.mid, aisleZStart], 25, 'z');
stockShelf({ name: 'Jif Peanut Butter', price: 3.20, description: 'Creamy peanut butter.', image: 'https://i5.walmartimages.com/seo/Jif-Creamy-Peanut-Butter-16-oz-Jar_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Groceries', size: [0.5, 0.6, 0.5], hint: 'peanut butter jar' }, [aisle1XRight, shelfY.mid, aisleZStart + 22], 25, 'z');
stockShelf({ name: 'Great Value Eggs', price: 2.50, description: 'One dozen Grade A large eggs.', image: 'https://i5.walmartimages.com/seo/Great-Value-Large-White-Eggs-12-Count_6a2e4f9e-3b3d-4f8d-9e4d-2e4f9e3b3d4f.6a2e4f9e-3b3d-4f8d-9e4d-2e4f9e3b3d.jpeg', category: 'Groceries', size: [1, 0.4, 0.5], hint: 'egg carton' }, [aisle1XRight, shelfY.low, aisleZStart], 25, 'z');
stockShelf({ name: 'Kraft Singles Cheese', price: 4.50, description: 'American cheese slices.', image: 'https://i5.walmartimages.com/seo/Kraft-Singles-American-Cheese-Slices-16-ct-12-0-oz-Package_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Groceries', size: [0.6, 0.2, 0.6], hint: 'cheese package' }, [aisle1XRight, shelfY.low, aisleZStart + 22], 25, 'z');

// --- AISLE 2: Soda & Drinks (x = -8) ---
// Left shelf is at x=[-8.75, -8], center is -8.375
// Right shelf is at x=[-8, -7.25], center is -7.625
const aisle2XLeft = -8.375;
const aisle2XRight = -7.625;
const sodaCaseSize: [number, number, number] = [1.2, 0.4, 0.8];
stockShelf({ name: 'Coca-Cola 12-Pack', price: 5.98, description: 'A 12-pack of classic Coca-Cola.', image: 'https://i5.walmartimages.com/seo/Coca-Cola-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'coke case' }, [aisle2XRight, shelfY.bottom, aisleZStart], 15, 'z');
stockShelf({ name: 'Coca-Cola 12-Pack', price: 5.98, description: 'A 12-pack of classic Coca-Cola.', image: 'https://i5.walmartimages.com/seo/Coca-Cola-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'coke case' }, [aisle2XRight, shelfY.low, aisleZStart], 15, 'z');
stockShelf({ name: 'Pepsi 12-Pack', price: 5.98, description: 'A 12-pack of classic Pepsi cola.', image: 'https://i5.walmartimages.com/seo/Pepsi-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'pepsi case' }, [aisle2XRight, shelfY.bottom, aisleZStart + 20], 15, 'z');
stockShelf({ name: 'Pepsi 12-Pack', price: 5.98, description: 'A 12-pack of classic Pepsi cola.', image: 'https://i5.walmartimages.com/seo/Pepsi-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'pepsi case' }, [aisle2XRight, shelfY.low, aisleZStart + 20], 15, 'z');
stockShelf({ name: 'Dr Pepper 12-Pack', price: 5.98, description: 'A 12-pack of Dr Pepper soda.', image: 'https://i5.walmartimages.com/seo/Dr-Pepper-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'dr pepper case' }, [aisle2XLeft, shelfY.bottom, aisleZStart], 15, 'z');
stockShelf({ name: 'Dr Pepper 12-Pack', price: 5.98, description: 'A 12-pack of Dr Pepper soda.', image: 'https://i5.walmartimages.com/seo/Dr-Pepper-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'dr pepper case' }, [aisle2XLeft, shelfY.low, aisleZStart], 15, 'z');
stockShelf({ name: 'Mtn Dew 12-Pack', price: 5.98, description: 'A 12-pack of Mtn Dew soda.', image: 'https://i5.walmartimages.com/seo/Mountain-Dew-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'mountain dew case' }, [aisle2XLeft, shelfY.bottom, aisleZStart + 20], 15, 'z');
stockShelf({ name: 'Mtn Dew 12-Pack', price: 5.98, description: 'A 12-pack of Mtn Dew soda.', image: 'https://i5.walmartimages.com/seo/Mountain-Dew-Soda-12-Pack-12-fl-oz-Cans_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Groceries', size: sodaCaseSize, hint: 'mountain dew case' }, [aisle2XLeft, shelfY.low, aisleZStart + 20], 15, 'z');
stockShelf({ name: 'Monster Energy Drink', price: 2.20, description: '16 fl oz can of green Monster energy.', image: 'https://i5.walmartimages.com/seo/Monster-Energy-Green-Original-Energy-Drink-16-fl-oz-Can_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Groceries', size: [0.3, 0.7, 0.3], hint: 'energy drink can' }, [aisle2XLeft, shelfY.mid, aisleZStart], 45, 'z');
stockShelf({ name: 'Gatorade Variety Pack', price: 12.00, description: 'A pack of assorted Gatorade flavors.', image: 'https://i5.walmartimages.com/seo/Gatorade-Thirst-Quencher-Variety-Pack-20-fl-oz-12-Pack_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Groceries', size: [1.2, 0.9, 0.8], hint: 'gatorade pack' }, [aisle2XRight, shelfY.mid, aisleZStart], 15, 'z');
stockShelf({ name: 'Red Bull', price: 2.50, description: '8.4 fl oz can of Red Bull energy drink.', image: 'https://i5.walmartimages.com/seo/Red-Bull-Energy-Drink-8-4-fl-oz_dc8a8b5e-3d5f-4d3b-9a8f-0a5f5d8e7e1f.1f0f0e0f8c3b9b4a4c6e9d6d5d8e7e1f.jpeg', category: 'Groceries', size: [0.2, 0.6, 0.2], hint: 'energy drink can' }, [aisle2XLeft, shelfY.mid, aisleZStart + 15], 50, 'z');


// --- AISLE 3: Home Goods (x = 8) ---
// Left shelf is at x=[7.25, 8], center is 7.625
// Right shelf is at x=[8, 8.75], center is 8.375
const aisle3XLeft = 7.625;
const aisle3XRight = 8.375;
stockShelf({ name: 'Bounty Paper Towels', price: 15.99, description: 'Pack of 6 double rolls.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5mcSuu4pMo12ghImWxlHBJdtD73ieHpd5ZA&s', category: 'Home Goods', size: [1.5, 1, 0.8], hint: 'paper towels pack' }, [aisle3XLeft, shelfY.mid, aisleZStart], 15, 'z');
stockShelf({ name: 'Charmin Toilet Paper', price: 18.99, description: '18 mega rolls of ultra soft toilet paper.', image: 'https://images-cdn.ubuy.co.in/648e91fd996b35343931902c-charmin-ultra-strong-toilet-paper-6.jpg', category: 'Home Goods', size: [1.5, 1.5, 1.5], hint: 'toilet paper pack' }, [aisle3XLeft, shelfY.bottom, aisleZStart], 10, 'z');
stockShelf({ name: 'Tide Laundry Detergent', price: 12.99, description: 'Original scent liquid laundry detergent.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK-WADZvYD2Z0i9CQJ8PeAWmxdAGdA6--w1g&s', category: 'Home Goods', size: [0.8, 1.2, 0.6], hint: 'detergent bottle' }, [aisle3XLeft, shelfY.low, aisleZStart], 20, 'z');
stockShelf({ name: 'Clorox Disinfecting Wipes', price: 4.99, description: 'Crisp lemon scent disinfecting wipes.', image: 'https://i5.walmartimages.com/seo/Clorox-Disinfecting-Wipes-Bleach-Free-Cleaning-Wipes-Crisp-Lemon-75-Wipes_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Home Goods', size: [0.5, 0.7, 0.5], hint: 'wipes container' }, [aisle3XLeft, shelfY.high, aisleZStart], 40, 'z');
stockShelf({ name: 'Mainstays Bath Towel', price: 4.97, description: 'Soft and absorbent 100% cotton bath towel.', image: 'https://i5.walmartimages.com/seo/Mainstays-Bath-Towel-Blue-27-x-52-in_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Home Goods', size: [1, 0.2, 0.8], hint: 'folded towel' }, [aisle3XRight, shelfY.low, aisleZStart], 25, 'z');
stockShelf({ name: 'T-fal Cookware Set', price: 69.99, description: '18-piece nonstick cookware set.', image: 'https://www.kroger.com/product/images/xlarge/front/0003240606565', category: 'Home Goods', size: [1.5, 1.2, 1.5], hint: 'cookware set box' }, [aisle3XRight, shelfY.top, aisleZStart], 8, 'z');
stockShelf({ name: 'George Foreman Grill', price: 29.99, description: 'Classic plate grill for 2 servings.', image: 'https://i5.walmartimages.com/seo/George-Foreman-2-Serving-Classic-Plate-Grill-and-Panini-Press-Black-GR10B_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Home Goods', size: [1, 0.8, 1], hint: 'grill box' }, [aisle3XRight, shelfY.high, aisleZStart], 15, 'z');
stockShelf({ name: 'Oster Blender', price: 24.96, description: 'A powerful 6-speed kitchen blender.', image: 'https://i5.walmartimages.com/seo/Oster-6-Speed-Blender-Black-006878_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Home Goods', size: [0.6, 0.8, 0.6], hint: 'blender box' }, [aisle3XRight, shelfY.mid, aisleZStart], 20, 'z');
stockShelf({ name: 'Hefty Trash Bags', price: 8.99, description: '30-gallon large trash bags, 40 count.', image: 'https://i5.walmartimages.com/seo/Hefty-Strong-Large-Trash-Bags-30-Gallon-40-Count_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Home Goods', size: [0.8, 0.8, 0.3], hint: 'trash bags box' }, [aisle3XLeft, shelfY.high, aisleZStart + 25], 25, 'z');
stockShelf({ name: 'Febreze Air Freshener', price: 2.97, description: 'Linen & Sky scent air freshener spray.', image: 'https://i5.walmartimages.com/seo/Febreze-AIR-Air-Refresher-Linen-Sky-Scent-8-8-oz_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Home Goods', size: [0.3, 0.8, 0.3], hint: 'air freshener' }, [aisle3XRight, shelfY.top, aisleZStart + 12], 40, 'z');


// --- AISLE 4: Pharmacy, Personal Care, Apparel (x = 16) ---
// Left shelf is at x=[15.25, 16], center is 15.625
// Right shelf is at x=[16, 16.75], center is 16.375
const aisle4XLeft = 15.625;
const aisle4XRight = 16.375;
stockShelf({ name: 'Equate Ibuprofen', price: 8.98, description: 'Pain reliever/fever reducer. 200mg tablets.', image: 'https://i5.walmartimages.com/seo/Equate-Ibuprofen-Tablets-200mg-500-Count_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Pharmacy', size: [0.3, 0.5, 0.3], hint: 'medicine bottle' }, [aisle4XLeft, shelfY.low, aisleZStart], 45, 'z');
stockShelf({ name: 'Equate Allergy Relief', price: 12.48, description: '24-hour non-drowsy allergy relief tablets.', image: 'https://i5.walmartimages.com/seo/Equate-Allergy-Relief-Tablets-10mg-30-Count_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Pharmacy', size: [0.3, 0.5, 0.3], hint: 'medicine box' }, [aisle4XLeft, shelfY.low, aisleZStart + 15], 45, 'z');
stockShelf({ name: 'Neutrogena Face Wash', price: 8.49, description: 'Hydro Boost hydrating facial cleansing gel.', image: 'https://i5.walmartimages.com/seo/Neutrogena-Hydro-Boost-Hydrating-Facial-Cleansing-Gel-6-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Personal Care', size: [0.3, 0.8, 0.3], hint: 'face cleanser' }, [aisle4XRight, shelfY.mid, aisleZStart], 35, 'z');
stockShelf({ name: 'CeraVe Moisturizer', price: 14.99, description: 'Moisturizing cream for face and body.', image: 'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-for-Normal-to-Dry-Skin-16-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Personal Care', size: [0.6, 0.5, 0.6], hint: 'lotion jar' }, [aisle4XRight, shelfY.mid, aisleZStart + 12], 25, 'z');
stockShelf({ name: 'Colgate Toothpaste', price: 3.49, description: 'Cavity protection fluoride toothpaste.', image: 'https://i5.walmartimages.com/seo/Colgate-Cavity-Protection-Fluoride-Toothpaste-6-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Personal Care', size: [0.8, 0.2, 0.15], hint: 'toothpaste box' }, [aisle4XRight, shelfY.low, aisleZStart], 45, 'z');
stockShelf({ name: 'Banana Boat Sunscreen', price: 7.97, description: 'SPF 50 broad spectrum sport sunscreen lotion.', image: 'https://i5.walmartimages.com/seo/Banana-Boat-Sport-Ultra-SPF-50-Sunscreen-Lotion-8-oz_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Personal Care', size: [0.3, 0.8, 0.3], hint: 'sunscreen bottle' }, [aisle4XRight, shelfY.low, aisleZStart + 20], 35, 'z');
stockShelf({ name: 'Hanes T-Shirt', price: 6.0, description: 'Comfortable 100% cotton crewneck t-shirt.', image: 'https://i5.walmartimages.com/seo/Hanes-Men-s-ComfortSoft-Short-Sleeve-T-Shirt-White-XL_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Apparel', size: [0.8, 0.1, 1], hint: 'folded shirt' }, [aisle4XLeft, shelfY.mid, aisleZStart], 25, 'z');
stockShelf({ name: 'Wrangler Mens Jeans', price: 19.98, description: 'Regular fit straight leg jeans for men.', image: 'https://i5.walmartimages.com/seo/Wrangler-Men-s-Regular-Fit-Jeans-Medium-Wash-34x32_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Apparel', size: [0.8, 0.1, 1], hint: 'folded jeans' }, [aisle4XLeft, shelfY.high, aisleZStart], 25, 'z');
stockShelf({ name: 'Secret Deodorant', price: 5.47, description: 'Invisible solid antiperspirant and deodorant.', image: 'https://i5.walmartimages.com/seo/Secret-Outlast-XTend-Invisible-Solid-Antiperspirant-Deodorant-Completely-Clean-2-6-oz_a2b3b7c8-2b8a-4b7e-9b0a-7b3b7c8a2b3b.7b3b7c8a2b3b7c8a2b3b7c8a2b3b.jpeg', category: 'Personal Care', size: [0.4, 0.6, 0.2], hint: 'deodorant stick' }, [aisle4XRight, shelfY.high, aisleZStart], 35, 'z');
stockShelf({ name: 'Hanes Mens Socks', price: 10.98, description: '12-pack of white crew socks.', image: 'https://i5.walmartimages.com/seo/Hanes-Men-s-Crew-Socks-12-Pack_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Apparel', size: [0.8, 0.2, 0.6], hint: 'packaged socks' }, [aisle4XLeft, shelfY.bottom, aisleZStart], 35, 'z');

// --- Back Aisle: Electronics, Toys, Sporting Goods (z = -30) ---
// Back shelf is at z=[-30.75, -30], center is -30.375
// Front shelf is at z=[-30, -29.25], center is -29.625
const backAisleZBack = -30.375;
const backAisleZFront = -29.625;
stockShelf({ name: 'onn. 50" TV', price: 198.0, description: '50" Class 4K UHD LED Roku Smart TV.', image: 'https://i5.walmartimages.com/seo/onn-50-Class-4K-UHD-LED-Roku-Smart-TV-HDR-100012585_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Electronics', size: [4.5, 2.5, 0.2], hint: 'television box' }, [aisleXStart, shelfY.mid, backAisleZBack], 8, 'x');
stockShelf({ name: 'PlayStation 5', price: 499.99, description: 'The Sony PlayStation 5 console.', image: 'https://m.media-amazon.com/images/I/619BkvKW35L._AC_SL1500_.jpg', category: 'Electronics', size: [1.2, 1.4, 0.6], hint: 'console box' }, [aisleXStart, shelfY.high, backAisleZBack], 10, 'x');
stockShelf({ name: 'Apple AirPods', price: 129.00, description: '2nd Gen Apple AirPods w/ Charging Case.', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MV7N2?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1551489688005', category: 'Electronics', size: [0.3, 0.4, 0.3], hint: 'airpods box' }, [aisleXStart + 15, shelfY.low, backAisleZBack], 25, 'x');
stockShelf({ name: 'onn. Bluetooth Speaker', price: 20.00, description: 'Portable bluetooth speaker.', image: 'https://i5.walmartimages.com/seo/onn-Portable-Bluetooth-Speaker-Black-100008734_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Electronics', size: [0.8, 0.5, 0.4], hint: 'speaker box' }, [aisleXStart + 22, shelfY.low, backAisleZBack], 25, 'x');
stockShelf({ name: 'LEGO Classic Bricks', price: 20.00, description: 'A box of 484 classic LEGO bricks.', image: 'https://target.scene7.com/is/image/Target/GUEST_4c7e3c7f-9e3b-4f8d-9e4d-2e4f9e3b3d4f?wid=488&hei=488&fmt=pjpeg', category: 'Toys', size: [1.2, 0.8, 0.5], hint: 'lego box' }, [aisleXStart, shelfY.low, backAisleZFront], 18, 'x');
stockShelf({ name: 'Barbie Dreamhouse', price: 179.00, description: 'The ultimate dollhouse with 3 stories.', image: 'https://i5.walmartimages.com/seo/Barbie-Dreamhouse-Dollhouse-with-75-Accessories_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Toys', size: [2.5, 2.5, 1], hint: 'dollhouse box' }, [aisleXStart + 25, shelfY.top, backAisleZFront], 5, 'x');
stockShelf({ name: 'Nerf Elite 2.0 Blaster', price: 14.97, description: 'Includes 16 Nerf Elite darts.', image: 'https://i5.walmartimages.com/seo/Nerf-Elite-2-0-Commander-RD-6-Blaster-16-Darts_1e4d2e4f-9e3b-3d4f-8d9e-4d2e4f9e3b3d.1e4d2e4f9e3b3d4f8d9e-4d2e4f9e3b3d.jpeg', category: 'Toys', size: [1.5, 0.8, 0.4], hint: 'toy gun box' }, [aisleXStart, shelfY.mid, backAisleZFront], 15, 'x');
stockShelf({ name: 'Spalding Basketball', price: 15.88, description: 'Official size street basketball.', image: 'https://m.media-amazon.com/images/I/91A90PxvHHL.jpg', category: 'Sporting Goods', size: [0.8, 0.8, 0.8], hint: 'basketball' }, [aisleXStart + 25, shelfY.mid, backAisleZFront], 20, 'x');
stockShelf({ name: 'Wilson Football', price: 19.99, description: 'Official size NFL football.', image: 'https://m.media-amazon.com/images/I/71zW5vX+5eL._AC_UF894,1000_QL80_.jpg', category: 'Sporting Goods', size: [0.5, 0.5, 0.8], hint: 'american football' }, [aisleXStart + 25, shelfY.low, backAisleZFront], 20, 'x');
stockShelf({ name: 'Ozark Trail Tent', price: 49.99, description: '4-person dome tent.', image: 'https://m.media-amazon.com/images/I/41kblBniEIL._UF894,1000_QL80_.jpg', category: 'Outdoors', size: [1, 1, 1], hint: 'camping tent package' }, [aisleXStart + 40, shelfY.top, backAisleZBack], 8, 'x');
stockShelf({ name: 'Coleman Cooler', price: 24.98, description: '48-Quart Performance 3-Day Cooler.', image: 'https://m.media-amazon.com/images/I/81Aj3l4V-GL._UF894,1000_QL80_.jpg', category: 'Outdoors', size: [1.5, 1.2, 1.2], hint: 'beverage cooler' }, [aisleXStart + 40, shelfY.bottom, backAisleZBack], 8, 'x');
stockShelf({ name: 'Nintendo Switch', price: 299.00, description: 'Nintendo Switch with Neon Blue and Neon Red Joy-Con.', image: 'https://m.media-amazon.com/images/I/41V5KQ500IL._UF894,1000_QL80_.jpg', category: 'Electronics', size: [1, 0.6, 0.4], hint: 'console box' }, [aisleXStart + 15, shelfY.high, backAisleZBack], 15, 'x');


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
        image: 'https://www.instacart.com/image-server/1864x1864/www.instacart.com/assets/domains/product-image/file/large_51a0ef1f-5477-49aa-97f9-5a51fa2b2210.png',
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
        image: 'https://images.albertsons-media.com/is/image/ABS/108050448-C1N1?$ng-ecom-pdp-desktop$&defaultImage=Not_Available',
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
const waterCaseSize: [number, number, number] = [1.5, 0.8, 1];
const waterStackPos = { x: -4, y: waterCaseSize[1] / 2, z: 0 };
for (let i = 0; i < 5; i++) { // height
  for (let j = 0; j < 4; j++) { // width
    for (let k = 0; k < 3; k++) { // depth
        products.push({
        id: currentId++,
        name: 'Aquafina Water (Display)',
        price: 5.99,
        description: 'A 24-pack of purified drinking water.',
        image: 'https://5.imimg.com/data5/WX/NX/CQ/GLADMIN-22143586/00012000504044-c1n1-thumbnail-e4a6b516c74c42558b163ce9f0162871-500x500-500x500.jpg',
        category: 'Groceries',
        position: [
          waterStackPos.x + j * waterCaseSize[0],
          waterCaseSize[1] / 2 + i * waterCaseSize[1],
          waterStackPos.z + k * waterCaseSize[2],
        ],
        size: waterCaseSize,
        hint: 'water case',
      });
    }
  }
}

// --- Produce Bins Displays ---
const addProducePile = (baseProduct: Omit<Product, 'id' | 'position'>, center: [number, number, number], pileSize: [number, number], count: number) => {
  for (let i = 0; i < count; i++) {
    const x = center[0] + (Math.random() - 0.5) * pileSize[0];
    const z = center[2] + (Math.random() - 0.5) * pileSize[1];
    const y = center[1] + baseProduct.size[1] / 2 + (Math.random() * 0.2); // y is surface + half height + random pile height

    products.push({
      ...baseProduct,
      id: currentId++,
      position: [x, y, z]
    });
  }
};

const binSurfaceY = 1.0;
const binPileSize: [number, number] = [7, 3.5];

// Bin 1: Green Peppers & Bananas
addProducePile({
    name: 'Green Bell Pepper',
    price: 0.78,
    description: 'A fresh, crisp green bell pepper.',
    image: 'https://i5.walmartimages.com/seo/Fresh-Green-Bell-Pepper-each_fbd3a5d6-e045-4313-a256-19e0544de55e.e883e4a3c1032544de60fe85c13e2154.jpeg',
    category: 'Produce',
    size: [0.3, 0.4, 0.3],
    hint: 'green pepper'
}, [-14, binSurfaceY, 30], [3.5, binPileSize[1]], 40);

addProducePile({
    name: 'Banana',
    price: 0.21,
    description: 'A single fresh banana.',
    image: 'https://i5.walmartimages.com/seo/Banana-Each_d50b4a45-b844-42b1-a20c-035a3d7ac5de.3f60f69a5332f1702c2e144a024564b7.jpeg',
    category: 'Produce',
    size: [0.2, 0.1, 0.6],
    hint: 'banana'
}, [-10, binSurfaceY, 30], [3.5, binPileSize[1]], 60);

// Bin 2: Apples & Oranges
addProducePile({
    name: 'Red Apple',
    price: 0.54,
    description: 'A crisp and sweet red delicious apple.',
    image: 'https://i5.walmartimages.com/seo/Red-Delicious-Apple-each_a84a6943-2549-434e-986c-fb301844e99f.45837264197825d53a9254b419139265.jpeg',
    category: 'Produce',
    size: [0.3, 0.3, 0.3],
    hint: 'red apple'
}, [-2, binSurfaceY, 30], [3.5, binPileSize[1]], 50);

addProducePile({
    name: 'Navel Orange',
    price: 0.88,
    description: 'A sweet and juicy navel orange.',
    image: 'https://i5.walmartimages.com/seo/Navel-Orange-Each_a8ba424a-74a2-4a31-af97-2313a5f76e33.1f666b696f5b96791e8476a6b528434a.jpeg',
    category: 'Produce',
    size: [0.3, 0.3, 0.3],
    hint: 'orange fruit'
}, [2, binSurfaceY, 30], [3.5, binPileSize[1]], 50);

// Bin 3: Pineapples & Lettuce
addProducePile({
    name: 'Pineapple',
    price: 2.98,
    description: 'A sweet, tropical pineapple.',
    image: 'https://i5.walmartimages.com/seo/Pineapple-Each_2d3f745e-5231-450f-b258-292a4663730e.9bb168853b84347efe089531872111e3.jpeg',
    category: 'Produce',
    size: [0.6, 1.0, 0.6],
    hint: 'pineapple'
}, [10, binSurfaceY, 30], [3.5, binPileSize[1]], 15);

addProducePile({
    name: 'Iceberg Lettuce',
    price: 1.98,
    description: 'A crisp head of iceberg lettuce.',
    image: 'https://i5.walmartimages.com/seo/Fresh-Iceberg-Lettuce-Each_a124c779-7127-41f2-b883-ac38867a5b3e.4b3602166699252c50268a25a3d7aa38.jpeg',
    category: 'Produce',
    size: [0.6, 0.5, 0.6],
    hint: 'lettuce head'
}, [14, binSurfaceY, 30], [3.5, binPileSize[1]], 20);


export const trendingProducts: string[] = [
  'onn. 50" TV',
  'Lays Classic Chips',
  'Great Value Milk',
  'LEGO Classic Bricks',
  'Banana',
  'Apple AirPods',
  'Barbie Dreamhouse',
  'Pineapple',
  'Pepsi 12-Pack',
  'PlayStation 5',
  'Tide Laundry Detergent',
  'Coca-Cola 12-Pack',
  'Red Apple',
  'Wrangler Mens Jeans',
  'Nintendo Switch',
];
