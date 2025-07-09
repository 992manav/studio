
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
const backAisleXStart = -18;

// --- AISLE 1: Groceries (x = -16) ---
const aisle1XLeft = -17.0;
const aisle1XRight = -15.0;

// Left Side
stockShelf(
  { name: "Honey Nut Cheerios", price: 4.12, description: "A family size box of whole grain oat cereal.", image: "https://cdn.shopify.com/s/files/1/0266/4075/2726/products/cheerios_1024x1024.png", category: "Groceries", size: [0.8, 1, 0.3], hint: "cereal box" },
  [aisle1XLeft, shelfY.high, aisleZStart], 80, "z"
);
stockShelf(
  { name: "Campbell's Tomato Soup", price: 1.5, description: "Classic condensed tomato soup.", image: "https://cdn.shopify.com/s/files/1/0266/4075/2726/products/campbells-soup_1024x1024.png", category: "Groceries", size: [0.3, 0.5, 0.3], hint: "soup can" },
  [aisle1XLeft, shelfY.mid, aisleZStart], 80, "z"
);
stockShelf(
  { name: "Spaghetti Pasta", price: 1.28, description: "A box of classic spaghetti.", image: "https://i5.walmartimages.com/seo/Great-Value-Spaghetti-16-oz_b3598528-2231-4e48-b445-6a58f7f2b053.a973a98075abe21396a570d55fac158d.jpeg", category: "Groceries", size: [0.8, 0.2, 0.4], hint: "pasta box" },
  [aisle1XLeft, shelfY.low, aisleZStart], 70, "z"
);
// Produce Section on Bottom Shelf
stockShelf(
  { name: "Red Apple", price: 0.54, description: "A crisp and sweet red delicious apple.", image: "https://4.imimg.com/data4/JX/WJ/ANDROID-16294238/product-1000x1000.jpeg", category: "Produce", size: [0.3, 0.3, 0.3], hint: "red apple" },
  [aisle1XLeft, shelfY.bottom, aisleZStart], 30, "z"
);
stockShelf(
  { name: "Navel Orange", price: 0.88, description: "A sweet and juicy navel orange.", image: "https://img06.weeecdn.com/product/image/187/337/35B5E8830448B7D5.png", category: "Produce", size: [0.3, 0.3, 0.3], hint: "orange fruit" },
  [aisle1XLeft, shelfY.bottom, aisleZStart + 12], 30, "z"
);
stockShelf(
  { name: "Banana", price: 0.21, description: "A single fresh banana.", image: "https://files.merca20.com/uploads/2021/08/one-a-day-bananas-packaging.jpg", category: "Produce", size: [0.2, 0.1, 0.6], hint: "banana" },
  [aisle1XLeft, shelfY.bottom, aisleZStart + 24], 17, "z"
);

// Right Side
stockShelf(
  { name: "Lays Classic Chips", price: 3.5, description: "A party size bag of classic potato chips.", image: "https://images.squarespace-cdn.com/content/v1/5e73e506323a8f2617853507/9018ca92-3b95-426c-8ccf-3d3065f5a0ce/lays-classiic-potato-chips-min.png", category: "Groceries", size: [0.8, 1, 0.4], hint: "potato chips" },
  [aisle1XRight, shelfY.high, aisleZStart], 70, "z"
);
stockShelf(
  { name: "Oreo Cookies", price: 3.78, description: "A family size pack of classic Oreo cookies.", image: "https://www.pantry24.de/wp-content/uploads/2023/02/Oreo-170g.jpg", category: "Groceries", size: [0.7, 0.3, 0.2], hint: "cookie package" },
  [aisle1XRight, shelfY.mid, aisleZStart], 115, "z"
);
stockShelf(
  { name: "Pringles Original", price: 2.50, description: "Crispy potato chips in a can.", image: "https://www.pngall.com/wp-content/uploads/12/Pringles-PNG-Image.png", category: "Snacks", size: [0.4, 0.8, 0.4], hint: "pringles can" },
  [aisle1XRight, shelfY.low, aisleZStart], 70, "z"
);
stockShelf(
  { name: "Great Value Bread", price: 2.24, description: "Classic white sandwich bread.", image: "https://i5.walmartimages.com/asr/fd804f80-f09b-44c5-b02c-c7ab592b12f3.32fa78c99c51e374a327a1743e83d4f9.jpeg", category: "Groceries", size: [0.5, 0.5, 1], hint: "bread loaf" },
  [aisle1XRight, shelfY.bottom, aisleZStart], 32, "z"
);


// --- AISLE 2: Soda & Drinks (x = -8) ---
const aisle2XLeft = -9.0;
const aisle2XRight = -7.0;
stockShelf(
  { name: "Coca-Cola 12-Pack", price: 5.98, description: "A 12-pack of classic Coca-Cola.", image: "https://th.bing.com/th/id/R.5c9ac9b6ffb1dc3d82471746047a5451?rik=KowRz4U1DFLOVQ&riu=http%3a%2f%2f1000logos.net%2fwp-content%2fuploads%2f2016%2f11%2fcoca-cola-emblem.jpg&ehk=oCRNNGPmRI0Ip5p4pqw3T38bl8ECsPu%2bdsknO%2bI5%2fAg%3d&risl=&pid=ImgRaw&r=0", category: "Groceries", size: [1.2, 0.4, 0.8], hint: "coke case" },
  [aisle2XRight, shelfY.low, aisleZStart], 40, "z"
);
stockShelf(
  { name: "Pepsi 12-Pack", price: 5.98, description: "A 12-pack of classic Pepsi cola.", image: "https://i0.wp.com/www.printmag.com/wp-content/uploads/2023/03/Screen-Shot-2023-03-30-at-12.00.38-PM.png?fit=1568%2C650&quality=80&ssl=1", category: "Groceries", size: [1.2, 0.4, 0.8], hint: "pepsi case" },
  [aisle2XRight, shelfY.mid, aisleZStart], 40, "z"
);
stockShelf(
  { name: "Dr Pepper 12-Pack", price: 5.98, description: "A 12-pack of Dr Pepper soda.", image: "https://logos-world.net/wp-content/uploads/2021/08/Dr-Pepper-Emblem.png", category: "Groceries", size: [1.2, 0.4, 0.8], hint: "dr pepper case" },
  [aisle2XLeft, shelfY.low, aisleZStart], 40, "z"
);
stockShelf(
  { name: "Mtn Dew 12-Pack", price: 5.98, description: "A 12-pack of Mtn Dew soda.", image: "https://i5.walmartimages.com/seo/Mtn-Dew-Soda-Pop-12-fl-oz-12-Pack-Cans_6a7a69b7-3b2d-4db9-a83d-3392d04a43a0.47d010d293856a9e1e79383638c44415.jpeg", category: "Groceries", size: [1.2, 0.4, 0.8], hint: "mountain dew case" },
  [aisle2XLeft, shelfY.mid, aisleZStart], 40, "z"
);
stockShelf(
  { name: "Sprite Can", price: 1.10, description: "Refreshing lemon-lime soda.", image: "https://www.pngall.com/wp-content/uploads/12/Sprite-Can-PNG-Image.png", category: "Drinks", size: [0.3, 0.5, 0.3], hint: "sprite can" },
  [aisle2XRight, shelfY.high, aisleZStart], 90, "z"
);
stockShelf(
  { name: "Orange Juice", price: 3.25, description: "A half gallon of pulp-free orange juice.", image: "https://i5.walmartimages.com/seo/Great-Value-Original-100-Orange-Juice-No-Pulp-64-fl-oz-Carton_28001a18-d069-424a-a612-f045842884a4.3411d3311893c8349275a50785be2645.jpeg", category: "Drinks", size: [0.5, 0.8, 0.5], hint: "juice carton" },
  [aisle2XLeft, shelfY.high, aisleZStart], 60, "z"
);
stockShelf(
  { name: "Aquafina Water Bottle", price: 1.50, description: "A single bottle of purified water.", image: "https://i5.walmartimages.com/seo/Aquafina-Purified-Drinking-Water-Plastic-Bottles-16-9-Fl-Oz-24-Count_9b581559-0f4d-44a6-98f9-5f21226065e7.1e5d774d758f6927d3a0429f5f6e809f.jpeg", category: "Drinks", size: [0.3, 0.8, 0.3], hint: "water bottle" },
  [aisle2XLeft, shelfY.bottom, aisleZStart], 90, "z"
);
stockShelf(
  { name: "Gatorade Fierce Grape", price: 1.80, description: "A bottle of grape flavored sports drink.", image: "https://i5.walmartimages.com/seo/Gatorade-Fierce-Thirst-Quencher-Grape-Sports-Drink-28-fl-oz-Bottle_3404c277-3e15-46aa-a316-c7263b65d6c8.0b7417e29b11929d20c5d57d0799479c.jpeg", category: "Drinks", size: [0.4, 0.8, 0.4], hint: "gatorade bottle" },
  [aisle2XRight, shelfY.bottom, aisleZStart], 70, "z"
);


// --- AISLE 3: Home Goods (x = 8) ---
const aisle3XLeft = 7.0;
const aisle3XRight = 9.0;
stockShelf(
  { name: "Bounty Paper Towels", price: 15.99, description: "Pack of 6 double rolls.", image: "https://tse2.mm.bing.net/th/id/OIP.5fmIz95FOnU2JwZjb6ZLpgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", category: "Home Goods", size: [1.2, 1, 0.6], hint: "paper towels pack" },
  [aisle3XLeft, shelfY.low, aisleZStart], 50, "z"
);
stockShelf(
  { name: "Tide Laundry Detergent", price: 12.99, description: "Original scent liquid laundry detergent.", image: "https://i5.walmartimages.com/seo/Tide-Original-Scent-Liquid-Laundry-Detergent-46-fl-oz-32-Loads_8f8e873c-f64f-4d33-875c-f7d18a7ce8b2.7a2849b282713916d3f2b1860e6e44b8.jpeg", category: "Home Goods", size: [0.8, 1.2, 0.6], hint: "detergent bottle" },
  [aisle3XLeft, shelfY.bottom, aisleZStart], 50, "z"
);
stockShelf(
  { name: "Clorox Disinfecting Wipes", price: 4.99, description: "Crisp lemon scent disinfecting wipes.", image: "https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/9/1/91RhF8-w9eL._AC_SL1500_.jpg", category: "Home Goods", size: [0.5, 0.7, 0.5], hint: "wipes container" },
  [aisle3XRight, shelfY.high, aisleZStart], 60, "z"
);
stockShelf(
  { name: "Glad Trash Bags", price: 7.50, description: "13 Gallon kitchen trash bags, 45 count.", image: "https://i5.walmartimages.com/seo/Glad-ForceFlex-Tall-Kitchen-Drawstring-Trash-Bags-13-Gallon-45-Ct_038a8e34-5853-4886-b484-90a61a6c117b.e5a87265e381665a3d463a56a64016f4.jpeg", category: "Home Goods", size: [0.6, 0.8, 0.6], hint: "trash bags box" },
  [aisle3XRight, shelfY.low, aisleZStart], 50, "z"
);
stockShelf(
  { name: "Dawn Dish Soap", price: 2.99, description: "Original scent dishwashing liquid.", image: "https://images.heb.com/is/image/HEBGrocery/000128362?fit=constrain,1&wid=800&hei=800&fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0", category: "Home Goods", size: [0.4, 0.8, 0.3], hint: "dish soap" },
  [aisle3XLeft, shelfY.mid, aisleZStart], 90, "z"
);
stockShelf(
  { name: "Great Value Sponges", price: 3.50, description: "A pack of 4 heavy duty scrub sponges.", image: "https://i5.walmartimages.com/seo/Great-Value-Heavy-Duty-Scrub-Sponges-4-Count_e681c618-c290-4824-9b57-69b768a41762.a7f14b62f0174092b7746765796a9b9a.jpeg", category: "Home Goods", size: [0.5, 0.2, 0.8], hint: "sponge pack" },
  [aisle3XLeft, shelfY.high, aisleZStart], 40, "z"
);
stockShelf(
  { name: "Great Value Aluminum Foil", price: 4.20, description: "75 square feet of standard aluminum foil.", image: "https://i5.walmartimages.com/seo/Great-Value-Standard-Aluminum-Foil-75-sq-ft_87a31518-1c9f-4375-8025-07baffc7e2c9.5c010cb7c6312a149d5a71df26d6a19f.jpeg", category: "Home Goods", size: [1, 0.3, 0.3], hint: "foil box" },
  [aisle3XRight, shelfY.mid, aisleZStart], 90, "z"
);
stockShelf(
  { name: "Charmin Toilet Paper", price: 18.99, description: "Ultra Soft Toilet Paper, 12 Mega Rolls.", image: "https://i5.walmartimages.com/seo/Charmin-Ultra-Soft-Toilet-Paper-12-Mega-Rolls_a823869a-364e-4b68-b118-af317c2a420b.577918a36814f85e4952865360980598.jpeg", category: "Home Goods", size: [1.2, 1, 1], hint: "toilet paper pack" },
  [aisle3XRight, shelfY.bottom, aisleZStart], 32, "z"
);


// --- AISLE 4: Pharmacy, Personal Care, Apparel (x = 16) ---
const aisle4XLeft = 15.0;
const aisle4XRight = 17.0;
stockShelf(
  { name: "Equate Ibuprofen", price: 8.98, description: "Pain reliever/fever reducer. 200mg tablets.", image: "https://i5.walmartimages.com/seo/Equate-Ibuprofen-Pain-Reliever-Fever-Reducer-Tablets-200-mg-500-Count_a6639695-8a2a-4fb4-89d4-1a3b01859846.1098d626e2579ac69c4c7953266a27e7.jpeg", category: "Pharmacy", size: [0.4, 0.6, 0.4], hint: "medicine bottle" },
  [aisle4XRight, shelfY.low, aisleZStart], 70, "z"
);
stockShelf(
  { name: "Hanes T-Shirt", price: 6.0, description: "Comfortable 100% cotton crewneck t-shirt.", image: "https://i5.walmartimages.com/seo/Hanes-Men-s-and-Big-Men-s-Short-Sleeve-Beefy-T-Shirt-Up-to-Size-3XL_a39b5e35-90b9-4d6a-a53c-88ad3e84df9a.14659b023f101e403487c94d13b5d1e4.jpeg", category: "Apparel", size: [0.8, 0.1, 1], hint: "folded shirt" },
  [aisle4XLeft, shelfY.mid, aisleZStart], 32, "z"
);
stockShelf(
  { name: "Colgate Toothpaste", price: 3.49, description: "Cavity protection fluoride toothpaste.", image: "https://i5.walmartimages.com/seo/Colgate-Cavity-Protection-Anticavity-Fluoride-Toothpaste-Great-Regular-Flavor-6-oz-Tube_a27b872b-8b5e-4b71-acc3-60b77764b8a2.b8793b80b7a86f1e8e24e12c0199f7d0.jpeg", category: "Personal Care", size: [0.8, 0.2, 0.15], hint: "toothpaste box" },
  [aisle4XRight, shelfY.high, aisleZStart], 140, "z"
);
stockShelf(
  { name: "Wrangler Mens Jeans", price: 19.98, description: "Regular fit, straight leg denim jeans.", image: "https://i5.walmartimages.com/seo/Wrangler-Men-s-and-Big-Men-s-Regular-Fit-Jeans-with-Flex_8233ffa1-8eeb-4363-8f4f-4d6d48c8b0e5.5e82b3d36b2f4a66f075d5e27a6c9869.jpeg", category: "Apparel", size: [1, 0.1, 1.2], hint: "folded jeans" },
  [aisle4XLeft, shelfY.high, aisleZStart], 27, "z"
);
stockShelf(
  { name: "Fruit of the Loom Socks", price: 9.99, description: "Pack of 12 pairs of crew socks.", image: "https://i5.walmartimages.com/seo/Fruit-of-the-Loom-Men-s-Work-Gear-Crew-Socks-6-Pack-Shoe-Size-6-12_c69f2e34-da48-43d9-959c-6a1be0f71960.3ce098492040b1ac803099b24af1c713.jpeg", category: "Apparel", size: [0.8, 0.2, 0.8], hint: "socks package" },
  [aisle4XLeft, shelfY.low, aisleZStart], 40, "z"
);
stockShelf(
  { name: "Hanes Boxers", price: 15.99, description: "5-pack of comfortable cotton boxers.", image: "https://i5.walmartimages.com/seo/Hanes-Men-s-and-Big-Men-s-Knit-Boxers-5-Pack-Up-to-Size-5XL_e55c3c0a-0129-4ae6-b33f-055c0e14a1e9.3496739d48ce5e32405a108a7356614a.jpeg", category: "Apparel", size: [0.8, 0.2, 0.8], hint: "boxers package" },
  [aisle4XLeft, shelfY.bottom, aisleZStart], 40, "z"
);
stockShelf(
  { name: "Old Spice Deodorant", price: 5.47, description: "Pure Sport scent high endurance deodorant.", image: "https://i5.walmartimages.com/seo/Old-Spice-High-Endurance-Long-Lasting-Deodorant-for-Men-Pure-Sport-Scent-3-oz_f13959b8-3f5f-4a0b-93ca-95b8d277d337.38f0d046e7f22ddb1a82e90e66d1f057.jpeg", category: "Personal Care", size: [0.4, 0.6, 0.2], hint: "deodorant stick" },
  [aisle4XRight, shelfY.mid, aisleZStart], 120, "z"
);
stockShelf(
  { name: "Band-Aid Variety Pack", price: 3.28, description: "Assorted sizes of flexible fabric bandages.", image: "https://i5.walmartimages.com/seo/Band-Aid-Brand-Flexible-Fabric-Adhesive-Bandages-Assorted-Sizes-30-Ct_1a4d6f85-455a-4e2b-8736-8b27376a8d6e.803c48039bb045f2065e8a554a9386c7.jpeg", category: "Pharmacy", size: [0.3, 0.1, 0.5], hint: "band-aids box" },
  [aisle4XRight, shelfY.bottom, aisleZStart], 60, "z"
);


// --- Back Aisle: Electronics, Toys, Sporting Goods (z = -22) ---
const backAisleZBack = -23.0;
const backAisleZFront = -21.0;

stockShelf(
  { name: 'onn. 50" TV', price: 198.0, description: '50" Class 4K UHD LED Roku Smart TV.', image: "https://i5.walmartimages.com/seo/onn-50-Class-4K-UHD-2160P-LED-Roku-Smart-TV-HDR-100012585_a334f553-6058-450f-a968-b783f9872580.893c527cbfed8f0b7b12d1b822212f30.jpeg", category: "Electronics", size: [4.5, 2.5, 0.2], hint: "television box" },
  [backAisleXStart, shelfY.low, backAisleZBack], 8, "x"
);
stockShelf(
  { name: "LEGO Classic Bricks", price: 20.0, description: "A box of 484 classic LEGO bricks.", image: "https://digilego.com/wp-content/uploads/2021/10/Lego-Logo-Color-Feature.jpg", category: "Toys", size: [1.2, 0.8, 0.5], hint: "lego box" },
  [backAisleXStart, shelfY.bottom, backAisleZFront], 28, "x"
);
stockShelf(
  { name: "Spalding Basketball", price: 15.88, description: "Official size street basketball.", image: "https://tse3.mm.bing.net/th/id/OIP.6wWrH6g6FnhKQku3nqlt2gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", category: "Sporting Goods", size: [0.8, 0.8, 0.8], hint: "basketball" },
  [backAisleXStart + 28, shelfY.low, backAisleZFront], 10, "x"
);
stockShelf(
  { name: 'onn. 32" TV', price: 98.0, description: '32" Class HD LED Roku Smart TV.', image: "https://i5.walmartimages.com/seo/onn-32-Class-HD-720P-LED-Roku-Smart-TV-HDR-100012589_9832c3f8-a792-4545-be31-158a1768d8be.d75a176e736868a44a7f14b62d85b54a.jpeg", category: "Electronics", size: [2.5, 1.8, 0.2], hint: "television box" },
  [backAisleXStart, shelfY.high, backAisleZBack], 14, "x"
);
stockShelf(
  { name: 'onn. Soundbar', price: 29.0, description: '2.0-Channel Bluetooth Soundbar.', image: "https://i5.walmartimages.com/seo/onn-2-0-30-160W-Bluetooth-Soundbar-with-Remote-Control_b9d99723-5e7e-4366-88a4-07f9c8f18d72.9a80e0c0a370e08c6f1d2c67c5ab9e96.jpeg", category: "Electronics", size: [2.0, 0.3, 0.3], hint: "soundbar box" },
  [backAisleXStart, shelfY.mid, backAisleZBack], 18, "x"
);
stockShelf(
  { name: "PlayStation 5 Controller", price: 69.00, description: "DualSense Wireless Controller for PS5.", image: "https://i5.walmartimages.com/seo/PlayStation-5-DualSense-Wireless-Controller-White_28f280b2-73a7-47b2-9a57-04d49d975a59.083e449c5e2d377e3845b4149021e1d4.jpeg", category: "Electronics", size: [0.6, 0.3, 0.8], hint: "game controller box" },
  [backAisleXStart, shelfY.bottom, backAisleZBack], 54, "x"
);
stockShelf(
  { name: "Barbie Dreamhouse", price: 179.00, description: "Pool Party Doll House with 75+ Pieces.", image: "https://i5.walmartimages.com/seo/Barbie-Dreamhouse-Pool-Party-Doll-House-with-75-Pieces-and-Pet-Puppy_60b138e6-c119-482c-b19b-a36c646001a1.00d45300d8d46e32560e227cb9ab1a5f.jpeg", category: "Toys", size: [2.5, 2.5, 1], hint: "barbie box" },
  [backAisleXStart + 15, shelfY.bottom, backAisleZFront], 8, "x"
);
stockShelf(
  { name: "Connect 4 Game", price: 9.97, description: "The classic four-in-a-row board game.", image: "https://i5.walmartimages.com/seo/Hasbro-Gaming-Connect-4-Classic-Grid-Board-Game_33d6b1d8-3011-4f80-9b4e-28b77626b52c.98393e986b6a22676100234a5d84381d.jpeg", category: "Toys", size: [0.8, 0.6, 0.2], hint: "board game box" },
  [backAisleXStart, shelfY.mid, backAisleZFront], 42, "x"
);
stockShelf(
  { name: "Hot Wheels 5-Pack", price: 5.47, description: "A pack of 5 assorted 1:64 scale die-cast cars.", image: "https://i5.walmartimages.com/seo/Hot-Wheels-Toy-Car-Track-Set-5-Pack-of-1-64-Scale-Vehicles_363065a4-1a98-422e-8344-93c2001c23f1.2f7200e478583c07802872f232490977.jpeg", category: "Toys", size: [0.5, 0.1, 0.8], hint: "hot wheels pack" },
  [backAisleXStart, shelfY.high, backAisleZFront], 63, "x"
);

// --- Pallet Displays ---
const displayZ = 15;
const sodaCaseSize: [number, number, number] = [1.2, 0.4, 0.8];
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
