var config = {
    apiKey: "AIzaSyCw2WGYMMuG3HY3UEyue4qEujdXhjb-WBA",
    authDomain: "fire-6c0e3.firebaseapp.com",
    databaseURL: "https://fire-6c0e3.firebaseio.com",
    projectId: "fire-6c0e3",
    storageBucket: "",
    messagingSenderId: "65782198270"
};
firebase.initializeApp(config);
var database = firebase.database();
function salvaRecorde(nome){
    if(nomeFase === seletorFase.value)
    {
        database.ref('Fases/'+seletorFase.value+'/Jogadores/'+nome).set(
            {
                Movimentos: moves
            });
    }
    else alert("Fase nao e original, recorde nao salvo.");
}

function mostraRecordes(){
    let recordes = database.ref('Fases/' + seletorFase.value + '/Jogadores/');
    recordes.orderByChild("Movimentos").on('value', function(snapshot) {
        let content = '<tr><th>Jogador</th><th>Movimentos</th></tr>';
        snapshot.forEach(function(data)
        {
            let nome = data.key;
            let movimentos = data.val().Movimentos;
            console.log(nome, movimentos);
            content += "<tr><td>"+nome+"</td><td>"+movimentos+"</td></tr>"
        });
        document.getElementById("Recordes").innerHTML=content;
    });
}