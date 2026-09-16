/**
 * Fermalar ro'yxati (Mock Data)
 * 
 * 1. Card (Kartochka) uchun qisqa ma'lumotlar:
 *    - logoUrl: Ferma avatari/logotipi
 *    - name: Ferma nomi
 *    - address: Qisqa matnli manzil
 *    - phone: Ferma rasmiy aloqa raqami
 *    - bossFullName: Rahbar ismi-sharifi
 *    - bossPhone: Rahbar telefon raqami
 *    - status: 'active' | 'inactive'
 * 
 * 2. Detail (Tafsilotlar) sahifasi uchun to'liq ma'lumotlar:
 *    - latitude / longitude: Aniq geografik koordinatalar (Xarita uchun)
 *    - bannerUrl: Katta formatdagi muqova/banner rasmi
 *    - description: Ferma haqida qisqacha ma'lumot
 *    - createdAt: Tizimga qo'shilgan sana
 *    - totalOrders: Jami buyurtmalar soni
 *    - totalWorkers: Ishchilar soni
 * 
 * 3. Xavfsizlik:
 *    - bossPassword maydoni maxfiy bo'lgani uchun bu yerdagi ma'lumotlarda saqlanmaydi va qaytarilmaydi.
 */

export const MOCK_FARMS = [
  {
    id: "farm-001",
    name: "Oazis Gidroponika Fermasi",
    logoUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Qarshi sh., Islom Karimov ko'chasi, 45-uy",
    phone: "+998 75 221 40 50",
    status: "active",
    bossFullName: "Aliyev Bobur Mansurovich",
    bossPhone: "+998 90 123 45 67",
    latitude: 38.8612,
    longitude: 65.7847,
    description: "Zamonaviy vertikal gidroponika texnologiyasi asosida tabiiy va ekologik toza ko'katlar, qulupnay hamda saralangan sabzavotlar yetishtiruvchi innovatsion agro-majmua. Avtomatlashtirilgan ozuqa va iqlim nazorati tizimlari bilan to'liq jihozlangan.",
    totalOrders: 1420,
    totalWorkers: 18,
    createdAt: "2024-03-15",
  },
  {
    id: "farm-002",
    name: "Zarafshon Agro Gidro",
    logoUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Samarqand vil., Pastdarg'om tumani, Go'zalkent QFY",
    phone: "+998 66 345 88 99",
    status: "active",
    bossFullName: "Karimov Sherzod Olimovich",
    bossPhone: "+998 91 555 77 88",
    latitude: 39.6542,
    longitude: 66.9597,
    description: "Avtomatlashtirilgan suv aylanish tizimiga ega bodring va qulupnay yetishtirish majmuasi.",
    totalOrders: 980,
    totalWorkers: 12,
    createdAt: "2024-05-20",
  },
  {
    id: "farm-003",
    name: "Vodiy Yashil Agro",
    logoUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Farg'ona sh., Al-Farg'oniy shox ko'chasi, 12-bino",
    phone: "+998 73 542 11 22",
    status: "inactive",
    bossFullName: "Toshmatov Jamshid Rustamovich",
    bossPhone: "+998 93 444 33 22",
    latitude: 40.3864,
    longitude: 71.7864,
    description: "Yopiq issiqxona gidroponik majmuasi, ekologik toza sabzavotlar yetkazib beruvchi.",
    totalOrders: 430,
    totalWorkers: 8,
    createdAt: "2024-08-10",
  },
]
