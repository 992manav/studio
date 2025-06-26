import React, { useEffect, useState } from "react";
import ImageCard from "./ImageCard";
import "./dashboard.css";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import Cart from "./Cart";

// --- Tool Declaration ---
const highlightCardDeclaration = {
  name: "highlight_card",
  description: "Highlights a product card by name.",
  parameters: {
    type: "object",
    properties: {
      product_name: {
        type: "string",
        description: "The name of the product to highlight (case-insensitive).",
      },
    },
    required: ["product_name"],
  },
};

const removeHighlightCardDeclaration = {
  name: "remove_highlight_card",
  description:
    "Removes highlight from a specific product or all if no product is provided.",
  parameters: {
    type: "object",
    properties: {
      product_name: {
        type: "string",
        description:
          "The name of the product to remove highlight from (optional).",
      },
    },
  },
};

const addToCartDeclaration = {
  name: "add_to_cart",
  description: "Adds a product to the cart by name.",
  parameters: {
    type: "object",
    properties: {
      product_name: {
        type: "string",
        description:
          "The name of the product to add to the cart (case-insensitive).",
      },
    },
    required: ["product_name"],
  },
};

const removeFromCartDeclaration = {
  name: "remove_from_cart",
  description: "Removes a product from the cart by name.",
  parameters: {
    type: "object",
    properties: {
      product_name: {
        type: "string",
        description:
          "The name of the product to remove from the cart (case-insensitive).",
      },
    },
    required: ["product_name"],
  },
};

const readCartSummary = {
  name: "read_cart_summary",
  description:
    "Summarizes the current items in the cart and reads it aloud to the user.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
};

const changeBackgroundDeclaration = {
  name: "change_background",
  description: "Changes the background color of the page.",
  parameters: {
    type: "object",
    properties: {
      color: {
        type: "string",
        description:
          "The background color to set. Accepts any valid CSS color value.",
      },
    },
    required: ["color"],
  },
};

const getProductDetailsDeclaration = {
  name: "get_product_details",
  description: "Searches for a product by name and returns its details.",
  parameters: {
    type: "object",
    properties: {
      product_name: {
        type: "string",
        description:
          "The exact or partial name of the product to search (case-insensitive).",
      },
    },
    required: ["product_name"],
  },
};

const decreaseCartQuantityDeclaration = {
  name: "decrease_cart_quantity",
  description:
    "Decreases the quantity of a specific product in the cart by 1. If the quantity becomes 0, it removes the product from the cart.",
  parameters: {
    type: "object",
    properties: {
      product_name: {
        type: "string",
        description:
          "The name of the product to decrease quantity for (case-insensitive).",
      },
    },
    required: ["product_name"],
  },
};

const getAllProductNamesDeclaration = {
  name: "get_all_product_names",
  description:
    "Returns a list of names of all available products in the store.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
};

// --- Product Data ---
const productsByCategory = {
  Fruits: [
    {
      name: "Mango",
      price: 40, // approx. ₹40 each
      description:
        "Rich in Vitamin C and beta-carotene, mangoes help boost immunity, improve eye health, and aid iron absorption—beneficial in anemia recovery.",
      image:
        "https://imgs.search.brave.com/HNwhspi7Xpicq5YnC9m1oRl3OaAyblzIWGd8xGMJMOw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9vcmNo/YXJkZnJ1aXQuY29t/L2Nkbi9zaG9wL2Zp/bGVzL0Z1bGxTaXpl/UmVuZGVyX2RlMTI2/NTZlLTFhZDEtNGEx/Yy1iMDUxLWExMTJh/ZjcyNmQ0YS5oZWlj/P3Y9MTc0MTM2NTQ0/MiZ3aWR0aD0xMjE0",
    },
    {
      name: "Banana",
      price: 10, // approx. ₹10 per banana
      description:
        "High in potassium and magnesium, bananas support heart health, help manage blood pressure, and are gentle on the stomach—great for post-illness nutrition.",
      image:
        "https://imgs.search.brave.com/gDmd5TmweQNkbfXdTyQXfqyJNM21TiB_pBkPnPoVip4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcy/ODc2MDA0L3Bob3Rv/L2JhbmFuYS13YWxs/cGFwZXIuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPURqVUlx/NzdGaDNsamRlX1dK/TndZbDE3ZTg2VnhN/VXBPd1lpVkwyWEpv/OVU9",
    },
    {
      name: "Apple",
      price: 50, // approx. ₹50 per apple
      description:
        "A fiber-rich fruit containing antioxidants and Vitamin C; apples aid digestion, reduce inflammation, and support lung function and immune response.",
      image:
        "https://imgs.search.brave.com/DNX5oABvRoX649H8WSV1mLaP4T8KHMa9olMXJaqoTk0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg0/Mjc2ODE4L3Bob3Rv/L3JlZC1hcHBsZS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/TnZPLWJMc0cwREpf/N0lpOFNTVm9LTHVy/emptVjBRaTRlR2Zu/Nm5XM2w1dz0",
    },
    {
      name: "Papaya",
      price: 40, // approx. ₹40 per papaya
      description:
        "Packed with digestive enzymes like papain, papaya helps relieve constipation, boosts immunity, and supports skin and eye health due to its Vitamin A content.",
      image:
        "https://imgs.search.brave.com/D9rcPHLv6XB3aHzWGTCk-MITcu72Aql8Ql4ECs6Iw1s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEyLzU0LzkwLzI2/LzM2MF9GXzEyNTQ5/MDI2MDNfWUdnSzJr/MmlVbWxMbWpMUUhl/Y29aUE5rZGNUZHp3/bncuanBn",
    },
    {
      name: "Pomegranate",
      price: 70, // approx. ₹70 each
      description:
        "Rich in antioxidants and polyphenols, pomegranates improve cardiovascular health, reduce inflammation, and help regenerate red blood cells—often recommended for anemia and recovery.",
      image:
        "https://imgs.search.brave.com/EHI1N0cKMwxv-hkIREXAv0ssu-ffGWdYvJcKin76bgk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bGIud2JtZHN0YXRp/Yy5jb20vdmltL2xp/dmUvd2VibWQvY29u/c3VtZXJfYXNzZXRz/L3NpdGVfaW1hZ2Vz/L2FydGljbGVzL2hl/YWx0aF90b29scy9m/b29kc19mb3JfY2ly/Y3VsYXRpb25fc2xp/ZGVzaG93LzE4MDBz/c19nZXR0eV9yZl9w/b21lZ3JhbmF0ZS5q/cGc_cmVzaXplPTc1/MHB4Oiomb3V0cHV0/LXF1YWxpdHk9NzU",
    },
    {
      name: "Blueberries",
      price: 250, // approximate price for a pack of blueberries in India
      description:
        "High in anthocyanins, they protect the brain from oxidative stress, enhance memory, and reduce the risk of heart disease and cancer.",
      image:
        "https://imgs.search.brave.com/e0dobthi3eDlH88vsgQv2GDFOgaeeJktTz_eJkGQUxs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/MTk3MzM3L3Bob3Rv/L2JsdWViZXJyaWVz/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz13c2FQMUM2UFBv/SXJsQVBYLVpiaTh1/d21PVXAwOG9WQjAy/cFk1a2pmMzlVPQ",
    },
    {
      name: "Guava",
      price: 25, // approx. ₹25 per guava
      description:
        "Loaded with Vitamin C (more than oranges), guavas strengthen immunity, improve digestion, regulate blood sugar levels, and enhance skin health.",
      image:
        "https://imgs.search.brave.com/b7XgWVz-Sr2Yv4UB0pLQUs9NxtqVCmRVDz__m5eQfkA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcx/NTc1ODExL3Bob3Rv/L2d1YXZhLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1jalZE/cGlzRnJUOEpscUZi/U0VJbWtmc1hnUWJ0/ck5DZFNUSUxHQXpJ/ajJRPQ",
    },
  ],
  Vegetables: [
    {
      name: "Spinach",
      price: 20, // approx. ₹20 per bunch/kg depending on variety
      description:
        "A superfood rich in iron, folate, and Vitamin K; promotes red blood cell production, supports bone health, and is ideal in recovery from fatigue or surgery.",
      image:
        "https://imgs.search.brave.com/KglFWgpxD55TmajT-0uVveL_8Sdg-EqXoK4tcK8Ud-Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTc0/Njg2ODMzL3Bob3Rv/L3NwaW5hY2guanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPWdp/T3R6aUp1T3lpNmhn/MkpUa3ZQYVgtMHp6/Q0E0cENLSTBiOFJU/SlRoNkk9",
    },
    {
      name: "Carrot",
      price: 30, // approx. ₹30 per kg
      description:
        "Rich in beta-carotene (Vitamin A), carrots promote healthy vision, strengthen immunity, and support skin regeneration—often suggested post-illness.",
      image:
        "https://imgs.search.brave.com/kwVwFfLt33z5wAZu7Wgpg4wLQHKsMwVE0HpsjCEYFbY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzU1LzI0LzQ4/LzM2MF9GXzU1NTI0/NDg1NF9reGpCWFdx/TWJHY0hnSU5iWllZ/UUt3Mk5HRUZNQVRD/di5qcGc",
    },
    {
      name: "Broccoli",
      price: 60, // approx. ₹60 per head
      description:
        "Cruciferous vegetable loaded with sulforaphane, Vitamin C, and fiber; helps detoxify the body, reduce inflammation, and fight infections.",
      image:
        "https://imgs.search.brave.com/4kNgB23OW9Q4Owk7ndMxKeN9oU-1hoRS-NUgHZOXKb4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzEwLzM0LzM3/LzM2MF9GXzEwMzQz/NzQwXzNXM2l6cHo2/OWNxYW1jeXlLdGhj/RW9DQ2dQNXI3N2kw/LmpwZw",
    },
    {
      name: "Beetroot",
      price: 20, // approx. ₹20 per kg or per few pieces
      description:
        "Increases nitric oxide in the body, improving blood circulation and stamina; often recommended to manage blood pressure and aid in post-exercise recovery.",
      image:
        "https://imgs.search.brave.com/bJio2vYWOLts_nQR1wDGKB15Yy5MpVnZI83Kx0TkwE8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTYy/NjgyOTYxL3Bob3Rv/L2JlZXRyb290Lmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1B/ekhtSjZmUGE0NEJO/N3lfcmppOW56aUlY/TXVPclBlVTUwMktw/c1B2NktzPQ",
    },
    {
      name: "Sweet Potato",
      price: 25, // approx. ₹25 per piece
      description:
        "A low glycemic index food rich in Vitamin A and fiber; supports immune function and blood sugar control—great for diabetics and post-op healing.",
      image:
        "https://imgs.search.brave.com/iStKr28XM8Y28r8u73n8n_O2jfwGVlhBssT8qWvQ4_4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ0/MDc5Njg4Mi9waG90/by9yZWQtc3dlZXQt/dGhhaS1wb3RhdG9l/cy5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9aElLS215bXp2/a1FRQlF0S09YcWFt/WFB2TnUxanJCRGNO/MTN6MVZQQWM5ST0",
    },
    {
      name: "Lauki",
      price: 15, // approx. ₹15 per medium-sized lauki
      description:
        "A hydrating vegetable low in calories and high in water content, ideal for digestion, liver health, and weight management during recovery or detox.",
      image:
        "https://imgs.search.brave.com/IaNvF6pYLoeYSAXhmztGOgpzz0Cy1YSMWdjicjLkCQo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI3/NzkyODkxMS9waG90/by9ib3R0bGUtZ291/cmQtb3Itc25ha2Ut/Z291cmRzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz05a0xS/ajF6NVVUMWRLcl9H/ZHhyTGhPQTZPRWtN/Tktvd2MzWDMxRkM1/N2dZPQ",
    },
  ],
  Nuts: [
    {
      name: "Almonds",
      price: 150, // approx. ₹150 per pack/100g
      description:
        "Rich in healthy fats, Vitamin E, and magnesium; improves brain function, cholesterol levels, and supports nerve and heart health.",
      image:
        "https://imgs.search.brave.com/5jAcDYKxNl9P-SIDUpSykuHw8W5PEbsWtwa0MC-lyv8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjE3/NzQ2MDk4L3Bob3Rv/L2FsbW9uZHMuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPUst/dS1IM1U5RF9mREVU/VkJtRWdLQVJjOVNj/VlNzazlrdFJ3b2pX/Qm5Ga0U9",
    },
    {
      name: "Cashews",
      price: 200, // approx. ₹200 per pack/100g
      description:
        "Contain iron, zinc, and magnesium; beneficial for maintaining healthy metabolism, immune function, and energy production.",
      image:
        "https://imgs.search.brave.com/VSqY0qLM0FP-BkcdSrIBgQd-Qb0XxRqI_MVTlTVSIUY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjE3/NzU0NDgyL3Bob3Rv/L2Nhc2hld3MuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVlq/RllXbF8xanplZ2df/cGZwb0dXaXE4NzZU/Ulh5TU5CbXUzam5U/LUpFMlk9",
    },
    {
      name: "Walnuts",
      price: 250, // approx. ₹250 per pack/100g
      description:
        "High in plant-based omega-3 fatty acids (ALA); support brain development, reduce inflammation, and help in stress recovery.",
      image:
        "https://imgs.search.brave.com/JQ60gV_R63WrF5BR1Je59kx64W3Hdq51htNeO_iVtHU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bGIud2JtZHN0YXRp/Yy5jb20vdmltL2xp/dmUvd2VibWQvY29u/c3VtZXJfYXNzZXRz/L3NpdGVfaW1hZ2Vz/L2FydGljbGVzL2hl/YWx0aF90b29scy9o/aWdoX2FudGlveGlk/YW50X2Zvb2RzX3Rv/X3RyeV9zbGlkZXNo/b3cvMTgwMHNzX2dl/dHR5X3JmX3dhbG51/dHMuanBnP3Jlc2l6/ZT03NTBweDoqJm91/dHB1dC1xdWFsaXR5/PTc1",
    },
    {
      name: "Pistachios",
      price: 250, // approx. ₹250 per pack/100g
      description:
        "Loaded with protein, antioxidants, and fiber; support heart health, weight management, and aid in muscle repair post-illness.",
      image:
        "https://imgs.search.brave.com/fhYNO5fBeZI19BFFiUpQZvZjxYmqlZ5e3aoBl5NPsSw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTA2/Mjg4MjM0L3Bob3Rv/L3Bpc3RhY2hpb3Mu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PURlTzRRakQxdHE1/ckM5NmUxaEdBWWk3/aTluNHN6QTdHUXpQ/R3VObEcwcmM9",
    },
  ],
  Seeds: [
    {
      name: "Chia Seeds",
      price: 150, // approx. ₹150 per pack
      description:
        "High in omega-3, fiber, and protein; aid in weight management, heart health, and digestive regularity—ideal for diabetic and cardiac patients.",
      image:
        "https://imgs.search.brave.com/Rp4uboCPsR752oBV7zcphhz_-sAEIjoNbjhAW2c3BoU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjM4/ODE0MjM4L3Bob3Rv/L2NoaWEtc2VlZHMu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PTM0ekdRaFBhWjM1/Zl9zdkt4U3JscGJi/TGlwMlRzR0ppN0No/WVhsVzlYQjQ9",
    },
    {
      name: "Flax Seeds",
      price: 120, // approx. ₹120 per pack
      description:
        "Packed with lignans and alpha-linolenic acid (ALA); reduce inflammation, support heart health, and promote hormonal balance.",
      image:
        "https://imgs.search.brave.com/bzl8GQt6Ds0IK8ed9bK2iD4rH_4Ks_ifIrx8B1OSvqM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM1/MjI2ODEzNS9waG90/by9mbGF4LXNlZWRz/LWluLWEtd29vZGVu/LWJvd2wuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPW1WR202/SXJVY0lHVnlCVW1s/em43YmprUVRzM2pF/WFRnamNUZTBEdG8w/QUk9",
    },
    {
      name: "Pumpkin Seeds",
      price: 150, // approx. ₹150 per pack
      description:
        "Rich in zinc, iron, and magnesium; beneficial for immune support, prostate health, and reducing anxiety or fatigue.",
      image:
        "https://imgs.search.brave.com/YLFRNghWaxEtOHRcyyjFYNIaslGtCXbL7KX1IKvrPF8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE3/NTYwMzgzNi9waG90/by9wdW1wa2luLXNl/ZWRzLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz0wUFFDd0tq/SXlqZkRhLXJ0U3kt/c3pCR0hCNndOdUFV/ckhlTkEtdHJFVnA0/PQ",
    },
    {
      name: "Sunflower Seeds",
      price: 130, // approx. ₹130 per pack
      description:
        "Contain Vitamin E, selenium, and phytosterols; help reduce inflammation, enhance skin health, and regulate cholesterol.",
      image:
        "https://imgs.search.brave.com/sa88YAc3eQUIZYA3sX65dm9WGcyhVWSg8d2ABb7KPvk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzc0LzAzLzgx/LzM2MF9GXzc0MDM4/MTc3X2owdGJ6NVZZ/czdPTEY0eFNUbDQ4/UGVGcmU1QUZPVUh4/LmpwZw",
    },
  ],
  Herbs: [
    {
      name: "Tulsi",
      price: 10, // approx. ₹10 per bunch
      description:
        "An adaptogenic herb that reduces stress hormones, boosts immunity, and supports respiratory health—used in Ayurvedic healing.",
      image:
        "https://imgs.search.brave.com/LCIFHor6v6sc4lvNwu5EhCMHY8Zq01q2FiQNYcBEiRI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1Lzc1LzM1Lzg4/LzM2MF9GXzU3NTM1/ODgxNF9RMHc4Wm1N/NHR3RzFkblFHOVlZ/dTNzT3F3cExqbXk5/bC5qcGc",
    },
    {
      name: "Mint",
      price: 10, // approx. ₹10 per bunch
      description:
        "Soothes digestive issues like bloating or indigestion; contains menthol, which provides a cooling effect and supports respiratory comfort.",
      image:
        "https://imgs.search.brave.com/9lTrYy4X4Pig5ojnoRv8Cx79w9AGCLYniYXjJbDeNro/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjEy/Mzg0MzQwL3Bob3Rv/L21pbnQtbGVhZi1j/bG9zZS11cC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9Y2R3/dVlabEd2bDkycEMy/MGNtM3hBVGJkX3Nq/alZEa3VsdXJRdE9B/LVlfND0",
    },
    {
      name: "Coriander Leaves",
      price: 5, // approx. ₹5 for a bunch
      description:
        "Rich in antioxidants and detoxifying agents; helps reduce blood sugar, inflammation, and improves kidney and gut function.",
      image:
        "https://imgs.search.brave.com/WLEdbXUf7r5gnCx7_jcUmGPgF9tUIGWJSny9NX7nSlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTg1/NDA1NDU5L3Bob3Rv/L2ZyZXNoLWNvcmlh/bmRlci1sZWF2ZXMu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PTI2M2ZzT19FMVBx/ZnMxRDgyZXB2Y09n/X2FWVU92d1czU3Vv/Z2pjYWt0YUU9",
    },
    {
      name: "Giloy",
      price: 30, // approx. ₹30 per pack or bundle
      description:
        "A powerful immunity booster and anti-inflammatory herb; helps fight recurrent infections, fevers, and aids in post-viral recovery.",
      image:
        "https://imgs.search.brave.com/cBsd9M6Wjgc72AtYiLC70K7v2g-c5nPnfvBqqfI0Cj4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aGVhbHRoaWZ5bWUu/Y29tL2Jsb2cvd3At/Y29udGVudC91cGxv/YWRzLzIwMjEvMTIv/QmVuZWZpdHMtb2Yt/R2lsb3kuanBlZw",
    },
    {
      name: "Amla",
      price: 20, // approx. ₹20 per amla
      description:
        "Extremely rich in Vitamin C; enhances immunity, improves liver health, slows aging, and helps regulate cholesterol and blood sugar levels.",
      image:
        "https://imgs.search.brave.com/urBAqnir3WuLRy8btUbvZAPEucMHwOGW86ZFizyt2g8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzk2LzM0LzU0/LzM2MF9GXzI5NjM0/NTQ5OV9tek4wVnBN/ektTdWdvUjJkUzRa/c2dTT3BtT2cweWdX/YS5qcGc",
    },
  ],
};

function Dashboard() {
  const { client, setConfig } = useLiveAPIContext();

  const [cartItems, setCartItems] = useState([]);

  // ✅ Add item to cart
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // ✅ Remove item from cart
  const handleRemove = (product) => {
    setCartItems((prev) => prev.filter((item) => item.name !== product.name));
  };

  // ✅ Change item quantity
  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(product);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.name === product.name ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // ✅ Register tools + instruction
  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },

      systemInstruction: {
        parts: [
          {
            text: `You are a smart assistant inside a health-focused food store.
                Greet users politely. 
                
                - If they ask about a product or say "highlight", "show me", or "where is", call the "highlight_card" function.
                - If the user wants to clear highlights, say "remove", "reset", or "done" to call "remove_highlight_card".
                - If a user says "add to cart", "I want", or "buy", call "add_to_cart".
                - If a user says "remove from cart", call "remove_from_cart".
                - If a user says "what's in my cart", "cart summary", or "read my cart", call "read_cart_summary".
                - If a user says "reduce", "decrease", or "less quantity", call "decrease_cart_quantity".
                - If a user asks for "product names", "list of items", or "what do you have", call "get_all_product_names".
                - You can also change the background color or mode (dark or light) of the dashboard using "change_background".
                 -If the user wants to prepare a specific dish or enjoy a particular meal at home:
                    1.Retrieve all available product names using the get_all_product_names tool.
                    2.Identify the ingredients required for the dish or food item the user wants to make or eat.
                    3.Filter the retrieved products to match the ingredients needed for the specified dish.
                    4.Suggest the filtered products to the user, including any missing ingredients they need to buy to complete the dish.
                - You can also get any product details by calling "get_product_details".
                - If a user mentions a disease or health condition:
                    1. Retrieve all available product names using the get_all_product_names tool.
                    2. Filter the retrieved products based on their relevance to the mentioned disease or health condition, considering:
                        Nutritional properties
                        Specific benefits related to the condition
                        Ingredients that support recovery or health improvements for that condition
                    3.Suggest the filtered products to the user with a brief explanation of why they are suitable for the specific health condition.

                
               
                Always try to help the user in a friendly, helpful, and health-conscious way.
                    `,
          },
        ],
      },
      tools: [
        {
          functionDeclarations: [
            highlightCardDeclaration,
            removeHighlightCardDeclaration,
            addToCartDeclaration,
            removeFromCartDeclaration,
            readCartSummary,
            changeBackgroundDeclaration,
            getProductDetailsDeclaration,
            decreaseCartQuantityDeclaration,
            getAllProductNamesDeclaration,
          ],
        },
      ],
    });
  }, [setConfig]);

  // ✅ Listen for Gemini tool call
  useEffect(() => {
    const onToolCall = (toolCall) => {
      toolCall.functionCalls.forEach((fc) => {
        if (fc.name === "highlight_card") {
          const productName = fc.args?.product_name?.toLowerCase();
          if (productName) {
            const cards = document.querySelectorAll(".product-card");
            let found = false;

            cards.forEach((card) => {
              const name = card
                .querySelector(".product-name")
                ?.textContent?.toLowerCase();
              if (name === productName) {
                card.classList.add("highlighted");
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                found = true;
              }
            });

            if (!found) {
              client.sendToolResponse({
                functionResponses: [
                  {
                    response: {
                      output: {
                        success: false,
                        text: `Sorry, we didn’t find a product named "${fc.args?.product_name}".`,
                      },
                    },
                    id: fc.id,
                  },
                ],
              });
            }
          }
        } else if (fc.name === "remove_highlight_card") {
          const productName = fc.args?.product_name?.toLowerCase();
          const cards = document.querySelectorAll(".product-card");

          cards.forEach((card) => {
            const name = card
              .querySelector(".product-name")
              ?.textContent?.toLowerCase();

            if (!productName || name === productName) {
              card.classList.remove("highlighted");
            }
          });
        }

        if (fc.name === "add_to_cart") {
          const productName = fc.args?.product_name?.toLowerCase();
          let found = false;

          const product = Object.values(productsByCategory)
            .flat()
            .find((p) => p.name.toLowerCase() === productName);

          if (product) {
            handleAddToCart(product);

            const cards = document.querySelectorAll(".product-card");

            cards.forEach((card) => {
              const name = card
                .querySelector(".product-name")
                ?.textContent?.toLowerCase();

              if (name === productName) {
                card.classList.add("highlighted");
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                found = true;
              }
            });

            client.sendToolResponse({
              functionResponses: [
                {
                  response: {
                    output: {
                      success: true,
                      text: `Added "${product.name}" to cart and highlighted it.`,
                    },
                  },
                  id: fc.id,
                },
              ],
            });
          } else {
            client.sendToolResponse({
              functionResponses: [
                {
                  response: {
                    output: {
                      success: false,
                      text: `Sorry, we couldn’t find a product named "${fc.args?.product_name}".`,
                    },
                  },
                  id: fc.id,
                },
              ],
            });
          }
        } else if (fc.name === "remove_from_cart") {
          const productName = fc.args?.product_name?.toLowerCase();
          const product = cartItems.find(
            (item) => item.name.toLowerCase() === productName
          );
          if (product) {
            handleRemove(product);
          }
        }

        if (fc.name === "read_cart_summary") {
          const cartSummary = cartItems
            .map((item) => `${item.name} (${item.quantity})`)
            .join(", ");

          const getTotalPrice = () => {
            return cartItems.reduce((total, item) => {
              return total + item.price * item.quantity;
            }, 0);
          };

          const totalPrice = getTotalPrice().toFixed(2); // e.g., 24.99

          const summaryText = cartItems.length
            ? `You have ${cartSummary} in your cart. Total price is ₹${totalPrice}.`
            : "Your cart is empty.";

          client.sendToolResponse({
            functionResponses: [
              {
                response: { output: { success: true, text: summaryText } },
                id: fc.id,
              },
            ],
          });
        }

        if (fc.name === "decrease_cart_quantity") {
          const productName = fc.args?.product_name?.toLowerCase();
          const product = cartItems.find(
            (item) => item.name.toLowerCase() === productName
          );

          if (product) {
            const newQuantity = product.quantity - 1;
            handleQuantityChange(product, newQuantity);

            client.sendToolResponse({
              functionResponses: [
                {
                  response: {
                    output: {
                      success: true,
                      text: `Decreased quantity of "${product.name}" to ${
                        newQuantity > 0 ? newQuantity : "zero (removed)"
                      }.`,
                    },
                  },
                  id: fc.id,
                },
              ],
            });
          } else {
            client.sendToolResponse({
              functionResponses: [
                {
                  response: {
                    output: {
                      success: false,
                      text: `Product "${fc.args.product_name}" not found in cart.`,
                    },
                  },
                  id: fc.id,
                },
              ],
            });
          }
        }

        if (fc.name === "get_all_product_names") {
          const allProductNames = Object.values(productsByCategory)
            .flat()
            .map((product) => product.name);

          const responseText = allProductNames.length
            ? `Available products: ${allProductNames.join(", ")}.`
            : "No products are available at the moment.";

          client.sendToolResponse({
            functionResponses: [
              {
                response: {
                  output: {
                    success: true,
                    text: responseText,
                  },
                },
                id: fc.id,
              },
            ],
          });
        }

        if (fc.name === "change_background") {
          const color = fc.args?.color;
          if (color) {
            document.body.querySelector(
              ".streaming-console"
            ).style.backgroundColor = color;
          }
        }

        if (fc.name === "get_product_details") {
          const searchTerm = fc.args?.product_name?.toLowerCase();
          if (searchTerm) {
            const cards = document.querySelectorAll(".product-card");
            let foundProduct = null;

            cards.forEach((card) => {
              const name = card
                .querySelector(".product-name")
                ?.textContent?.trim();
              const desc = card
                .querySelector(".product-desc")
                ?.textContent?.trim();
              const price = card
                .querySelector(".product-price")
                ?.textContent?.trim();

              if (name?.toLowerCase().includes(searchTerm)) {
                foundProduct = {
                  name,
                  description: desc,
                  price,
                };
              }
            });

            if (foundProduct) {
              client.sendToolResponse({
                functionResponses: [
                  {
                    response: {
                      output: {
                        success: true,
                        text: foundProduct,
                      },
                    },
                    id: fc.id,
                  },
                ],
              });
            } else {
              client.sendToolResponse({
                functionResponses: [
                  {
                    response: {
                      output: {
                        success: false,
                        text: `No product found matching "${fc.args.product_name}".`,
                      },
                    },
                    id: fc.id,
                  },
                ],
              });
            }
          }
        }
      });

      if (toolCall.functionCalls.length) {
        setTimeout(() => {
          client.sendToolResponse({
            functionResponses: toolCall.functionCalls.map((fc) => ({
              response: { output: { success: true } },
              id: fc.id,
            })),
          });
        }, 200);
      }
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client, cartItems]);

  return (
    <div className="dashboard-container">
      <h1>
        GroceryGenie: Your Smart AI Assistant for Healthy, Recovery-Focused
        Shopping
        <hr></hr>
        The New Age of Voice-Activated E-Commerce
      </h1>

      <h2>
        GroceryAgentVoice is an AI-powered voice assistant that redefines your
        grocery shopping experience. With natural language interaction, it helps
        you discover health-focused products, suggest recipes, and manage your
        shopping list—all tailored to your nutritional needs. Whether you're
        shopping for recovery, daily meals, or special dietary requirements,
        GroceryAgentVoice provides a seamless, hands-free solution. Step into
        the future of shopping with ease and personalization!
      </h2>
      <div className="store-section">
        {Object.entries(productsByCategory).map(([category, items]) => (
          <div key={category}>
            <h2 className="category-title">{category}</h2>
            <div className="product-grid">
              {items.map((product, index) => (
                <ImageCard
                  key={index}
                  {...product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-section">
        <Cart
          cartItems={cartItems}
          onRemove={handleRemove}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </div>
  );
}

export default Dashboard;
