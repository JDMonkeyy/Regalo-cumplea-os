(() => {
  'use strict';

  /* =======================================================
     BOTÓN PLAY / PAUSA
     ======================================================= */
  const song = document.getElementById('song');
  const playBtn = document.getElementById('playBtn');
  const hint = document.getElementById('playHint');

  const TEXTO_INICIAL = 'Da doble click para comenzar la magia mi amor';
  const TEXTO_SONANDO = 'Toca de nuevo para pausar';
  const TEXTO_PAUSA = 'En pausa. Toca para continuar';

  function setHint(text, isError = false) {
    hint.textContent = text;
    hint.classList.toggle('is-error', isError);
  }

  function setPlaying(isPlaying) {
    playBtn.classList.toggle('is-playing', isPlaying);
    playBtn.setAttribute('aria-pressed', String(isPlaying));
    playBtn.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
  }

  /* Muestra las tarjetas la primera vez que se toca el botón */
  const cardsSection = document.getElementById('tarjetas');
  const scrollLink = document.getElementById('scrollLink');
  let cardsRevealed = false;

  function revealCards() {
    if (cardsRevealed) return;
    cardsRevealed = true;

    cardsSection.hidden = false;
    cardsSection.classList.add('is-revealed');
    scrollLink.hidden = false;

    // Baja suavemente hasta las tarjetas
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      cardsSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, 500);
  }

  playBtn.addEventListener('click', async () => {
    revealCards();

    if (song.paused) {
      try {
        await song.play();
      } catch (err) {
        setHint('No se pudo reproducir la canción. Revisa que exista audio/cancion.mp3', true);
        console.error('Error al reproducir:', err);
      }
    } else {
      song.pause();
    }
  });

  // La interfaz siempre refleja el estado real del audio
  song.addEventListener('play', () => {
    setPlaying(true);
    setHint(TEXTO_SONANDO);
  });

  song.addEventListener('pause', () => {
    setPlaying(false);
    setHint(TEXTO_PAUSA);
  });

  song.addEventListener('error', () => {
    setPlaying(false);
    setHint('No se encontró el archivo audio/cancion.mp3', true);
  });

  setHint(TEXTO_INICIAL);

  /* =======================================================
     TARJETAS QUE SE VOLTEAN
     ======================================================= */
  const grid = document.querySelector('.cards');

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;

    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(flipped));
  });

  /* =======================================================
     IMÁGENES FALTANTES: se ocultan para no mostrar el ícono roto
     ======================================================= */
  document.querySelectorAll('.card img').forEach((img) => {
    const markMissing = () => img.classList.add('is-missing');

    img.addEventListener('error', markMissing);

    // Por si el error ocurrió antes de que se ejecutara este script
    if (img.complete && img.naturalWidth === 0) markMissing();
  });
})();