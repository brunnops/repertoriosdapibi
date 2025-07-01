const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvHeKJfAPpEYpsrieTFK5I_xcE-bBIpkGQRBmK-yrw1PBTZEblaxyUInsbDEPusum2R37hsHCunLir/pub?gid=0&single=true&output=csv";

let todasAsMusicas = [];
let colunas = [];

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function exibirMusicas(filtro = "") {
  const corpoTabela = document.getElementById("musicas");
  const tabelaWrapper = document.querySelector(".tabela-wrapper");
  const cabecalho = document.getElementById("cabecalho");
  corpoTabela.innerHTML = "";
  cabecalho.innerHTML = "";

  const filtroNormalizado = normalizarTexto(filtro);
  const musicasFiltradas = todasAsMusicas.filter(item =>
    Object.values(item).some(valor =>
      normalizarTexto(valor || "").includes(filtroNormalizado)
    )
  );

  if (musicasFiltradas.length === 0) {
    tabelaWrapper.style.display = "none";
    corpoTabela.innerHTML = '<tr><td colspan="100%" style="text-align: center; color: red;">Nenhum resultado encontrado.</td></tr>';
    return;
  }

  tabelaWrapper.style.display = "block";

  colunas.forEach(coluna => {
    const th = document.createElement("th");
    th.textContent = coluna;
    cabecalho.appendChild(th);
  });

  musicasFiltradas.forEach(item => {
    const linha = document.createElement("tr");
    colunas.forEach(coluna => {
      const celula = document.createElement("td");

      if (coluna === "LINK DO YOUTUBE (VERSÃO)" && item[coluna]) {
        const link = document.createElement("a");
        link.href = item[coluna];
        link.target = "_blank";
        link.className = "link-musica";

        const icon = document.createElement("img");
        icon.src = "https://www.svgrepo.com/show/13671/youtube.svg";
        icon.alt = "YouTube";
        icon.style.width = "16px";
        icon.style.height = "16px";
        icon.style.marginRight = "5px";

        link.appendChild(icon);
        link.appendChild(document.createTextNode("Ver vídeo"));
        celula.appendChild(link);
      } else {
        celula.textContent = item[coluna] || "-";
      }

      linha.appendChild(celula);
    });
    corpoTabela.appendChild(linha);
  });
}

function inicializarTabela() {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: function (results) {
      todasAsMusicas = results.data;
      colunas = results.meta.fields;
    }
  });
}

document.getElementById("botao-busca").addEventListener("click", () => {
  const filtro = document.getElementById("busca").value;
  exibirMusicas(filtro);
});

document.getElementById("busca").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const filtro = document.getElementById("busca").value;
    exibirMusicas(filtro);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("busca").value = "";
  inicializarTabela();

  // Modal
  const modal = document.getElementById("ministersModal");
  const openModal = document.getElementById("openMinistersModal");
  const closeModal = document.querySelector(".close");

  openModal.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
