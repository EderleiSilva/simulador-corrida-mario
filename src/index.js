const character = {
    "character": [
        {
            "ID": 1,
            "NOME": "Mario",
            "VELOCIADADE": 4,
            "MANOBRABILIDADE": 3,
            "PODER": 3,
            "PONTOS": 0
        },
        {
            "ID": 2,
            "NOME": "Luigi",
            "VELOCIADADE": 3,
            "MANOBRABILIDADE": 4,
            "PODER": 4,
            "PONTOS": 0
        },
        {
            "ID": 3,
            "NOME": "Peach",
            "VELOCIADADE": 3,
            "MANOBRABILIDADE": 4,
            "PODER": 2,
            "PONTOS": 0
        },
        {
            "ID": 4,
            "NOME": "Yoshi",
            "VELOCIADADE": 2,
            "MANOBRABILIDADE": 4,
            "PODER": 3,
            "PONTOS": 0
        },
        {
            "ID": 5,
            "NOME": "Bowser",
            "VELOCIADADE": 5,
            "MANOBRABILIDADE": 2,
            "PODER": 5,
            "PONTOS": 0
        },
        {
            "ID": 6,
            "NOME": "Donkey Kong",
            "VELOCIADADE": 2,
            "MANOBRABILIDADE": 2,
            "PODER": 5,
            "PONTOS": 0
        }
    ]
}

const players = {
    "players": [
        {
            "ID": 1,
            "player": "player1"
        },
        {
            "ID": 2,
            "player": "player2"
        }
    ]
}

function question(query) {
    return new Promise(resolve => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.question(query, answer => {
            readline.close();
            resolve(answer)
        });
    });
}

async function selectCharacter() {
    let selectedChar = []
    for (let i = 0; i < character.character.length; i++) {
        const char = character.character[i];
        console.log(`${char.ID} - ${char.NOME}`);
    }

    for (let j = 0; j < players.players.length; j++) {
        const player = players.players[j];

        const option = await question(`Jogador ${player.ID}, Selecione seu personagem digitando o número de 1 ao 6: `);
        const optionChar = parseInt(option) - 1;
        //selectedChar = character.character[optionChar];
        selectedChar.push(character.character[optionChar]);

        console.log(`${player.ID} Selecionou o personagem ${selectedChar[j].NOME}`);

    }
    return selectedChar
}

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.33:
            result = "RETA"
            break;
        case random < 0.66:
            result = "CURVA"
            break;
        default:
            result = "CONFRONTO"
    }

    return result
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {

    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round} iniciada!`);

        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.VELOCIADADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIADADE;

            await logRollResult(character1.NOME, "velocidade", diceResult1, character1.VELOCIADADE);
            await logRollResult(character2.NOME, "velocidade", diceResult2, character2.VELOCIADADE);

        } else if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);

        } else {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}`);

            await logRollResult(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "poder", diceResult2, character2.PODER);

            if (powerResult1 > powerResult2 && character2.PONTOS > 0) {
                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto 🐢`)
                character2.PONTOS--;
            }

            if (powerResult2 > powerResult1 && character1.PONTOS > 0) {
                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto 🐢`)
                character1.PONTOS--;
            }

            console.log(powerResult2 === powerResult1 ? "Confronto empatou! Nenhum ponto foi perdido" : "");
        }

        if (totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.NOME} marcou 1 ponto!`);
            character1.PONTOS++;
        } else if (totalTestSkill2 > totalTestSkill1) {
            console.log(`${character2.NOME} marcou 1 ponto!`);
            character2.PONTOS++;
        }

        console.log("____________________________");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado Final: ");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
    } else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
    } else {
        console.log(`\nA corrida terminou em empate!`);
    }
}

(async function main() {
    const selectPlayer = await selectCharacter();
    console.log("🏁🚨 Comece a corrida entre os competidores: \n")

    for (let i = 0; i < selectPlayer.length; i++) {
        console.log(`${selectPlayer[i].selectedCharacter}\n`);
    }

    await playRaceEngine(selectPlayer[0], selectPlayer[1]);
    await declareWinner(selectPlayer[0], selectPlayer[1]);
})();
