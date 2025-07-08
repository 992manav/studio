import type { Product } from "./types";

export const products: Product[] = [];
let currentId = 1;

// Shelf tops (y): ~0.025, 1.175, 2.325, 3.475. Add half of product height.
// These values are calculated from ThreeScene.tsx createAisle function
const shelfY = {
  bottom: 0.025, // floor level
  low: 1.175,
  mid: 2.325,
  high: 3.475,
};

const stockShelf = (
  baseProduct: Omit<Product, "id" | "position">,
  startPos: [number, number, number],
  count: number,
  direction: "x" | "z"
) => {
  for (let i = 0; i < count; i++) {
    const position: [number, number, number] = [...startPos];
    // Add a bit of random offset to make it look more natural
    const spacing =
      (direction === "z" ? baseProduct.size[2] : baseProduct.size[0]) + 0.1;
    if (direction === "z") {
      position[2] += i * spacing;
    } else {
      position[0] += i * spacing;
    }

    products.push({
      ...baseProduct,
      id: currentId++,
      position: [
        position[0],
        position[1] + baseProduct.size[1] / 2 - 0.05,
        position[2],
      ],
    });
  }
};

const aisleZStart = -18;

// --- AISLE 1: Groceries (x = -16) ---
const aisle1XLeft = -17.8; // Left side of aisle 1
const aisle1XRight = -14.2; // Right side of aisle 1

// Left Side
stockShelf(
  { name: "Honey Nut Cheerios", price: 4.12, description: "A family size box of whole grain oat cereal.", image: "https://cdn.shopify.com/s/files/1/0266/4075/2726/products/cheerios_1024x1024.png", category: "Groceries", size: [0.8, 1, 0.3], hint: "cereal box" },
  [aisle1XLeft, shelfY.high, aisleZStart], 8, "z"
);
stockShelf(
  { name: "Campbell's Tomato Soup", price: 1.5, description: "Classic condensed tomato soup.", image: "https://cdn.shopify.com/s/files/1/0266/4075/2726/products/campbells-soup_1024x1024.png", category: "Groceries", size: [0.3, 0.5, 0.3], hint: "soup can" },
  [aisle1XLeft, shelfY.mid, aisleZStart], 10, "z"
);
stockShelf(
  { name: "Spaghetti Pasta", price: 1.28, description: "A box of classic spaghetti.", image: "https://i5.walmartimages.com/seo/Great-Value-Spaghetti-16-oz_b3598528-2231-4e48-b445-6a58f7f2b053.a973a98075abe21396a570d55fac158d.jpeg", category: "Groceries", size: [0.8, 0.2, 0.4], hint: "pasta box" },
  [aisle1XLeft, shelfY.low, aisleZStart], 10, "z"
);

// Right Side
stockShelf(
  { name: "Lays Classic Chips", price: 3.5, description: "A party size bag of classic potato chips.", image: "https://images.squarespace-cdn.com/content/v1/5e73e506323a8f2617853507/9018ca92-3b95-426c-8ccf-3d3065f5a0ce/lays-classiic-potato-chips-min.png", category: "Groceries", size: [0.8, 1, 0.4], hint: "potato chips" },
  [aisle1XRight, shelfY.high, aisleZStart], 8, "z"
);
stockShelf(
  { name: "Oreo Cookies", price: 3.78, description: "A family size pack of classic Oreo cookies.", image: "https://www.pantry24.de/wp-content/uploads/2023/02/Oreo-170g.jpg", category: "Groceries", size: [0.7, 0.3, 0.2], hint: "cookie package" },
  [aisle1XRight, shelfY.mid, aisleZStart], 10, "z"
);
stockShelf(
  { name: "Great Value Bread", price: 2.24, description: "Classic white sandwich bread.", image: "https://i5.walmartimages.com/asr/fd804f80-f09b-44c5-b02c-c7ab592b12f3.32fa78c99c51e374a327a1743e83d4f9.jpeg", category: "Groceries", size: [0.5, 0.5, 1], hint: "bread loaf" },
  [aisle1XRight, shelfY.low, aisleZStart], 6, "z"
);

// --- AISLE 2: Soda & Drinks (x = -8) ---
const aisle2XLeft = -9.8;
const aisle2XRight = -6.2;
const sodaCaseSize: [number, number, number] = [1.2, 0.4, 0.8];
stockShelf(
  { name: "Coca-Cola 12-Pack", price: 5.98, description: "A 12-pack of classic Coca-Cola.", image: "https://i5.walmartimages.com/seo/Coca-Cola-Classic-Soda-Pop-12-fl-oz-12-Pack-Cans_0b3e7f4e-9ea1-487a-85b5-555546dff42f.a465f13f99a6f1406541f544a434193b.jpeg", category: "Groceries", size: sodaCaseSize, hint: "coke case" },
  [aisle2XRight, shelfY.low, aisleZStart], 12, "z"
);
stockShelf(
  { name: "Pepsi 12-Pack", price: 5.98, description: "A 12-pack of classic Pepsi cola.", image: "https://i0.wp.com/www.printmag.com/wp-content/uploads/2023/03/Screen-Shot-2023-03-30-at-12.00.38-PM.png?fit=1568%2C650&quality=80&ssl=1", category: "Groceries", size: sodaCaseSize, hint: "pepsi case" },
  [aisle2XRight, shelfY.mid, aisleZStart], 12, "z"
);
stockShelf(
  { name: "Dr Pepper 12-Pack", price: 5.98, description: "A 12-pack of Dr Pepper soda.", image: "https://i5.walmartimages.com/seo/Dr-Pepper-Soda-12-pk-12-fl-oz_14532551-36f7-4a43-9023-f36894c1a5b8.81f21a5a3a726ea72483864f7b607065.jpeg", category: "Groceries", size: sodaCaseSize, hint: "dr pepper case" },
  [aisle2XLeft, shelfY.low, aisleZStart], 12, "z"
);
stockShelf(
  { name: "Mtn Dew 12-Pack", price: 5.98, description: "A 12-pack of Mtn Dew soda.", image: "https://i5.walmartimages.com/seo/Mtn-Dew-Soda-Pop-12-fl-oz-12-Pack-Cans_6a7a69b7-3b2d-4db9-a83d-3392d04a43a0.47d010d293856a9e1e79383638c44415.jpeg", category: "Groceries", size: sodaCaseSize, hint: "mountain dew case" },
  [aisle2XLeft, shelfY.mid, aisleZStart], 12, "z"
);

// --- AISLE 3: Home Goods (x = 8) ---
const aisle3XLeft = 6.2;
const aisle3XRight = 9.8;
stockShelf(
  { name: "Bounty Paper Towels", price: 15.99, description: "Pack of 6 double rolls.", image: "https://tse2.mm.bing.net/th/id/OIP.5fmIz95FOnU2JwZjb6ZLpgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", category: "Home Goods", size: [1.2, 1, 0.6], hint: "paper towels pack" },
  [aisle3XLeft, shelfY.low, aisleZStart], 12, "z"
);
stockShelf(
  { name: "Tide Laundry Detergent", price: 12.99, description: "Original scent liquid laundry detergent.", image: "https://i5.walmartimages.com/seo/Tide-Original-Scent-Liquid-Laundry-Detergent-46-fl-oz-32-Loads_8f8e873c-f64f-4d33-875c-f7d18a7ce8b2.7a2849b282713916d3f2b1860e6e44b8.jpeg", category: "Home Goods", size: [0.8, 1.2, 0.6], hint: "detergent bottle" },
  [aisle3XLeft, shelfY.bottom, aisleZStart], 10, "z"
);
stockShelf(
  { name: "Clorox Disinfecting Wipes", price: 4.99, description: "Crisp lemon scent disinfecting wipes.", image: "https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/9/1/91RhF8-w9eL._AC_SL1500_.jpg", category: "Home Goods", size: [0.5, 0.7, 0.5], hint: "wipes container" },
  [aisle3XRight, shelfY.high, aisleZStart], 15, "z"
);

// --- AISLE 4: Pharmacy, Personal Care, Apparel (x = 16) ---
const aisle4XLeft = 14.2;
const aisle4XRight = 17.8;
stockShelf(
  { name: "Equate Ibuprofen", price: 8.98, description: "Pain reliever/fever reducer. 200mg tablets.", image: "https://i5.walmartimages.com/seo/Equate-Ibuprofen-Pain-Reliever-Fever-Reducer-Tablets-200-mg-500-Count_a6639695-8a2a-4fb4-89d4-1a3b01859846.1098d626e2579ac69c4c7953266a27e7.jpeg", category: "Pharmacy", size: [0.4, 0.6, 0.4], hint: "medicine bottle" },
  [aisle4XRight, shelfY.low, aisleZStart], 15, "z"
);
stockShelf(
  { name: "Hanes T-Shirt", price: 6.0, description: "Comfortable 100% cotton crewneck t-shirt.", image: "https://i5.walmartimages.com/seo/Hanes-Men-s-and-Big-Men-s-Short-Sleeve-Beefy-T-Shirt-Up-to-Size-3XL_a39b5e35-90b9-4d6a-a53c-88ad3e84df9a.14659b023f101e403487c94d13b5d1e4.jpeg", category: "Apparel", size: [0.8, 0.1, 1], hint: "folded shirt" },
  [aisle4XLeft, shelfY.mid, aisleZStart], 15, "z"
);
stockShelf(
  { name: "Colgate Toothpaste", price: 3.49, description: "Cavity protection fluoride toothpaste.", image: "https://i5.walmartimages.com/seo/Colgate-Cavity-Protection-Anticavity-Fluoride-Toothpaste-Great-Regular-Flavor-6-oz-Tube_a27b872b-8b5e-4b71-acc3-60b77764b8a2.b8793b80b7a86f1e8e24e12c0199f7d0.jpeg", category: "Personal Care", size: [0.8, 0.2, 0.15], hint: "toothpaste box" },
  [aisle4XRight, shelfY.high, aisleZStart], 20, "z"
);

// --- Back Aisle: Electronics, Toys, Sporting Goods (z = -22) ---
const backAisleZBack = -23.8;
const backAisleZFront = -20.2;
const backAisleXStart = -18;
stockShelf(
  { name: 'onn. 50" TV', price: 198.0, description: '50" Class 4K UHD LED Roku Smart TV.', image: "https://i5.walmartimages.com/seo/onn-50-Class-4K-UHD-2160P-LED-Roku-Smart-TV-HDR-100012585_a334f553-6058-450f-a968-b783f9872580.893c527cbfed8f0b7b12d1b822212f30.jpeg", category: "Electronics", size: [4.5, 2.5, 0.2], hint: "television box" },
  [backAisleXStart, shelfY.low, backAisleZBack], 8, "x"
);
stockShelf(
  { name: "LEGO Classic Bricks", price: 20.0, description: "A box of 484 classic LEGO bricks.", image: "https://digilego.com/wp-content/uploads/2021/10/Lego-Logo-Color-Feature.jpg", category: "Toys", size: [1.2, 0.8, 0.5], hint: "lego box" },
  [backAisleXStart, shelfY.bottom, backAisleZFront], 12, "x"
);
stockShelf(
  { name: "Spalding Basketball", price: 15.88, description: "Official size street basketball.", image: "https://tse3.mm.bing.net/th/id/OIP.6wWrH6g6FnhKQku3nqlt2gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", category: "Sporting Goods", size: [0.8, 0.8, 0.8], hint: "basketball" },
  [backAisleXStart + 25, shelfY.low, backAisleZFront], 10, "x"
);

// --- Pallet Displays ---
const displayZ = 15;
const pepsiStackPos = { x: -10, y: sodaCaseSize[1] / 2, z: displayZ };
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 2; k++) {
      products.push({ id: currentId++, name: "Pepsi 12-Pack (Display)", price: 5.98, description: "A 12-pack of classic Pepsi cola.", image: "https://i0.wp.com/www.printmag.com/wp-content/uploads/2023/03/Screen-Shot-2023-03-30-at-12.00.38-PM.png?fit=1568%2C650&quality=80&ssl=1", category: "Groceries", position: [pepsiStackPos.x + j * sodaCaseSize[0], sodaCaseSize[1] / 2 + i * sodaCaseSize[1], pepsiStackPos.z + k * sodaCaseSize[2],], size: sodaCaseSize, hint: "pepsi case", });
    }
  }
}

const waterCaseSize: [number, number, number] = [1.5, 0.8, 1];
const waterStackPos = { x: 10, y: waterCaseSize[1] / 2, z: displayZ };
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 2; k++) {
      products.push({ id: currentId++, name: "Aquafina Water (Display)", price: 5.99, description: "A 24-pack of purified drinking water.", image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/4aed4b179665855.64fdf1079be28.png", category: "Groceries", position: [waterStackPos.x + j * waterCaseSize[0], waterCaseSize[1] / 2 + i * waterCaseSize[1], waterStackPos.z + k * waterCaseSize[2],], size: waterCaseSize, hint: "water case", });
    }
  }
}

// --- Produce Bins Displays ---
const addProducePile = (
  baseProduct: Omit<Product, "id" | "position">,
  center: [number, number, number],
  pileSize: [number, number],
  count: number
) => {
  for (let i = 0; i < count; i++) {
    const x = center[0] + (Math.random() - 0.5) * pileSize[0];
    const z = center[2] + (Math.random() - 0.5) * pileSize[1];
    const y = center[1] + baseProduct.size[1] / 2 + Math.random() * 0.08;

    products.push({
      ...baseProduct,
      id: currentId++,
      position: [x, y, z],
    });
  }
};

const binSurfaceY = 1.0;
const produceBinZ = 20;

addProducePile(
  { name: "Banana", price: 0.21, description: "A single fresh banana.", image: "https://files.merca20.com/uploads/2021/08/one-a-day-bananas-packaging.jpg", category: "Produce", size: [0.2, 0.1, 0.6], hint: "banana" },
  [-12, binSurfaceY, produceBinZ], [3.5, 3.5], 30
);
addProducePile(
  { name: "Red Apple", price: 0.54, description: "A crisp and sweet red delicious apple.", image: "https://4.imimg.com/data4/JX/WJ/ANDROID-16294238/product-1000x1000.jpeg", category: "Produce", size: [0.3, 0.3, 0.3], hint: "red apple" },
  [0, binSurfaceY, produceBinZ], [3.5, 3.5], 25
);
addProducePile(
  { name: "Navel Orange", price: 0.88, description: "A sweet and juicy navel orange.", image: "https://img06.weeecdn.com/product/image/187/337/35B5E8830448B7D5.png", category: "Produce", size: [0.3, 0.3, 0.3], hint: "orange fruit" },
  [12, binSurfaceY, produceBinZ], [3.5, 3.5], 25
);

// --- EXTRA PRODUCTS FOR DEMO ---
stockShelf(
  { name: "Nutella", price: 3.99, description: "Chocolate hazelnut spread.", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Nutella_450g.png", category: "Groceries", size: [0.5, 0.6, 0.5], hint: "nutella jar" },
  [aisle1XLeft, shelfY.mid, aisleZStart + 5], 8, "z"
);
stockShelf(
  { name: "Sprite Can", price: 1.10, description: "Refreshing lemon-lime soda.", image: "https://www.pngall.com/wp-content/uploads/12/Sprite-Can-PNG-Image.png", category: "Drinks", size: [0.3, 0.5, 0.3], hint: "sprite can" },
  [aisle2XRight, shelfY.high, aisleZStart + 8], 10, "z"
);
stockShelf(
  { name: "Pringles Original", price: 2.50, description: "Crispy potato chips in a can.", image: "https://www.pngall.com/wp-content/uploads/12/Pringles-PNG-Image.png", category: "Snacks", size: [0.4, 0.8, 0.4], hint: "pringles can" },
  [aisle1XRight, shelfY.low, aisleZStart + 12], 6, "z"
);

export const trendingProducts: string[] = [
  'onn. 50" TV',
  "Lays Classic Chips",
  "Great Value Milk",
  "LEGO Classic Bricks",
  "Banana",
  "Apple AirPods",
  "Barbie Dreamhouse",
  "Pineapple",
  "Pepsi 12-Pack",
  "PlayStation 5",
  "Tide Laundry Detergent",
  "Coca-Cola 12-Pack",
  "Red Apple",
  "Wrangler Mens Jeans",
  "Nintendo Switch",
];
