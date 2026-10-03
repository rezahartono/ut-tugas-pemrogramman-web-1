var NAMA_HARI = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

var NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatTanggalIndonesia(tanggal) {
  return (
    NAMA_HARI[tanggal.getDay()] +
    ", " +
    tanggal.getDate() +
    " " +
    NAMA_BULAN[tanggal.getMonth()] +
    " " +
    tanggal.getFullYear()
  );
}

function checkLogin() {
  var isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!(isLoggedIn === "true")) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("pengguna");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

function ambilPenggunaLogin() {
  try {
    return JSON.parse(localStorage.getItem("pengguna")) || null;
  } catch (error) {
    console.warn("Gagal memuat data:", error.message);
    return null;
  }
}

function tampilkanPenggunaLogin() {
  var pengguna = ambilPenggunaLogin();

  if (!pengguna) {
    return;
  }

  document.querySelectorAll("[data-user]").forEach(function (elemen) {
    var field = elemen.getAttribute("data-user");

    if (pengguna[field] !== undefined && pengguna[field] !== null) {
      elemen.textContent = pengguna[field];
    }
  });

  document.querySelectorAll("[data-user-avatar]").forEach(function (avatar) {
    if (pengguna.nama) {
      avatar.src =
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(pengguna.nama).replace(/%20/g, "+");
    }
  });
}
