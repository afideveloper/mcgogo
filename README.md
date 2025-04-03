# MCGoGo Enemy Predictor by Afidz

MCGoGo Enemy Predictor adalah aplikasi berbasis Next.js yang dirancang untuk membantu memprediksi musuh pada game Magic Chess. Aplikasi ini menggunakan logika prediksi yang mengharuskan pengguna memasukkan beberapa input secara manual (misal: nama p8, input untuk ronde 2, 4, 5, dan 6) sehingga beberapa ronde dapat terprediksi secara otomatis. 

Aplikasi ini memiliki dua tabel:
- **Tabel Ronde 1–7:** Tempat pengguna mengisi dan mendapatkan prediksi secara otomatis.
- **Tabel Ronde 8–14:** Merupakan salinan (jiplakan) isian tabel ronde 1–7 dengan nomor ronde di-offset (8 = ronde 1, 9 = ronde 2, dst). Tabel ini hanya bersifat read-only dan dapat ditampilkan/disembunyikan menggunakan tombol toggle.

## Preview

Lihat preview aplikasi di: [https://mcgogo.vercel.app/](https://mcgogo.vercel.app/)

## Cara Kerja

- **Global Input:**  
  Masukkan nama **p8** (musuh pertama/mantan pertama) yang akan digunakan di ronde 1.

- **Tabel Ronde 1–7:**  
  - **Ronde 1:** Otomatis diisi dengan *User vs = p8* dan *p8 vs = "user"*.
  - **Ronde 2 & 4:** Diisi secara manual oleh pengguna.
  - **Ronde 3:** Terprediksi dari ronde 2 (User vs = input p8 vs ronde 2, dan sebaliknya).
  - **Ronde 5:** User vs terprediksi dari input p8 vs di ronde 4, sedangkan p8 vs harus diisi manual (dengan placeholder dinamis).
  - **Ronde 6:** User vs terprediksi dari input p8 vs di ronde 5, sedangkan p8 vs harus diisi manual (misal: p6).
  - **Ronde 7:** Terprediksi otomatis berdasarkan ronde 6.

- **Tabel Ronde 8–14:**  
  Merupakan duplikasi (jiplakan) isian tabel ronde 1–7 dengan nomor ronde ditambahkan 7. Tabel ini hanya untuk tampilan (read-only).

## Credits

Dibuat dengan rumus dari YT Alphine dengan bantuan ChatGPT 03-mini-high

## Cara Menjalankan

Pastikan Anda sudah menginstall [Node.js](https://nodejs.org/) (versi 16) dan kemudian ikuti langkah berikut:

1. Clone repository ini:
   ```bash
   git clone https://github.com/username/mcgogo-enemy-predictor.git
