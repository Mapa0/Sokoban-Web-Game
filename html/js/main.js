var original = [[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 2, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 3, 3, 1],
                [1, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1],
                [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 4, 1, 1, 0, 0, 3, 3, 1],
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]];
var movel, moves, listaMoves, caixaNome, seletorFase, lin, col;
var caixaMovida = [false];
var sizex = 50, sizey = 50;
var ctx = null;

function loadFile(url) {
    var xhr=new XMLHttpRequest();
    xhr.open("GET", url, true);
//Now set response type
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load',function(){
        if (xhr.status === 200){
            let buf = new Uint32Array(xhr.response);
            lin = buf[0];
            col = buf[1];
            console.log(lin, col);
            for(let i = 0; i < lin; i++)
                for(let j = 0; j < col; j++)
                {
                    original[i][j] = buf[i * col + j + 2];
                    console.log(i*col+j);
                }
            inicializar();
        }
    });
    xhr.send();
}

function carregarFase(){
    var path = "Data/Sokoban/Mapas/"+seletorFase.value+"/level";
    loadFile(path);
}

function inicializar() {
    lin = original.length;
    col = original[0].length;
    movel = JSON.parse(JSON.stringify(original));
    moves = 0;
    listaMoves = "";
    caixaMovida.length = 0;
    let tela = document.getElementById("jogo");
    caixaNome = document.getElementById("Nome");
    seletorFase = document.getElementById("seletorFase");
    tela.width = col*sizex;
    tela.height = lin*sizey;

    ctx = tela.getContext('2d');

    rodar();
}

function desenhar() {
    if(ctx == null) return;

    for(let i = 0; i < lin; i++)
    {
        for(let j = 0; j < col; j++)
        {
            switch(movel[i][j])
            {
                case 0:
                    if(original[i][j] === 3)
                    {
                        ctx.fillStyle = "#9c2520";
                        movel[i][j] = 3;
                    }
                    else ctx.fillStyle = "#000000";
                    break;
                case 1:
                    ctx.fillStyle = "#006ba8";
                    break;
                case 2:
                    if(original[i][j] === 3 && movel[i][j] === 2) ctx.fillStyle = "#28a000";

                    else ctx.fillStyle = "#9d6710";

                    break;
                case 3:
                    ctx.fillStyle = "#9c2520";
                    break;
                case 4:
                    ctx.fillStyle = "#bc39ba";
                    break;
                default:
                    ctx.fillStyle = "#E8E3D9";
                    break;
            }
            ctx.fillRect(j*sizex,i*sizey,sizex,sizey);
        }
    }

}

function rodar() {
        desenhar();
        movimentarPersonagem();
        corrigePersonagem();
        desenhar();
        if(verificaVitoria()) return exibeVitoria();
        setTimeout(rodar,33.3333);
}

function verificaVitoria(){

    document.getElementById("texto2").innerHTML = "Movimentos: " + moves;

    let nCaixas = 0, nCaixasCorretas = 0;

    for(let i  = 0; i < lin; i++) {
        for(let j = 0; j < col; j++) {

            if (original[i][j] === 3) nCaixas++;
        }
    }

    for(let i  = 0; i < lin; i++) {
        for (let j = 0; j < col; j++) {
            if (original[i][j] === 3 && movel[i][j] === 2)
                nCaixasCorretas++;
            else if(original[i][j] === 3 && movel[i][j] !== 2)
                return false;
        }
    }
    if(nCaixasCorretas >= nCaixas)
        return true;
    return false;
}

function exibeVitoria() {
    if(caixaNome.value !== "")
        salvaRecorde(caixaNome.value);
    else alert("Como não preencheu seu nome, seu recorde não foi salvo");
    return;
}

function movimentarPersonagem(){
    while(true)
    {
        for(let i = 0; i < lin; i++) {
            for (let j = 0; j < col; j++) {
                if(movel[i][j]===4) {
                    document.onkeypress = function (e) {
                        switch (e.key) {
                            case "ArrowUp":
                                if (verificaMovimento("w", j, i)) {
                                    movel[i-1][j] = 4;
                                    movel[i][j] = 0;
                                    moves++;
                                    listaMoves += "w";
                                    return;
                                }
                                break;
                            case "ArrowDown":
                                if (verificaMovimento("s", j, i)) {
                                    movel[i + 1][j] = 4;
                                    movel[i][j] = 0;
                                    moves++;
                                    listaMoves += "s";
                                    return;
                                }
                                break;
                            case "ArrowRight":
                                if (verificaMovimento("d", j, i)) {
                                    movel[i][j + 1] = 4;
                                    movel[i][j] = 0;
                                    moves++;
                                    listaMoves += "d";
                                    return;
                                }
                                break;
                            case "ArrowLeft":
                                if (verificaMovimento("a", j, i)) {
                                    movel[i][j - 1] = 4;
                                    movel[i][j] = 0;
                                    moves++;
                                    listaMoves += "a";
                                    return;
                                }
                                break;
                        }
                    };
                }
            }
        }
        return 0;
    }
}

function verificaMovimento(dir,x,y){
    switch(dir){
        case "w":
            if(movel[y-1][x] === 0 || movel[y-1][x] === 3){
                caixaMovida[moves] = false;
                return true;
            }

            else if(movel[y-1][x] ===  1) return false;

            else if(movel[y-1][x] === 2) {

                if (movel[y - 2][x] !== 0 && movel[y - 2][x] !== 3) return false;

                else {
                    movel[y - 1][x] = 0;
                    movel[y - 2][x] = 2;
                    caixaMovida[moves] = true;
                    return true;
                }
            }
            break;
        case "s":
            if(movel[y+1][x] === 0 || movel[y+1][x] === 3){
                caixaMovida[moves] = false;
                return true;
            }

            else if(movel[y+1][x] ===  1) return false;

            else if(movel[y+1][x] === 2) {

                if (movel[y + 2][x] !== 0 && movel[y + 2][x] !== 3) return false;

                else {
                    movel[y + 1][x] = 0;
                    movel[y + 2][x] = 2;
                    caixaMovida[moves] = true;
                    return true;
                }
            }
            break;
        case "d":
            if(movel[y][x+1] === 0 || movel[y][x+1] === 3){
                caixaMovida[moves] = false;
                return true;
            }

            else if(movel[y][x+1] ===  1) return false;

            else if(movel[y][x+1] === 2) {

                if (movel[y][x+2] !== 0 && movel[y][x+2] !== 3) return false;

                else {
                    movel[y][x+1] = 0;
                    movel[y][x+2] = 2;
                    caixaMovida[moves] = true;
                    return true;
                }
            }
            break;
        case "a":
            if(movel[y][x-1] === 0 || movel[y][x-1] === 3){
                caixaMovida[moves] = false;
                return true;
            }

            else if(movel[y][x-1] ===  1) return false;

            else if(movel[y][x-1] === 2) {

                if (movel[y][x-2] !== 0 && movel[y][x-2] !== 3) return false;

                else {
                    movel[y][x-1] = 0;
                    movel[y][x-2] = 2;
                    caixaMovida[moves] = true;
                    return true;
                }
            }
            break;
    }
}

function corrigePersonagem(){
    let nJogadores = 0;
    for(let i = 0; i < lin; i++)
    {
        for( let j = 0; j < col; j++)
        {
            if(movel[i][j] === 4) {
                nJogadores++;
                if (nJogadores > 1) {
                    movel[i][j] = 0;
                    moves--;
                }
            }
        }
    }
}

function desfazerMovimento() {
    if(listaMoves === "")
    {
        alert("Não e possivel desfazer!");
        return;
    }
    let movimento = listaMoves[listaMoves.length-1];
    for(let i = 0; i < lin; i++)
    {
        for(let j = 0; j < col; j++)
        {
            if(movel[i][j] === 4)
            {
                switch(movimento){
                    case "w":
                        if(movel[i-1][j] === 2 && caixaMovida[moves-1])
                        {
                            movel[i-1][j] = 0;
                            movel[i][j] = 2;
                        }
                        else movel[i][j] = 0;
                        movel[i+1][j] = 4;
                        listaMoves = listaMoves.slice(0,-1);
                        caixaMovida[moves-1] = false;
                        moves--;
                        return;
                    case "s":
                        if(movel[i+1][j] === 2 && caixaMovida[moves-1])
                        {
                            movel[i+1][j] = 0;
                            movel[i][j] = 2;
                        }
                        else movel[i][j] = 0;
                        movel[i-1][j] = 4;
                        listaMoves = listaMoves.slice(0,-1);
                        caixaMovida[moves-1] = false;
                        moves--;
                        return;
                    case "a":
                        if(movel[i][j-1] === 2 && caixaMovida[moves-1])
                        {
                            movel[i][j-1] = 0;
                            movel[i][j] = 2;
                        }
                        else movel[i][j] = 0;
                        movel[i][j+1] = 4;
                        listaMoves = listaMoves.slice(0,-1);
                        caixaMovida[moves-1] = false;
                        moves--;
                        return;
                    case "d":
                        if(movel[i][j+1] === 2 && caixaMovida[moves-1])
                        {
                            movel[i][j+1] = 0;
                            movel[i][j] = 2;
                        }
                        else movel[i][j] = 0;
                        movel[i][j-1] = 4;
                        listaMoves = listaMoves.slice(0,-1);
                        caixaMovida[moves-1] = false;
                        moves--;
                        return;
                }
            }
        }
    }
}
