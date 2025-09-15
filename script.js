const palos = ['♠️', '♥️', '♦️', '♣️'];
const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let mazo = [];
let jugador = [];
let crupier = [];

let jugadorListo = false;

const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerScoreSpan = document.getElementById('player-score');
const dealerScoreSpan = document.getElementById('dealer-score');
const startButton = document.getElementById('start-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const resetButton = document.getElementById('reset-button');
const messageDiv = document.getElementById('message');

function crearMazo() {
    const nuevoMazo = [];
    for (let palo of palos) {
        for (let valor of valores) {
            nuevoMazo.push({ valor, palo });
        }
    }
    return nuevoMazo;
}

function valorCarta(carta) {
    if (carta.valor === 'A') return 1;
    if (['J', 'Q', 'K'].includes(carta.valor)) return 10;
    return parseInt(carta.valor);
}

function calcularPuntaje(cartas) {
    let total = 0;
    let ases = 0;

    for (let carta of cartas) {
        const val = valorCarta(carta);
        total += val;
        if (val === 1) ases++;
    }

    while (total <= 11 && ases > 0) {
        total += 10;
        ases--;
    }

    return total;
}

function mostrarCartas(jugador, ocultarPrimera = false) {
    return jugador.map((carta, i) => {
        if (ocultarPrimera && i === 1) {
            return `<div class="card">?</div>`;
        }
        
        return `<div class="card">
                    <span>${carta.palo}</span>
                    <div class="card-value">${carta.valor}</div>
                    <div class="card-suit">${carta.palo}</div>
                </div>`;
    }).join('');
}

function actualizarPantalla() {
    playerCardsDiv.innerHTML = mostrarCartas(jugador);
    playerScoreSpan.textContent = calcularPuntaje(jugador);

    if (!jugadorListo) {
        dealerCardsDiv.innerHTML = mostrarCartas(crupier, true);
        dealerScoreSpan.textContent = '?';
    } else {
        dealerCardsDiv.innerHTML = mostrarCartas(crupier);
        dealerScoreSpan.textContent = calcularPuntaje(crupier);
    }
}

function repartirCarta(destino) {
    const carta = mazo.pop();
    destino.push(carta);
}

function comenzarJuego() {
    mazo = crearMazo();
    mazo.sort(() => Math.random() - 0.5);

    jugador = [];
    crupier = [];
    jugadorListo = false;

    repartirCarta(jugador);
    repartirCarta(crupier);
    repartirCarta(jugador);
    repartirCarta(crupier);

    actualizarPantalla();
    messageDiv.textContent = "Tu turno. ¿Quieres pedir una carta?";
    startButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
    resetButton.style.display = 'none';
}

function pedirCarta() {
    repartirCarta(jugador);
    actualizarPantalla();

    const puntaje = calcularPuntaje(jugador);
    if (puntaje > 21) {
        terminarJuego("Te pasaste. ¡Perdiste!");
    } else if (puntaje === 21) {
        terminarJuego("¡Blackjack!");
    }
}

function plantarse() {
    jugadorListo = true;

    while (calcularPuntaje(crupier) < 17) {
        repartirCarta(crupier);
    }

    const puntajeJ = calcularPuntaje(jugador);
    const puntajeC = calcularPuntaje(crupier);

    if (puntajeC > 21) {
        terminarJuego("El crupier se pasó. ¡Ganaste!");
    } else if (puntajeC === puntajeJ) {
        terminarJuego("Empate.");
    } else if (puntajeJ > puntajeC) {
        terminarJuego("¡Ganaste!");
    } else {
        terminarJuego("Perdiste.");
    }
}

function terminarJuego(mensaje) {
    jugadorListo = true;
    actualizarPantalla();
    messageDiv.textContent = mensaje;
    hitButton.disabled = true;
    standButton.disabled = true;
    resetButton.style.display = 'inline-block';
}

function reiniciarJuego() {
    jugador = [];
    crupier = [];
    jugadorListo = false;
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';
    playerScoreSpan.textContent = '0';
    dealerScoreSpan.textContent = '?';
    messageDiv.textContent = '';
    startButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
    resetButton.style.display = 'none';
}

startButton.addEventListener('click', comenzarJuego);
hitButton.addEventListener('click', pedirCarta);
standButton.addEventListener('click', plantarse);
resetButton.addEventListener('click', reiniciarJuego);
