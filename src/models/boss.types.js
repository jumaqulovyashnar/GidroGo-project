/**
 * @typedef {Object} NormalizedBoss
 * @property {string|number} id - Foydalanuvchi identifikatori
 * @property {string} fullName - To'liq ism-familiyasi
 * @property {string} avatarUrl - Avatar rasm URL manzili
 * @property {string} phone - Telefon raqami
 * @property {string} farmName - Ferma nomi
 * @property {string|number} farmId - Ferma ID raqami
 * @property {string} farmImage - Ferma logotipi yoki avatar
 * @property {boolean} isActive - Hisob faol yoki bloklangan holati
 * @property {string} createdAtStr - Formatlangan ro'yxatdan o'tgan sanasi
 * @property {number} createdAtTimestamp - Timestamp (saralash va hisoblash uchun)
 * @property {Object} raw - Asl API ob'yekti (modallar uchun kerak)
 */

/**
 * @typedef {Object} BossStats
 * @property {number} total - Jami rahbarlar soni
 * @property {number} active - Faol rahbarlar soni
 * @property {number} blocked - Bloklangan rahbarlar soni
 * @property {number} recently - So'nggi 30 kunda qo'shilganlar
 */

/**
 * @typedef {Object} BossFilters
 * @property {string} search - Qidiruv so'zi
 * @property {"all"|"active"|"blocked"} status - Holat bo'yicha filter
 * @property {string} farm - Ferma bo'yicha filter
 */
