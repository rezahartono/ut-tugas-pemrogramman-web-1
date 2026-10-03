# Ringkasan Program SITTA

**SITTA (Sistem Informasi Tiras & Transaksi Bahan Ajar)** — aplikasi web statis Universitas Terbuka untuk login, melihat stok bahan ajar, dan melacak pengiriman.

## Teknologi
- HTML5 statis (4 halaman) + **Tailwind CSS v4** (CDN) + CSS murni (`style.css`)
- **JavaScript vanilla (ES5)** — tanpa framework/bundler
- Data dari file JSON via `fetch()`, sesi login di `localStorage`

## Halaman & Fungsinya

| Halaman | Skrip | Fungsi |
|---|---|---|
| `login.html` | `login.js` | Validasi email+password ke `pengguna.json`, simpan sesi, toast notifikasi, redirect |
| `index.html` | `dashboard.js` | Hero sapaan ("Selamat Pagi/Siang/Sore/Malam") + tanggal Indonesia |
| `stock.html` | `stock.js` | Daftar BMP: pencarian, filter jenis, badge status stok, total eksemplar, modal detail |
| `tracking.html` | `tracking.js` | Daftar nomor DO: pencarian, filter status, modal + **timeline perjalanan** terurut terbaru |

## Skrip Pendukung
- **`script.js`** — `checkLogin()` (proteksi halaman → redirect ke login), `logout()`, `tampilkanPenggunaLogin()` (isi nama/role/avatar dari sesi), `formatTanggalIndonesia()`
- **`notifikasi.js`** — toast `tampilkanNotifikasi({tipe, judul, pesan, durasi})` sebagai pengganti `alert()`, 4 tipe warna, bilah progres, auto-dismiss
- **Data** — `pengguna.json` (5 akun), `bahan-ajar.json` (5 BMP, array), `tracking.json` (2 DO, objek by nomorDO)

## Alur
1. Buka halaman → `checkLogin()` cek `localStorage.isLoggedIn`; jika tidak ada → ke `login.html`.
2. Login berhasil → simpan `pengguna` (tanpa password) + `isLoggedIn="true"` → dashboard.
3. Klik kartu → modal detail (tutup via X, tombol, backdrop, atau Esc).
4. Tombol "Keluar" → hapus sesi → kembali ke login.

## Teknik Kunci
- `amankanTeks()` escape HTML sebelum `innerHTML` (anti injection)
- **Event delegation** — satu listener untuk semua kartu hasil render ulang
- `map().join("")` untuk render array → HTML
- Data attribute: `data-kode`, `data-nomor`, `data-user`, `data-user-avatar`

## Catatan
- Password masih **plaintext** & proteksi halaman hanya flag `localStorage` → simulasi, bukan standar produksi
- Jika `style.css` diubah saat pengujian, naikkan versi cache di `<link>` (`?v=3`)
