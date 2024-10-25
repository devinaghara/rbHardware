export const products = [
    {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        category: "mortise-handle-kit",
        price: 100,
        image: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576874/combine_photos/zmadicqtycujr6vzqz41.jpg",
    },
    {
        id: 2,
        name: "Product 2",
        description: "Description of Product 2",
        category: "lock-body",
        price: 150,
        image: "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576874/combine_photos/zmadicqtycujr6vzqz41.jpg",
    },
    // Add more products as needed...
];

export const productsList = [
    // Round Mortise Handle - Stainless Steel material only, all colors
    {
        id: "1",
        name: "Round Mortise Handle - Stainless Steel",
        description: "Elegant round mortise handle with stainless steel construction.",
        price: 120.00,
        images: ["https://res.cloudinary.com/ddxe0b0kf/image/upload/v1729141370/giqslq6xwxp9lmafnjxk.jpg", "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576877/combine_photos/stpamhyiedjflmemkbsj.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt", // Default color
        category: "round-mortise-handle",
        material: "Stainless Steel",
    },
    {
        id: "9", // New ID
        name: "Round Mortise Handle - Stainless Steel",
        description: "Elegant round mortise handle with stainless steel construction in Gold PVD finish.",
        price: 10000.00,
        images: ["https://res.cloudinary.com/ddxe0b0kf/image/upload/v1729141162/vpvlwzmpkxu0o3r64eq3.jpg", "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576877/combine_photos/stpamhyiedjflmemkbsj.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Gold PVD", // Default color for this variation
        category: "round-mortise-handle",
        material: "Stainless Steel",
    },
    {
        id: "10", // New ID
        name: "Round Mortise Handle - Stainless Steel",
        description: "Elegant round mortise handle with stainless steel construction in Gold PVD finish.",
        price: 50.00,
        // images: ["/images/round-handle-gold-1.jpg", "/images/round-handle-gold-2.jpg"],
        images: ["https://res.cloudinary.com/ddxe0b0kf/image/upload/v1729141162/vpvlwzmpkxu0o3r64eq3.jpg", "https://res.cloudinary.com/ddxe0b0kf/image/upload/v1722576877/combine_photos/stpamhyiedjflmemkbsj.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Antique", // Default color for this variation
        category: "round-mortise-handle",
        material: "Stainless Steel",
    },
    {
        id: "11", // New ID
        name: "Round Mortise Handle - Stainless Steel",
        description: "Elegant round mortise handle with stainless steel construction in Gold PVD finish.",
        price: 3.00,
        images: ["/images/round-handle-gold-1.jpg", "/images/round-handle-gold-2.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Jet Black", // Default color for this variation
        category: "round-mortise-handle",
        material: "Stainless Steel",
    },
    // Square Mortise Handle - Stainless Steel material only, all colors
    {
        id: "2",
        name: "Square Mortise Handle - Stainless Steel",
        description: "Stylish square mortise handle made from stainless steel.",
        price: 10.00,
        images: ["/images/square-handle-1.jpg", "/images/square-handle-2.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt",
        category: "square-mortise-handle",
        material: "Stainless Steel",
    },
    {
        id: "10",
        name: "Square Mortise Handle - Stainless Steel",
        description: "Stylish square mortise handle made from stainless steel.",
        price: 0.00,
        images: ["/images/square-handle-1.jpg", "/images/square-handle-2.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Jet Black",
        category: "square-mortise-handle",
        material: "Stainless Steel",
    },
    // Lock Body - Brass and Zinc materials, all colors
    {
        id: "3",
        name: "Lock Body - Brass",
        description: "Durable lock body made from brass material.",
        price: 85.00,
        images: ["/images/lock-body-1.jpg", "/images/lock-body-2.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt",
        category: "lock-body",
        material: "Brass",
    },
    {
        id: "4",
        name: "Lock Body - Zinc",
        description: "Durable lock body made from zinc material.",
        price: 75.00,
        images: ["/images/lock-body-3.jpg", "/images/lock-body-4.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt",
        category: "lock-body",
        material: "Zinc",
    },
    // Roller Body - Brass material only, all colors
    {
        id: "5",
        name: "Roller Body - Brass",
        description: "Smooth functioning roller body in brass material.",
        price: 65.00,
        images: ["/images/roller-body-1.jpg", "/images/roller-body-2.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt",
        category: "roller-body",
        material: "Brass",
    },
    // Baby Latch - Brass and Zinc materials, all colors
    {
        id: "6",
        name: "Baby Latch - Brass",
        description: "Secure baby latch made from brass material.",
        price: 45.00,
        images: ["/images/baby-latch-1.jpg", "/images/baby-latch-2.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt",
        category: "baby-latch",
        material: "Brass",
    },
    {
        id: "7",
        name: "Baby Latch - Zinc",
        description: "Secure baby latch made from zinc material.",
        price: 40.00,
        images: ["/images/baby-latch-3.jpg", "/images/baby-latch-4.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt",
        category: "baby-latch",
        material: "Zinc",
    },
    // Roller Latch - Brass material only, all colors
    {
        id: "8",
        name: "Roller Latch - Brass",
        description: "Reliable roller latch made from brass material.",
        price: 50.00,
        images: ["/images/roller-latch-1.jpg", "/images/roller-latch-2.jpg"],
        availableColors: [
            { name: "Matt", colorCode: "#5e503f" },
            { name: "Antique", colorCode: "#5e503f" },
            { name: "Jet Black", colorCode: "#0a0a0a" },
            { name: "Gold PVD", colorCode: "#ffd700" },
            { name: "Rose Gold PVD", colorCode: "#b76e79" }
        ],
        color: "Matt",
        category: "roller-latch",
        material: "Brass",
    },
];
