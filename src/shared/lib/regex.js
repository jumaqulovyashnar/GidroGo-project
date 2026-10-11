/**
 * Loyiha bo'yicha barcha inputlar uchun yagona Regex (muntazam ifodalar) to'plami.
 */

// 1. Telefon raqamlari (+998901234567, +998 90 123 45 67, 901234567, +998(90)123-45-67)
export const PHONE_REGEX = /^(?:\+?998)?[\s.-]?\(?\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/

// 2. Ism va Familiya (Lotin, Kirill, oʻ, gʻ, boʻsh joy, tire, apostroflar)
export const NAME_REGEX = /^[A-Za-zА-Яа-яЁёʻ'`ʼ\s-]+$/u

// 3. To'liq F.I.Sh (Kamida 2 ta so'z: Ism va Familiya)
export const FULL_NAME_REGEX = /^[A-Za-zА-Яа-яЁёʻ'`ʼ-]+(?:\s+[A-Za-zА-Яа-яЁёʻ'`ʼ-]+)+$/u

// 4. Login yoki Foydalanuvchi nomi (harflar, raqamlar, nuqta, tire, tagchiziq)
export const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,30}$/

// 5. Elektron pochta (Email)
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// 6. Xavfsiz parol (Kamida 8 ta belgi, kamida 1 ta harf va 1 ta raqam)
export const PASSWORD_STRONG_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,50}$/

// 7. Standart parol (Kamida 4 ta belgi)
export const PASSWORD_BASIC_REGEX = /^\S{4,50}$/

// 8. Musbat butun son (Idishlar soni, hisoblagichlar, dona)
export const POSITIVE_INTEGER_REGEX = /^[1-9]\d*$/

// 9. Pul summasi / Narx (musbat son, ixtiyoriy 2 xonagacha tiyin)
export const AMOUNT_REGEX = /^[1-9]\d*(?:\.\d{1,2})?$/

// 10. Koordinatalar (Latitude va Longitude raqamlari)
export const COORDINATE_REGEX = /^-?\d+(?:\.\d+)?$/

// 11. Korxona / Ferma nomi
export const BUSINESS_NAME_REGEX = /^[a-zA-Z0-9А-Яа-яЁёʻ'`ʼ\s\-.,&()№"']{2,100}$/u
