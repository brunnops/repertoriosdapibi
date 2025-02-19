
// Função para remover acentos das strings
function removeAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function search() {
    const query = removeAcentos($("#searchInput").val().toLowerCase().trim());
    const sheetID = '1rEmtLEKMz7wGXYs2y3FKpp_BCcNVI4y_UmtL7AC-noY';
    const apiKey = 'AIzaSyAc1AvFjueKSY6yTiOv6g6-dJY7a05urLk';
    const sheetName = 'REPERTORIOS';
    let allResults = [];

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

        const results = rows.filter(row => 
            removeAcentos((row[0] || "").toLowerCase()).includes(query) || 
            removeAcentos((row[1] || "").toLowerCase()).includes(query) || 
            removeAcentos((row[2] || "").toLowerCase()).includes(query) ||
            removeAcentos((row[3] || "").toLowerCase()).includes(query) || 
            removeAcentos((row[4] || "").toLowerCase()).includes(query) || 
            removeAcentos((row[5] || "").toLowerCase()).includes(query)
        );

        allResults = allResults.concat(results);

        if (allResults.length === 0) {
            $("#results").html('<p style="color: red;">Nenhum resultado encontrado. Tente outra busca.</p>');
        } else {
            let html = '<table><thead><tr><th>Quem ministra</th><th>Música</th><th>Cantor/Banda/Versão</th><th>Tom Original</th><th>Tom Adaptado</th><th>Observações</th></tr></thead><tbody>';
            allResults.forEach(row => {
                html += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td></tr>`;
            });
            html += '</tbody></table>';
            $("#results").html(html);
        }
    }).catch(function(error) {
        console.error("Erro ao buscar dados: ", error);
        $("#results").html('<p style="color: red;">Erro ao buscar dados. Tente novamente mais tarde.</p>');
    });
}

$(document).ready(function() {
    $("#searchInput").on("keypress", function(event) {
        if (event.which === 13) {
            event.preventDefault();
            search();
        }
    });
});


    // Limpa o campo de pesquisa quando a página é carregada
    window.onload = function() {
        document.getElementById("searchInput").value = ""
    };
