const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch((err) => console.log(err));

// Sample Data
const products = [
  {
    name: "Raw Indian Single Donor Hair",
    category: "Bulk Hair",
    priceRange: "$110 - $130",
    image:
      "https://images.unsplash.com/photo-1595476103221-d9c17b5e610b?q=80&w=2670&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595476103221-d9c17b5e610b?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2626&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2669&auto=format&fit=crop",
    ],
    description: "100% Unprocessed raw Indian temple hair from a single donor.",
    highlights: [
      "100% natural, raw human hair with no processing.",
      "Tangle-free and ready for use in all types of extensions.",
      "Available in a wide range of natural shades.",
      "Cuticles aligned in one direction.",
    ],
    lengths: [
      "10 inch",
      "12 inch",
      "14 inch",
      "16 inch",
      "18 inch",
      "20 inch",
      "22 inch",
      "24 inch",
    ],
    colors: ["Natural Black", "Dark Brown", "Blonde"],
    stock: 5,
    rating: 4.8,
    reviewCount: 124,
    shipping: {
      from: "Beldanga, West Bengal",
      type: "International Shipping",
      time: "3-5 Days",
    },
    reviews: [
      {
        user: "Sarah J.",
        rating: 5,
        comment: "Amazing quality! The texture is perfect.",
      },
    ],
  },
  {
    name: "Natural Wavy Machine Weft",
    category: "Weft Hair",
    priceRange: "$65 - $80",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2626&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=2626&auto=format&fit=crop",
    ],
    description:
      "Double weft natural wavy hair, tangle-free and shedding-free.",
    highlights: ["Double weft", "Shedding-free", "Natural Wavy Texture"],
    lengths: ["12 inch", "14 inch", "16 inch", "18 inch"],
    colors: ["Natural Black"],
    stock: 15,
    rating: 4.5,
    reviewCount: 89,
  },
  {
    name: "Deep Curly Extensions",
    category: "Extensions",
    priceRange: "$70 - $90",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2669&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2669&auto=format&fit=crop",
    ],
    description:
      "Steam processed deep curly texture that holds curls for long time.",
    highlights: ["Deep Curly Pattern", "Steam Processed", "Long Lasting Curls"],
    lengths: ["16 inch", "18 inch", "20 inch"],
    colors: ["Natural Black", "Dark Brown"],
    stock: 8,
    rating: 4.9,
    reviewCount: 45,
  },
  {
    name: "Blonde 613 Straight Hair",
    category: "Colored Hair",
    priceRange: "$85 - $110",
    image:
      "https://images.unsplash.com/photo-1519699047748-40ba526612fd?q=80&w=2670&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519699047748-40ba526612fd?q=80&w=2670&auto=format&fit=crop",
    ],
    description:
      "Professionally bleached 613 blonde hair, ready to dye any color.",
    highlights: [
      "Professionally Bleached",
      "Takes Color Well",
      "Silky Straight",
    ],
    lengths: ["18 inch", "20 inch", "22 inch", "24 inch"],
    colors: ["Blonde 613"],
    stock: 3,
    rating: 4.7,
    reviewCount: 32,
  },
];

const importData = async () => {
  try {
    // Purana data saaf karein
    await Product.deleteMany();
    await User.deleteMany();

    // 1. Admin User Banayein
    const createdUser = await User.create({
      name: "Admin TS",
      email: "admin@tshair.com",
      password: "adminpassword123", // Ye password yaad rakhein
      isAdmin: true,
    });

    console.log("👤 Admin User Created: admin@tshair.com / adminpassword123");

    // 2. Products Banayein
    // (Agar aapke paas products array hai to ye line uncomment karein)
    // await Product.insertMany(products);

    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
