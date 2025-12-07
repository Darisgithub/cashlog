# 💰 CashLog - Expense Tracker

Aplikasi pencatat pengeluaran dengan fitur filter dan dark/light mode. Semua data tersimpan otomatis di browser Anda menggunakan localStorage.

## ✨ Fitur Utama

- 📝 **Tambah Pengeluaran** - Catat pengeluaran dengan tanggal, jenis, dan nominal
- 🔍 **Filter Lengkap** - Filter berdasarkan hari, minggu, bulan, tahun, atau custom date range
- 🌓 **Dark/Light Mode** - Toggle tema dengan penyimpanan preferensi otomatis
- 💾 **Auto Save** - Data tersimpan otomatis di localStorage browser
- 📊 **Ringkasan Real-time** - Total pengeluaran dan jumlah transaksi update otomatis
- 📱 **Responsive Design** - Tampilan optimal di semua ukuran layar
- 🎨 **UI Elegant** - Desain modern dengan glassmorphism dan smooth transitions

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 atau lebih tinggi)
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone https://github.com/Darisgithub/cashlog.git
cd cashlog
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Buka browser di `http://localhost:5173`

## 📦 Build untuk Production

```bash
npm run build
```

File production akan tersimpan di folder `dist/`

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.18
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Storage**: Browser localStorage
- **Font**: Inter (Google Fonts)

## 📁 Struktur Folder

```
cashlog/
├── src/
│   ├── components/
│   │   ├── ExpenseForm.jsx      # Form input pengeluaran
│   │   ├── ExpenseTable.jsx     # Tabel daftar pengeluaran
│   │   ├── Summary.jsx          # Ringkasan total & jumlah
│   │   ├── FilterBar.jsx        # Filter periode & custom date
│   │   └── ThemeToggle.jsx      # Toggle dark/light mode
│   ├── App.jsx                  # Main component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles & Tailwind
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

## 🎯 Cara Penggunaan

### Menambah Pengeluaran

1. Isi tanggal pengeluaran
2. Masukkan jenis/barang (contoh: Makan, Transport)
3. Masukkan nominal dalam Rupiah
4. Klik "Tambah Pengeluaran"

### Filter Pengeluaran

**Preset Filters:**
- **Semua** - Tampilkan semua pengeluaran
- **Hari Ini** - Pengeluaran hari ini saja
- **Minggu Ini** - 7 hari terakhir
- **Bulan Ini** - Bulan berjalan
- **Tahun Ini** - Tahun berjalan

**Custom Date Range:**
1. Klik button "Custom"
2. Pilih tanggal mulai (opsional)
3. Pilih tanggal akhir (opsional)
4. Hasil filter muncul otomatis

### Dark/Light Mode

Klik icon ☀️/🌙 di pojok kanan atas untuk toggle tema. Preferensi Anda akan tersimpan otomatis.

### Hapus Data

- **Hapus satu item**: Klik icon 🗑️ pada baris pengeluaran
- **Hapus semua**: Klik button "Hapus Semua Data" di bagian Ringkasan


## 📊 Data Storage

Aplikasi menggunakan browser localStorage untuk menyimpan:

1. **Expenses Data** - Semua catatan pengeluaran
   - Key: `cashlog_expenses` (atau sesuai `VITE_STORAGE_KEY`)
   - Format: JSON array

2. **Theme Preference** - Preferensi dark/light mode
   - Key: `cashlog_theme` (atau sesuai `VITE_THEME_KEY`)
   - Value: `'light'` atau `'dark'`

**Penting**: Data tersimpan di browser lokal. Jika Anda clear browser data atau ganti browser, data akan hilang.

## 🎨 Customization

### Mengubah Warna

Edit `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        // tambahkan warna custom lainnya
      },
    },
  },
}
```

### Mengubah Font

Edit `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap');

@layer base {
  body {
    font-family: 'YourFont', sans-serif;
  }
}
```

## 🐛 Troubleshooting

### Port sudah digunakan

Jika port 5173 sudah digunakan, Vite akan otomatis mencoba port lain (5174, 5175, dst). Atau ubah di `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000, // port custom
  },
})
```

### Data hilang setelah refresh

Pastikan browser Anda tidak dalam mode incognito/private dan tidak memblokir localStorage.

### Tailwind classes tidak bekerja

1. Pastikan `tailwind.config.js` sudah benar
2. Restart dev server: `Ctrl+C` lalu `npm run dev`
3. Clear cache: hapus folder `node_modules/.vite`

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build untuk production
npm run preview      # Preview production build

# Linting (jika ada)
npm run lint         # Check code quality
```

## 🤝 Contributing

Contributions are welcome!
