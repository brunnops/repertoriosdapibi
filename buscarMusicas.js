// Função para remover acentos das strings
function removeAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Função para escapar caracteres especiais em expressões regulares
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Função para exibir os resultados
function displayResults(results) {
    let html = '<table><thead><tr><th>Quem ministra</th><th>Música</th><th>Cantor/Banda/Versão</th><th>Tom Original</th><th>Tom Adaptado</th><th>Observações</th></tr></thead><tbody>';

    results.forEach(row => {
        html += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td></tr>`;
    });

    html += '</tbody></table>';
    $("#results").html(html);
}

function search() {
    const query = removeAcentos($("#searchInput").val().toLowerCase().trim());
    const sheetID = '1rEmtLEKMz7wGXYs2y3FKpp_BCcNVI4y_UmtL7AC-noY';
    const apiKey = 'AIzaSyAc1AvFjueKSY6yTiOv6g6-dJY7a05urLk';
    const sheetName = 'REPERTORIOS';

    if (query === "") {
        $("#results").html('<p style="color: red;">Por favor, insira uma palavra-chave válida para a busca.</p>');
        return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

    $.getJSON(url).then(function(data) {
        const rows = data.values;

        if (!rows || rows.length === 0) {
            console.log("Nenhum dado encontrado");
            return;
        }

        const escapedQuery = escapeRegExp(query);
        const regex = new RegExp(`(^|\\s)${escapedQuery}(?=\\s|$)`, "i");

        const results = rows.filter(row => 
            row.some(col => regex.test(removeAcentos(col || "").toLowerCase()))
        );

        if (results.length === 0) {
            $("#results").html('<p style="color: red;">Nenhum resultado encontrado. Tente outra busca.</p>');
        } else {
            displayResults(results);
        }
    }).catch(function(error) {
        console.error("Erro ao buscar dados: ", error);
        $("#results").html('<p style="color: red;">Erro ao buscar dados. Tente novamente mais tarde.</p>');
    });
}

$(document).ready(function() {
    // Esconde o modal inicialmente
    $("#ministersModal").hide();  

    $("#searchInput").on("keypress", function(event) {
        if (event.which === 13) {
            event.preventDefault();
            search();
        }
    });

    // Exibe o modal ao clicar no texto "Clique aqui"
    $("#openMinistersModal").click(function() {
        $("#ministersModal").fadeIn();
    });

    // Fecha o modal ao clicar no "X"
    $(".close").click(function() {
        $("#ministersModal").fadeOut();
    });

    // Fecha o modal ao clicar fora dele
    $(window).click(function(event) {
        if (event.target.id === "ministersModal") {
            $("#ministersModal").fadeOut();
        }
    });
});

// Limpa o campo de pesquisa quando a página é carregada
window.onload = function() {
    document.getElementById("searchInput").value = "";
};
