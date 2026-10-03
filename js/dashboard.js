function sapaanSekarang(jam) {
  if (jam >= 1 && jam < 10) {
    return "Selamat Pagi";
  }

  if (jam >= 10 && jam < 15) {
    return "Selamat Siang";
  }

  if (jam >= 15 && jam < 18) {
    return "Selamat Sore";
  }

  return "Selamat Malam";
}

function tampilkanWaktuSekarang() {
  var sekarang = new Date();

  document.querySelectorAll("#sapaan").forEach(function (elemen) {
    elemen.textContent = sapaanSekarang(sekarang.getHours());
  });

  document.querySelectorAll("#tanggalSekarang").forEach(function (elemen) {
    elemen.textContent = formatTanggalIndonesia(sekarang);
  });
}
