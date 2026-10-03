function ambilDataPengguna() {
  return fetch("js/data/pengguna.json")
    .then(function (respons) {
      if (!respons.ok) {
        throw new Error("Gagal memuat data pengguna");
      }
      return respons.json();
    })
    .catch(function (error) {
      console.warn("Gagal memuat data:", error.message);
      return [];
    });
}

function siapkanTogglePassword() {
  var tombol = document.getElementById("togglePassword");
  var input = document.getElementById("password");

  if (!tombol || !input) {
    return;
  }

  tombol.addEventListener("click", function () {
    var sedangTersembunyi = input.type === "password";
    input.type = sedangTersembunyi ? "text" : "password";

    var ikon = tombol.querySelector("i");
    if (ikon) {
      ikon.classList.toggle("fa-eye", !sedangTersembunyi);
      ikon.classList.toggle("fa-eye-slash", sedangTersembunyi);
    }
  });
}

function prosesLogin(daftarPengguna, email, password) {
  var penggunaDitemukan = null;

  daftarPengguna.forEach(function (pengguna) {
    if (
      String(pengguna.email).toLowerCase() === email.toLowerCase() &&
      String(pengguna.password) === password
    ) {
      penggunaDitemukan = pengguna;
    }
  });

  return penggunaDitemukan;
}

function siapkanFormLogin() {
  var form = document.getElementById("formLogin");
  var inputEmail = document.getElementById("email");
  var inputPassword = document.getElementById("password");

  if (!form || !inputEmail || !inputPassword) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = (inputEmail.value || "").trim();
    var password = inputPassword.value || "";

    if (!email || !password) {
      tampilkanNotifikasi({
        tipe: "peringatan",
        judul: "Data Belum Lengkap",
        pesan: "Email dan kata sandi wajib diisi terlebih dahulu.",
      });
      return;
    }

    ambilDataPengguna().then(function (daftarPengguna) {
      if (!daftarPengguna || daftarPengguna.length === 0) {
        tampilkanNotifikasi({
          tipe: "galat",
          judul: "Data Pengguna Tidak Tersedia",
          pesan:
            "Daftar pengguna gagal dimuat. Jalankan aplikasi melalui server lokal, lalu coba lagi.",
          durasi: 6000,
        });
        return;
      }

      var pengguna = prosesLogin(daftarPengguna, email, password);

      if (!pengguna) {
        tampilkanNotifikasi({
          tipe: "galat",
          judul: "Login Gagal",
          pesan: "Email atau kata sandi salah. Silakan coba lagi.",
        });
        return;
      }

      var dataMasuk = {
        id: pengguna.id,
        nama: pengguna.nama,
        email: pengguna.email,
        role: pengguna.role,
        lokasi: pengguna.lokasi,
      };

      localStorage.setItem("pengguna", JSON.stringify(dataMasuk));
      localStorage.setItem("isLoggedIn", "true");

      tampilkanNotifikasi({
        tipe: "sukses",
        judul: "Login Berhasil",
        pesan:
          "Selamat datang, " + pengguna.nama + "! Mengarahkan ke dashboard...",
        durasi: 1500,
      });

      setTimeout(function () {
        window.location.href = "index.html";
      }, 1000);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
    return;
  }

  siapkanTogglePassword();
  siapkanFormLogin();
});
