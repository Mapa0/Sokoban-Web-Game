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
    database.ref('Fases/'+seletorFase.value+'/Jogadores/'+nome).set(
        {
            Movimentos: moves
        });
}