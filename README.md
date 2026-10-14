# GidroGo — Suv Yetkazib Berish va Fermalar Boshqaruv Platformasi

> **GidroGo** — ko'p tarmoqli suv yetkazib berish fermalari, mijozlar, buyurtmalar va kuryerlar faoliyatini markazlashtirilgan holda boshqarish, monitoring qilish va tahlil qilish uchun mo'ljallangan yagona raqamli platforma.

🌐 **Jonli havola (Production):** [https://gidrogo-project.vercel.app](https://gidrogo-project.vercel.app)

---

## 📸 Skrinshotlar

### 1. Boshqaruv Paneli (Dashboard)
Tizimning umumiy operatsion ko'rsatkichlari, jami va faol fermalar, buyurtmalar dinamikasi hamda hududlar kesimidagi taqsimot hisoboti.

![Boshqaruv Paneli](./docs/screenshots/dashboard.png)

---

### 2. Ferma Egalari (Rahbarlar Monitoringi)
Fermalar rahbarlari (Bosslar), ularning hisob holati (Faol / Bloklangan), biriktirilgan ferma identifikatorlari va tezkor boshqaruv amallari.

![Ferma Egalari](./docs/screenshots/ferma-egalari.png)

---

### 3. Statistika va O'sish Dinamikasi
Yillik operatsion rivojlanish tendensiyasi, buyurtmalar va mijozlar sonining dinamikasi hamda viloyatlar kesimidagi fermalar infratuzilmasi faolligi tahlili.

![Statistika va Tahlil](./docs/screenshots/statistika.png)

---

## 🛠 Texnologiyalar steki

* **Asosiy kutubxona:** React 19, JavaScript (ESNext)
* **Yig'uvchi (Bundler):** [Vite](https://vitejs.dev/)
* **UI & Stil:** [Tailwind CSS v4](https://tailwindcss.com/), [Mantine Core](https://mantine.dev/), Lucide Icons
* **Server State & Kesh:** [@tanstack/react-query](https://tanstack.com/query)
* **Grafiklar va Vizualizatsiya:** [ApexCharts](https://apexcharts.com/) (react-apexcharts)
* **Formalar va Validatsiya:** React Hook Form, Zod
* **Deployment:** [Vercel](https://vercel.com/) (HTTPS reverse proxy rewrite bilan)

---

## 🚀 Loyihani mahalliy (Local) ishga tushirish

1. **Repozitoriyni klonlash:**
   ```bash
   git clone https://github.com/jumaqulovyashnar/GidroGo-project.git
   cd GidroGo-project
   ```

2. **Paketlarni o'rnatish:**
   ```bash
   npm install
   # yoki
   pnpm install
   ```

3. **Muhit o'zgaruvchilari:**
   `.env.example` faylidan nusxa olib, `.env` faylini yarating:
   ```bash
   cp .env.example .env
   ```

4. **Dasturni ishga tushirish:**
   ```bash
   npm run dev
   ```
   Lokal manzil: `http://localhost:5173`

5. **Production uchun build qilish:**
   ```bash
   npm run build
   ```
