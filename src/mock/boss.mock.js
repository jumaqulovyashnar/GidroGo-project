// Boss Detail Page uchun mock ma'lumotlar

export const MOCK_BOSS_DETAILS = [
  {
    id: "boss-001",
    profile: {
      fullName: "Aliyev Bobur Mansurovich",
      role: "BOSS",
      roleLabel: "Ferma Rahbari",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      phone: "+998 90 123 45 67",
      status: "active",
      createdAt: "2026-08-12T09:30:00Z",
    },

    farm: {
      id: "farm-001",
      name: "Oazis Gidroponika Majmuasi",
      region: "Qashqadaryo viloyati",
      address: "Qarshi sh., Islom Karimov ko'chasi, 45-uy",
      totalArea: "2.5 gektar",
      activeBlocksCount: 6,
      totalBlocksCount: 8,
      establishedYear: 2023,
      status: "active",
    },

    stats: {
      totalOrders: 128,
      completedOrders: 114,
      activeOrders: 8,
      cancelledOrders: 6,
      totalRevenue: 485000000,
      totalHarvest: 18420,
      employeesCount: 14,
      greenhouseBlocks: 8,
    },

    workers: [
      {
        id: "emp-1",
        fullName: "Rustam Qodirov",
        role: "Bosh Agronom",
        phone: "+998 91 234 56 78",
        status: "active",
      },
      {
        id: "emp-2",
        fullName: "Dilshod Saidov",
        role: "Gidroponika Muhandisi",
        phone: "+998 93 345 67 89",
        status: "active",
      },
      {
        id: "emp-3",
        fullName: "Ziyoda Karimova",
        role: "Katta Operator",
        phone: "+998 94 456 78 90",
        status: "active",
      },
    ],

    blocks: [
      {
        id: "block-a1",
        name: "1-Blok: Albio Qulupnay",
        crop: "Qulupnay",
        systemType: "Vertikal NFT",
        status: "optimal",
      },
      {
        id: "block-a2",
        name: "2-Blok: Cherri Pomidor",
        crop: "Cherri Pomidor",
        systemType: "Drip Gidroponika",
        status: "optimal",
      },
      {
        id: "block-a3",
        name: "3-Blok: Golland Bodringi",
        crop: "Bodring",
        systemType: "Substratli Gidroponika",
        status: "warning",
      },
    ],

    recentOrders: [
      {
        id: "ORD-9421",
        customerName: "Korzinka Supermarketlar Tarmog'i",
        totalAmount: 29050000,
        paymentStatus: "paid",
        deliveryStatus: "delivered",
        orderDate: "2026-09-15T08:30:00Z",
      },
      {
        id: "ORD-9420",
        customerName: "Makro Supermarket",
        totalAmount: 15000000,
        paymentStatus: "paid",
        deliveryStatus: "in_transit",
        orderDate: "2026-09-16T09:15:00Z",
      },
      {
        id: "ORD-9419",
        customerName: "Safia Bakery & Cafe",
        totalAmount: 9150000,
        paymentStatus: "pending",
        deliveryStatus: "preparing",
        orderDate: "2026-09-16T10:45:00Z",
      },
    ],

    alerts: [
      {
        id: "alert-001",
        type: "warning",
        title: "Harorat ko'tarilishi",
        message: "3-Blokda harorat optimal ko'rsatkichdan yuqori.",
        createdAt: "2026-09-17T10:20:00Z",
        isRead: false,
      },
      {
        id: "alert-002",
        type: "success",
        title: "To'lov qabul qilindi",
        message: "ORD-9421 bo'yicha to'lov muvaffaqiyatli qabul qilindi.",
        createdAt: "2026-09-17T09:10:00Z",
        isRead: true,
      },
    ],
  },

  {
    id: "boss-002",

    profile: {
      fullName: "Karimov Sardor Anvarovich",
      role: "BOSS",
      roleLabel: "Ferma Rahbari",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      phone: "+998 91 234 56 78",
      email: "sardor.karimov@example.com",
      status: "active",
      createdAt: "2026-09-03T14:15:00Z",
    },

    farm: {
      id: "farm-002",
      name: "Green Agro Farm",
      region: "Qashqadaryo viloyati",
      address: "Qarshi sh., Nasaf ko'chasi, 18-uy",
      totalArea: "1.8 gektar",
      activeBlocksCount: 4,
      totalBlocksCount: 5,
      establishedYear: 2024,
      status: "active",
    },

    stats: {
      totalOrders: 76,
      completedOrders: 69,
      activeOrders: 4,
      cancelledOrders: 3,
      totalRevenue: 278500000,
      totalHarvest: 12450,
      employeesCount: 9,
      greenhouseBlocks: 5,
    },

    workers: [
      {
        id: "emp-7",
        fullName: "Azizbek Rahmonov",
        role: "Agronom",
        phone: "+998 95 111 22 33",
        status: "active",
      },
      {
        id: "emp-8",
        fullName: "Madina Ergasheva",
        role: "Operator",
        phone: "+998 97 222 33 44",
        status: "active",
      },
    ],

    blocks: [
      {
        id: "block-b1",
        name: "1-Blok: Pomidor",
        crop: "Cherri Pomidor",
        systemType: "Drip Gidroponika",
        status: "optimal",
      },
      {
        id: "block-b2",
        name: "2-Blok: Bodring",
        crop: "Golland Bodringi",
        systemType: "Substratli Gidroponika",
        status: "optimal",
      },
    ],

    recentOrders: [
      {
        id: "ORD-8312",
        customerName: "Makro Supermarket",
        totalAmount: 12400000,
        paymentStatus: "paid",
        deliveryStatus: "delivered",
        orderDate: "2026-09-15T11:20:00Z",
      },
      {
        id: "ORD-8311",
        customerName: "Carrefour O'zbekiston",
        totalAmount: 18600000,
        paymentStatus: "pending",
        deliveryStatus: "preparing",
        orderDate: "2026-09-16T13:40:00Z",
      },
    ],

    alerts: [
      {
        id: "alert-003",
        type: "info",
        title: "Yangi buyurtma",
        message:
          "Carrefour O'zbekistondan yangi buyurtma qabul qilindi.",
        createdAt: "2026-09-17T11:30:00Z",
        isRead: false,
      },
    ],
  },
];