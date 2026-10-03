var daftarBahanAjar = [];

var elemen = {
  statusMemuat: document.getElementById("statusMemuat"),
  daftar: document.getElementById("daftarBahanAjar"),
  dataKosong: document.getElementById("dataKosong"),
  inputPencarian: document.getElementById("inputPencarian"),
  filterJenis: document.getElementById("filterJenis"),
  jumlahTampil: document.getElementById("jumlahTampil"),
  totalStok: document.getElementById("totalStok"),
  modal: document.getElementById("modalDetail"),
  modalPanel: document.getElementById("modalPanel"),
  modalKode: document.getElementById("modalKode"),
  modalNama: document.getElementById("modalNama"),
  modalJenis: document.getElementById("modalJenis"),
  modalStatus: document.getElementById("modalStatus"),
  modalCover: document.getElementById("modalCover"),
  modalFields: document.getElementById("modalFields"),
  modalStok: document.getElementById("modalStok"),
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

function formatAngka(angka) {
  return Number(angka || 0).toLocaleString("id-ID");
}

function statusStok(stok) {
  if (stok <= 0) {
    return {
      label: "Stok Habis",
      kelas: "text-red-700 bg-red-100",
    };
  }

  if (stok < 200) {
    return {
      label: "Stok Terbatas",
      kelas: "text-amber-700 bg-amber-100",
    };
  }

  return {
    label: "Stok Tersedia",
    kelas: "text-green-700 bg-green-100",
  };
}

function gantiCoverBahanAjar(gambar) {
  gambar.onerror = null;
  gambar.src = "assets/logo-ut.webp";
  gambar.classList.add("object-contain", "p-6");
}

function ambilDataBahanAjar() {
  return fetch("js/data/bahan-ajar.json")
    .then(function (respons) {
      if (!respons.ok) {
        throw new Error("Gagal memuat data bahan ajar");
      }
      return respons.json();
    })
    .catch(function (error) {
      console.warn("Gagal memuat data:", error.message);
      return [];
    });
}

function isiFilterJenis() {
  var daftarJenis = [];

  daftarBahanAjar.forEach(function (item) {
    if (item.jenisBarang && daftarJenis.indexOf(item.jenisBarang) === -1) {
      daftarJenis.push(item.jenisBarang);
    }
  });

  daftarJenis.sort();

  daftarJenis.forEach(function (jenis) {
    var opsi = document.createElement("option");
    opsi.value = jenis;
    opsi.textContent = jenis;
    elemen.filterJenis.appendChild(opsi);
  });
}

function saringBahanAjar() {
  var kataKunci = (elemen.inputPencarian.value || "").trim().toLowerCase();
  var jenisDipilih = elemen.filterJenis.value;

  return daftarBahanAjar.filter(function (item) {
    var cocokJenis = !jenisDipilih || item.jenisBarang === jenisDipilih;
    var teksPencarian = [item.kodeBarang, item.namaBarang, item.kodeLokasi]
      .join(" ")
      .toLowerCase();
    var cocokKataKunci = !kataKunci || teksPencarian.indexOf(kataKunci) !== -1;

    return cocokJenis && cocokKataKunci;
  });
}

function buatKartuBahanAjar(item) {
  var status = statusStok(Number(item.stok));

  return (
    "" +
    '<article class="bahan-ajar-card bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer" ' +
    'data-kode="' +
    amankanTeks(item.kodeBarang) +
    '">' +
    '    <div class="relative">' +
    '        <img src="' +
    amankanTeks(item.cover) +
    '" alt="Cover ' +
    amankanTeks(item.namaBarang) +
    '" ' +
    'class="w-full h-40 object-cover bg-third" onerror="gantiCoverBahanAjar(this)">' +
    '        <span class="absolute top-3 left-3 text-xs font-semibold bg-white/90 text-primary px-2.5 py-1 rounded-full">' +
    amankanTeks(item.jenisBarang) +
    "</span>" +
    '        <span class="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ' +
    status.kelas +
    '">' +
    amankanTeks(status.label) +
    "</span>" +
    "    </div>" +
    '    <div class="flex-1 flex flex-col gap-3 p-4">' +
    '        <div class="flex flex-col">' +
    '            <span class="text-xs text-gray-500">' +
    amankanTeks(item.kodeBarang) +
    " &bull; Edisi " +
    amankanTeks(item.edisi) +
    "</span>" +
    '            <span class="font-semibold leading-snug">' +
    amankanTeks(item.namaBarang) +
    "</span>" +
    "        </div>" +
    '        <span class="text-xs text-gray-500 flex items-center gap-2">' +
    '            <i class="fa-solid fa-location-dot"></i>' +
    amankanTeks(item.kodeLokasi) +
    "        </span>" +
    '        <div class="flex items-center justify-between gap-3 pt-3 mt-auto border-t border-gray-100">' +
    '            <div class="flex flex-col">' +
    '                <span class="text-xs text-gray-500">Stok</span>' +
    '                <span class="font-semibold text-primary">' +
    formatAngka(item.stok) +
    '                    <span class="text-xs font-normal text-gray-500">eksemplar</span>' +
    "                </span>" +
    "            </div>" +
    '            <span class="bg-primary text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-2">' +
    '                <i class="fa-regular fa-eye"></i> Detail' +
    "            </span>" +
    "        </div>" +
    "    </div>" +
    "</article>"
  );
}

function tampilkanDaftar() {
  var hasil = saringBahanAjar();

  elemen.daftar.innerHTML = hasil.map(buatKartuBahanAjar).join("");

  var total = hasil.reduce(function (jumlah, item) {
    return jumlah + Number(item.stok || 0);
  }, 0);

  elemen.jumlahTampil.textContent = formatAngka(hasil.length);
  elemen.totalStok.textContent = formatAngka(total);

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

function bukaDetail(kodeBarang) {
  var item = daftarBahanAjar.filter(function (data) {
    return String(data.kodeBarang) === String(kodeBarang);
  })[0];

  if (!item) {
    return;
  }

  var status = statusStok(Number(item.stok));

  elemen.modalKode.textContent = "Kode Barang: " + item.kodeBarang;
  elemen.modalNama.textContent = item.namaBarang;
  elemen.modalJenis.textContent = item.jenisBarang;
  elemen.modalStatus.textContent = status.label;
  elemen.modalStatus.className =
    "text-xs font-semibold px-2.5 py-1 rounded-full " + status.kelas;
  elemen.modalStok.textContent = formatAngka(item.stok) + " eksemplar";

  elemen.modalCover.classList.remove("object-contain", "p-6");
  elemen.modalCover.setAttribute("onerror", "gantiCoverBahanAjar(this)");
  elemen.modalCover.src = item.cover;

  elemen.modalFields.innerHTML =
    buatFieldDetail("Kode Barang", item.kodeBarang) +
    buatFieldDetail("Kode Lokasi", item.kodeLokasi) +
    buatFieldDetail("Jenis Barang", item.jenisBarang) +
    buatFieldDetail("Edisi", item.edisi);

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
    var kartu = event.target.closest(".bahan-ajar-card");

    if (kartu) {
      bukaDetail(kartu.dataset.kode);
    }
  });

  elemen.inputPencarian.addEventListener("input", tampilkanDaftar);
  elemen.filterJenis.addEventListener("change", tampilkanDaftar);

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

  ambilDataBahanAjar().then(function (data) {
    daftarBahanAjar = Array.isArray(data) ? data : [];

    elemen.statusMemuat.classList.add("hidden");
    isiFilterJenis();
    tampilkanDaftar();
  });
});
