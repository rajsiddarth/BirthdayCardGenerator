/**
 * Birthday Card Generator
 * Name, age, characteristics + optional personal message → personalized card.
 */

const BIRTHDAY_IMAGES = [
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1513542789411-b6d5d05985c9?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=400&fit=crop',
];

// Sentence starters that reference one trait and feel personal
const TRAIT_PHRASES = [
  (t) => `I've always admired how ${t} you are.`,
  (t) => `Your ${t} nature makes everyone around you feel better.`,
  (t) => `You're one of the most ${t} people I know.`,
  (t) => `Thank you for being so ${t} — it really matters.`,
  (t) => `The way you're ${t} has always meant a lot to me.`,
  (t) => `Here's to another year of you being your ${t} self.`,
  (t) => `You bring so much ${t} into the world.`,
  (t) => `I'm lucky to have someone as ${t} as you in my life.`,
];

// Closing lines (no trait)
const CLOSINGS = [
  'Wishing you a year full of joy and everything you love.',
  'Hope your day is as amazing as you are.',
  'Cheers to you — today and every day.',
  'Sending you so much love on your special day.',
];

const form = document.getElementById('card-form');
const cardSection = document.getElementById('card-section');
const birthdayCard = document.getElementById('birthday-card');
const cardImageWrapper = document.getElementById('card-image-wrapper');
const cardImage = document.getElementById('card-image');
const cardRecipient = document.getElementById('card-recipient');
const cardMessage = document.getElementById('card-message');
const cardSignature = document.getElementById('card-signature');
const photoInput = document.getElementById('photo');
const photoLabel = document.getElementById('photo-label');
const photoError = document.getElementById('photo-error');
const btnDownload = document.getElementById('btn-download');
const btnNew = document.getElementById('btn-new');

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

function isPhotoTypeValid(file) {
  if (!file) return true;
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
  return ALLOWED_PHOTO_TYPES.includes(type) || ALLOWED_EXTENSIONS.includes(ext);
}

function showPhotoError(message) {
  photoError.textContent = message;
  photoError.hidden = false;
  photoLabel.classList.add('has-error');
}

function clearPhotoError() {
  photoError.textContent = '';
  photoError.hidden = true;
  photoLabel.classList.remove('has-error');
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function parseCharacteristics(str) {
  if (!str || !str.trim()) return [];
  return str
    .split(/[,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Build a personal message from traits: one sentence per trait, then a closing.
 */
function buildMessageFromTraits(name, age, traits) {
  const parts = [];

  if (traits.length === 0) {
    parts.push(
      `Happy ${age}th birthday, ${name}! Wishing you a year filled with joy, laughter, and everything that makes you smile.`
    );
  } else {
    const phraseFns = shuffle([...TRAIT_PHRASES]);
    for (let i = 0; i < traits.length; i++) {
      if (i < phraseFns.length && typeof phraseFns[i] === 'function') {
        parts.push(phraseFns[i](traits[i]));
      } else {
        parts.push(`You're so ${traits[i]} — and that's something to celebrate.`);
      }
    }
    parts.push('');
    parts.push(pickRandom(CLOSINGS));
  }

  return parts.join('\n');
}

function setCardMessage(element, text) {
  element.textContent = '';
  element.appendChild(document.createTextNode(text));
}

function showCard(name, age, characteristicsStr, personalMessageStr, photoDataUrl) {
  const traits = parseCharacteristics(characteristicsStr);
  const hasPersonal = personalMessageStr && personalMessageStr.trim().length > 0;

  let messageText;
  let signatureText = 'Have an amazing day!';

  if (hasPersonal) {
    messageText = personalMessageStr.trim();
  } else {
    messageText = buildMessageFromTraits(name, age, traits);
  }

  if (photoDataUrl) {
    cardImage.src = photoDataUrl;
    cardImage.alt = `Birthday photo of ${name}`;
    cardImageWrapper.classList.add('birthday-theme');
  } else {
    cardImage.src = pickRandom(BIRTHDAY_IMAGES);
    cardImage.alt = `Birthday celebration for ${name}`;
    cardImageWrapper.classList.remove('birthday-theme');
  }

  cardRecipient.textContent = `Dear ${name},`;
  setCardMessage(cardMessage, messageText);
  cardSignature.textContent = signatureText;

  cardSection.classList.add('visible');
  cardSection.setAttribute('aria-hidden', 'false');
  cardSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideCard() {
  cardSection.classList.remove('visible');
  cardSection.setAttribute('aria-hidden', 'true');
  cardImageWrapper.classList.remove('birthday-theme');
  form.reset();
  photoLabel.textContent = 'Choose a photo';
  photoLabel.classList.remove('has-file', 'has-error');
  clearPhotoError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

photoInput.addEventListener('change', () => {
  clearPhotoError();
  const file = photoInput.files[0];
  if (!file) {
    photoLabel.textContent = 'Choose a photo';
    photoLabel.classList.remove('has-file');
    return;
  }
  if (!isPhotoTypeValid(file)) {
    showPhotoError('Please choose a JPG or PNG image. Other file types are not allowed.');
    photoInput.value = '';
    photoLabel.textContent = 'Choose a photo';
    photoLabel.classList.remove('has-file');
    return;
  }
  photoLabel.textContent = file.name;
  photoLabel.classList.add('has-file');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearPhotoError();
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value;
  const characteristics = document.getElementById('characteristics').value.trim();
  const personalMessage = document.getElementById('personal-message').value.trim();
  const photoFile = photoInput.files[0];
  if (!name || !age) return;

  if (photoFile) {
    if (!isPhotoTypeValid(photoFile)) {
      showPhotoError('Please choose a JPG or PNG image. Other file types are not allowed.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      showCard(name, age, characteristics, personalMessage, ev.target.result);
    };
    reader.readAsDataURL(photoFile);
  } else {
    showCard(name, age, characteristics, personalMessage, null);
  }
});

btnNew.addEventListener('click', hideCard);

btnDownload.addEventListener('click', () => {
  if (typeof html2canvas !== 'undefined') {
    btnDownload.disabled = true;
    btnDownload.textContent = 'Creating image…';
    html2canvas(birthdayCard, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    })
      .then((canvas) => {
        const link = document.createElement('a');
        link.download = `birthday-card-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      })
      .catch(() => window.print())
      .finally(() => {
        btnDownload.disabled = false;
        btnDownload.textContent = 'Download';
      });
  } else {
    window.print();
  }
});
