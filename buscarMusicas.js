const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvHeKJfAPpEYpsrieTFK5I_xcE-bBIpkGQRBmK-yrw1PBTZEblaxyUInsbDEPusum2R37hsHCunLir/pub?gid=0&single=true&output=csv";
let todasAsMusicas = [];
let colunas = [];

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function exibirMusicas(filtro = "") {
    const corpoTabela = document.getElementById("musicas");
    const cabecalho = document.getElementById("cabecalho");
    corpoTabela.innerHTML = "";
    cabecalho.innerHTML = "";

    const filtroNormalizado = normalizarTexto(filtro);

    const musicasFiltradas = todasAsMusicas.filter(item =>
        Object.values(item).some(valor => normalizarTexto(valor || "").includes(filtroNormalizado))
    );

    if (musicasFiltradas.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="100%" class="se" style="color: red; text-align: center;">Nenhum resultado encontrado. Tente outra busca.</td></tr>';
        return;
    }

    colunas.forEach(coluna => {
        const th = document.createElement("th");
        th.textContent = coluna;
        cabecalho.appendChild(th);
    });

    musicasFiltradas.forEach(item => {
        const linha = document.createElement("tr");
        colunas.forEach(coluna => {
            const celula = document.createElement("td");
            celula.textContent = item[coluna] || "-";
            linha.appendChild(celula);
        });
        corpoTabela.appendChild(linha);
    });
}

function inicializarTabela() {
    Papa.parse(sheetUrl, {
        download: true,
        header: true,
        complete: function(results) {
            todasAsMusicas = results.data;
            colunas = results.meta.fields;
        }
    });
}

function search() {
    const filtro = document.getElementById("searchInput").value;
    exibirMusicas(filtro);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput").value = "";
    inicializarTabela();

    document.getElementById("searchInput").addEventListener("keypress", e => {
        if (e.key === "Enter") {
            search();
        }
    });

    document.getElementById("openMinistersModal").addEventListener("click", () => {
        document.getElementById("ministersModal").style.display = "flex";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.getElementById("ministersModal").style.display = "none";
    });

    window.addEventListener("click", event => {
        if (event.target.id === "ministersModal") {
            document.getElementById("ministersModal").style.display = "none";
        }
    });
});
