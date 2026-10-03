// Komponen notifikasi (toast) sebagai pengganti alert() bawaan browser.
var GAYA_NOTIFIKASI = {
  sukses: {
    ikon: "fa-solid fa-circle-check",
    kelasIkon: "bg-green-100 text-green-700",
    kelasBar: "bg-green-500",
  },
  galat: {
    ikon: "fa-solid fa-circle-xmark",
    kelasIkon: "bg-red-100 text-red-700",
    kelasBar: "bg-red-500",
  },
  peringatan: {
    ikon: "fa-solid fa-triangle-exclamation",
    kelasIkon: "bg-amber-100 text-amber-700",
    kelasBar: "bg-amber-500",
  },
  informasi: {
    ikon: "fa-solid fa-circle-info",
    kelasIkon: "bg-secondary text-primary",
    kelasBar: "bg-primary",
  },
};

var wadahNotifikasi = null;

function amankanTeksNotifikasi(teks) {
  return String(teks === null || teks === undefined ? "" : teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pastikanWadahNotifikasi() {
  if (wadahNotifikasi && document.body.contains(wadahNotifikasi)) {
    return wadahNotifikasi;
  }

  wadahNotifikasi = document.createElement("div");
  wadahNotifikasi.id = "wadahNotifikasi";
  wadahNotifikasi.className =
    "fixed top-4 right-4 sm:top-5 sm:right-5 z-50 w-[calc(100vw-2rem)] sm:w-[24rem] max-w-[24rem] flex flex-col items-stretch gap-3 pointer-events-none";
  wadahNotifikasi.setAttribute("aria-live", "polite");
  document.body.appendChild(wadahNotifikasi);

  return wadahNotifikasi;
}

function tutupNotifikasi(kartu) {
  if (!kartu || kartu.dataset.menutup === "true") {
    return;
  }

  kartu.dataset.menutup = "true";
  clearTimeout(Number(kartu.dataset.timer || 0));
  kartu.classList.add("notifikasi-hilang");

  setTimeout(function () {
    kartu.remove();
  }, 220);
}

function tampilkanNotifikasi(opsi) {
  opsi = opsi || {};

  var tipe = GAYA_NOTIFIKASI[opsi.tipe] ? opsi.tipe : "informasi";
  var gaya = GAYA_NOTIFIKASI[tipe];
  var durasi = typeof opsi.durasi === "number" ? opsi.durasi : 4000;
  var wadah = pastikanWadahNotifikasi();

  while (wadah.children.length >= 4) {
    wadah.firstElementChild.remove();
  }

  var kartu = document.createElement("div");
  kartu.className =
    "notifikasi-muncul pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden";
  kartu.setAttribute("role", "alert");
  kartu.innerHTML =
    '<div class="flex items-start gap-3 p-4 pb-3">' +
    '    <span class="w-9 h-9 shrink-0 rounded-full flex items-center justify-center ' +
    gaya.kelasIkon +
    '"><i class="' +
    gaya.ikon +
    '"></i></span>' +
    '    <div class="flex-1 min-w-0 flex flex-col gap-0.5">' +
    '        <span class="text-sm font-semibold">' +
    amankanTeksNotifikasi(opsi.judul || "") +
    "</span>" +
    '        <span class="text-xs text-gray-600 leading-relaxed">' +
    amankanTeksNotifikasi(opsi.pesan || "") +
    "</span>" +
    "    </div>" +
    '    <button type="button" aria-label="Tutup notifikasi" ' +
    'class="notifikasi-tutup w-7 h-7 -mt-1 -mr-1 shrink-0 cursor-pointer rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600">' +
    '        <i class="fa-solid fa-xmark text-sm"></i>' +
    "    </button>" +
    "</div>" +
    '<div class="h-1 bg-gray-100">' +
    '    <span class="notifikasi-progres block h-full origin-left ' +
    gaya.kelasBar +
    '"></span>' +
    "</div>";

  kartu
    .querySelector(".notifikasi-tutup")
    .addEventListener("click", function () {
      tutupNotifikasi(kartu);
    });

  wadah.appendChild(kartu);

  var progres = kartu.querySelector(".notifikasi-progres");

  if (durasi > 0 && progres) {
    progres.style.transform = "scaleX(1)";
    void progres.offsetWidth;
    progres.style.transition = "transform " + durasi + "ms linear";
    progres.style.transform = "scaleX(0)";

    kartu.dataset.timer = String(
      setTimeout(function () {
        tutupNotifikasi(kartu);
      }, durasi),
    );
  } else if (progres) {
    progres.style.display = "none";
  }

  return kartu;
}
