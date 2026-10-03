var daftarTracking = [];

var elemen = {
  statusMemuat: document.getElementById("statusMemuat"),
  daftar: document.getElementById("daftarTracking"),
  dataKosong: document.getElementById("dataKosong"),
  inputPencarian: document.getElementById("inputPencarian"),
  filterStatus: document.getElementById("filterStatus"),
  jumlahTampil: document.getElementById("jumlahTampil"),
  totalProses: document.getElementById("totalProses"),
  modal: document.getElementById("modalDetail"),
  modalPanel: document.getElementById("modalPanel"),
  modalNomor: document.getElementById("modalNomor"),
  modalNama: document.getElementById("modalNama"),
  modalRingkas: document.getElementById("modalRingkas"),
  modalStatus: document.getElementById("modalStatus"),
  modalTotal: document.getElementById("modalTotal"),
  modalFields: document.getElementById("modalFields"),
  modalTimeline: document.getElementById("modalTimeline"),
  modalJumlahPerjalanan: document.getElementById("modalJumlahPerjalanan"),
  tombolTutup: document.getElementById("tombolTutup"),
  tombolTutupAtas: document.getElementById("tombolTutupAtas"),
};

function amankanTeks(teks) {
  return String(teks === null || teks === undefined ? "" : teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function duaDigit(angka) {
  return (angka < 10 ? "0" : "") + angka;
}

function ubahKeTanggal(waktu) {
  var hasil = new Date(String(waktu || "").replace(" ", "T"));
  return isNaN(hasil.getTime()) ? null : hasil;
}

function formatTanggalKirim(tanggal) {
  var bagian = String(tanggal || "").split("-");

  if (bagian.length !== 3) {
    return String(tanggal || "-");
  }

  var hasil = new Date(
    Number(bagian[0]),
    Number(bagian[1]) - 1,
    Number(bagian[2]),
  );

  if (isNaN(hasil.getTime())) {
    return String(tanggal || "-");
  }

  return (
    hasil.getDate() +
    " " +
    NAMA_BULAN[hasil.getMonth()] +
    " " +
    hasil.getFullYear()
  );
}

function formatWaktuPerjalanan(waktu) {
  var tanggal = ubahKeTanggal(waktu);

  if (!tanggal) {
    return String(waktu || "-");
  }

  return (
    formatTanggalIndonesia(tanggal) +
    " • " +
    duaDigit(tanggal.getHours()) +
    ":" +
    duaDigit(tanggal.getMinutes())
  );
}

function statusPengiriman(status) {
  var teks = String(status || "").toLowerCase();

  if (
    teks.indexOf("selesai") !== -1 ||
    teks.indexOf("diterima") !== -1 ||
    teks.indexOf("terkirim") !== -1
  ) {
    return {
      label: status || "-",
      kelas: "text-green-700 bg-green-100",
      selesai: true,
    };
  }

  if (teks.indexOf("perjalanan") !== -1 || teks.indexOf("transit") !== -1) {
    return {
      label: status || "-",
      kelas: "text-blue-700 bg-blue-100",
      selesai: false,
    };
  }

  if (
    teks.indexOf("dikirim") !== -1 ||
    teks.indexOf("antar") !== -1 ||
    teks.indexOf("proses") !== -1
  ) {
    return {
      label: status || "-",
      kelas: "text-amber-700 bg-amber-100",
      selesai: false,
    };
  }

  return {
    label: status || "-",
    kelas: "text-gray-700 bg-gray-100",
    selesai: false,
  };
}

function urutkanPerjalanan(perjalanan) {
  return perjalanan.slice().sort(function (a, b) {
    var waktuA = ubahKeTanggal(a.waktu);
    var waktuB = ubahKeTanggal(b.waktu);

    return (waktuB ? waktuB.getTime() : 0) - (waktuA ? waktuA.getTime() : 0);
  });
}

function ambilDataTracking() {
  return fetch("js/data/tracking.json")
    .then(function (respons) {
      if (!respons.ok) {
        throw new Error("Gagal memuat data tracking pengiriman");
      }
      return respons.json();
    })
    .catch(function (error) {
      console.warn("Gagal memuat data:", error.message);
      return {};
    });
}

function jadikanDaftarTracking(data) {
  return Object.keys(data || {}).map(function (nomor) {
    var item = data[nomor] || {};

    return {
      nomorDO: item.nomorDO || nomor,
      nama: item.nama || "-",
      status: item.status || "-",
      ekspedisi: item.ekspedisi || "-",
      tanggalKirim: item.tanggalKirim || "",
      paket: item.paket || "-",
      total: item.total || "-",
      perjalanan: Array.isArray(item.perjalanan) ? item.perjalanan : [],
    };
  });
}

function isiFilterStatus() {
  var daftarStatus = [];

  daftarTracking.forEach(function (item) {
    if (item.status && daftarStatus.indexOf(item.status) === -1) {
      daftarStatus.push(item.status);
    }
  });

  daftarStatus.sort();

  daftarStatus.forEach(function (status) {
    var opsi = document.createElement("option");
    opsi.value = status;
    opsi.textContent = status;
    elemen.filterStatus.appendChild(opsi);
  });
}

function saringTracking() {
  var kataKunci = (elemen.inputPencarian.value || "").trim().toLowerCase();
  var statusDipilih = elemen.filterStatus.value;

  return daftarTracking.filter(function (item) {
    var cocokStatus = !statusDipilih || item.status === statusDipilih;
    var teksPencarian = [item.nomorDO, item.nama, item.ekspedisi, item.paket]
      .join(" ")
      .toLowerCase();
    var cocokKataKunci = !kataKunci || teksPencarian.indexOf(kataKunci) !== -1;

    return cocokStatus && cocokKataKunci;
  });
}

function buatKartuTracking(item) {
  var status = statusPengiriman(item.status);
  var jumlahPerjalanan = item.perjalanan.length;

  return (
    "" +
    '<article class="tracking-card bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer" ' +
    'data-nomor="' +
    amankanTeks(item.nomorDO) +
    '">' +
    '    <div class="flex items-start justify-between gap-3 p-4 pb-3">' +
    '        <div class="flex items-center gap-3 min-w-0">' +
    '            <span class="w-10 h-10 shrink-0 rounded-full bg-third text-primary flex items-center justify-center">' +
    '                <i class="fa-solid fa-truck-fast"></i>' +
    "            </span>" +
    '            <div class="flex flex-col min-w-0">' +
    '                <span class="text-xs text-gray-500">Nomor DO</span>' +
    '                <span class="font-semibold truncate">' +
    amankanTeks(item.nomorDO) +
    "</span>" +
    "            </div>" +
    "        </div>" +
    '        <span class="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ' +
    status.kelas +
    '">' +
    amankanTeks(status.label) +
    "</span>" +
    "    </div>" +
    '    <div class="flex flex-col gap-2 px-4">' +
    '        <span class="text-sm flex items-center gap-2">' +
    '            <i class="fa-solid fa-user text-gray-400 w-4 text-center"></i>' +
    amankanTeks(item.nama) +
    "        </span>" +
    '        <span class="text-sm flex items-center gap-2">' +
    '            <i class="fa-solid fa-truck text-gray-400 w-4 text-center"></i>' +
    amankanTeks(item.ekspedisi) +
    "        </span>" +
    '        <span class="text-sm flex items-center gap-2">' +
    '            <i class="fa-solid fa-box text-gray-400 w-4 text-center"></i>' +
    amankanTeks(item.paket) +
    '            <span class="text-xs text-gray-500">&bull; ' +
    amankanTeks(formatTanggalKirim(item.tanggalKirim)) +
    "</span>" +
    "        </span>" +
    '        <span class="text-sm flex items-center gap-2">' +
    '            <i class="fa-solid fa-route text-gray-400 w-4 text-center"></i>' +
    '            <span class="text-xs text-gray-500">' +
    jumlahPerjalanan +
    " riwayat perjalanan</span>" +
    "        </span>" +
    "    </div>" +
    '    <div class="flex items-center justify-between gap-3 p-4 pt-3 mt-auto border-t border-gray-100">' +
    '        <div class="flex flex-col">' +
    '            <span class="text-xs text-gray-500">Total</span>' +
    '            <span class="font-semibold text-primary">' +
    amankanTeks(item.total) +
    "</span>" +
    "        </div>" +
    '        <span class="bg-primary text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-2">' +
    '            <i class="fa-regular fa-eye"></i> Lacak Detail' +
    "        </span>" +
    "    </div>" +
    "</article>"
  );
}

function tampilkanDaftar() {
  var hasil = saringTracking();

  elemen.daftar.innerHTML = hasil.map(buatKartuTracking).join("");

  var diproses = hasil.filter(function (item) {
    return !statusPengiriman(item.status).selesai;
  }).length;

  elemen.jumlahTampil.textContent = hasil.length;
  elemen.totalProses.textContent = diproses;

  var kosong = hasil.length === 0;
  elemen.daftar.classList.toggle("hidden", kosong);
  elemen.dataKosong.classList.toggle("hidden", !kosong);
  elemen.dataKosong.classList.toggle("flex", kosong);
}

function buatFieldDetail(label, nilai) {
  return (
    "" +
    '<div class="rounded-lg border border-gray-100 px-3 py-2 flex flex-col">' +
    '    <span class="text-xs text-gray-500">' +
    amankanTeks(label) +
    "</span>" +
    '    <span class="text-sm font-medium">' +
    amankanTeks(nilai) +
    "</span>" +
    "</div>"
  );
}

function buatItemTimeline(perjalanan, terkini, terakhir) {
  var titik = terkini
    ? '<span class="w-3 h-3 rounded-full bg-primary ring-[3px] ring-secondary"></span>'
    : '<span class="w-2.5 h-2.5 rounded-full bg-gray-300"></span>';

  var garis = terakhir
    ? ""
    : '<span class="flex-1 w-px bg-gray-200 my-1"></span>';

  var lencana = terkini
    ? '<span class="text-[10px] font-semibold text-primary bg-secondary px-2 py-0.5 rounded-full">Status Terkini</span>'
    : "";

  return (
    "" +
    '<div class="flex gap-3">' +
    '    <div class="flex flex-col items-center shrink-0">' +
    '        <span class="w-4 h-4 flex items-center justify-center">' +
    titik +
    "</span>" +
    garis +
    "    </div>" +
    '    <div class="flex-1 min-w-0 flex flex-col gap-1 ' +
    (terakhir ? "" : "pb-5") +
    '">' +
    '        <div class="flex items-center gap-2 flex-wrap">' +
    '            <span class="text-xs font-semibold ' +
    (terkini ? "text-primary" : "text-gray-700") +
    '">' +
    amankanTeks(formatWaktuPerjalanan(perjalanan.waktu)) +
    "            </span>" +
    lencana +
    "        </div>" +
    '        <span class="text-sm ' +
    (terkini ? "text-gray-900 font-medium" : "text-gray-600") +
    ' leading-relaxed">' +
    amankanTeks(perjalanan.keterangan) +
    "        </span>" +
    "    </div>" +
    "</div>"
  );
}

function buatTimeline(perjalanan) {
  var urut = urutkanPerjalanan(perjalanan);

  if (urut.length === 0) {
    return '<span class="text-sm text-gray-500">Belum ada riwayat perjalanan untuk pengiriman ini.</span>';
  }

  return urut
    .map(function (item, index) {
      return buatItemTimeline(item, index === 0, index === urut.length - 1);
    })
    .join("");
}

function bukaDetail(nomorDO) {
  var item = daftarTracking.filter(function (data) {
    return String(data.nomorDO) === String(nomorDO);
  })[0];

  if (!item) {
    return;
  }

  var status = statusPengiriman(item.status);

  elemen.modalNomor.textContent = "Nomor DO: " + item.nomorDO;
  elemen.modalNama.textContent = item.nama;
  elemen.modalRingkas.textContent =
    "Ekspedisi " + item.ekspedisi + " • Paket " + item.paket;
  elemen.modalStatus.textContent = status.label;
  elemen.modalStatus.className =
    "text-xs font-semibold px-2.5 py-1 rounded-full " + status.kelas;
  elemen.modalTotal.textContent = item.total;

  elemen.modalFields.innerHTML =
    buatFieldDetail("Nomor DO", item.nomorDO) +
    buatFieldDetail("Nama Penerima", item.nama) +
    buatFieldDetail("Ekspedisi", item.ekspedisi) +
    buatFieldDetail("Paket", item.paket) +
    buatFieldDetail("Tanggal Kirim", formatTanggalKirim(item.tanggalKirim)) +
    buatFieldDetail("Total", item.total);

  elemen.modalTimeline.innerHTML = buatTimeline(item.perjalanan);
  elemen.modalJumlahPerjalanan.textContent =
    item.perjalanan.length + " riwayat";

  elemen.modal.classList.remove("hidden");
  elemen.modal.classList.add("flex");
  elemen.modalPanel.classList.add("popup-muncul");
}

function tutupDetail() {
  elemen.modal.classList.add("hidden");
  elemen.modal.classList.remove("flex");
  elemen.modalPanel.classList.remove("popup-muncul");
}

function pasangEvent() {
  elemen.daftar.addEventListener("click", function (event) {
    var kartu = event.target.closest(".tracking-card");

    if (kartu) {
      bukaDetail(kartu.dataset.nomor);
    }
  });

  elemen.inputPencarian.addEventListener("input", tampilkanDaftar);
  elemen.filterStatus.addEventListener("change", tampilkanDaftar);

  elemen.tombolTutup.addEventListener("click", tutupDetail);
  elemen.tombolTutupAtas.addEventListener("click", tutupDetail);

  elemen.modal.addEventListener("click", function (event) {
    if (event.target === elemen.modal) {
      tutupDetail();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !elemen.modal.classList.contains("hidden")) {
      tutupDetail();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  pasangEvent();

  ambilDataTracking().then(function (data) {
    daftarTracking = jadikanDaftarTracking(data);

    elemen.statusMemuat.classList.add("hidden");
    isiFilterStatus();
    tampilkanDaftar();
  });
});
