/* ====== sampleListings ======
   Edit this array to add/remove listings.
   - images: list of filenames in assets/images/ or full URLs
   - videoUrl: optional YouTube/Vimeo watch URL (e.g. https://www.youtube.com/watch?v=XXXX)
   After adding images, upload the files to assets/images/ and push to GitHub.
*/
const sampleListings = [
  {
    id: 1,
    title: "2BHK khade bazar Circle",
    type: "buy",
    price: "₹ 45,00,000",
    meta: "khade bazar • 2 BHK • 950 sqft",
    description: "Semi-furnished, 2nd floor, immediate possession.",
    images: ["assets/images/123.jpeg","assets/images/123.jpeg"],
    videoUrl: ""
  },
  {
    id: 2,
    title: "3BHK Tilakwadi — Furnished",
    type: "rent",
    price: "₹ 18,000/mo",
    meta: "Tilakwadi • 3 BHK • Furnished",
    description: "Balcony, covered parking. Close to market.",
    images: ["assets/images/123.jpeg"],
    videoUrl: ""
  },
  {
    id: 3,
    title: "Independent house with garden",
    type: "buy",
    price: "₹ 1.2 Cr",
    meta: "Kamal • 4 BHK • 2000 sqft",
    description: "Spacious garden, private parking.",
    images: ["assets/images/123.jpeg"],
    videoUrl: ""
  }

  {
    id: 4,
    title: "2BHK near Rani Chennamma Circle",
    type: "buy",
    price: "₹ 45,00,000",
    meta: "mumbai • 2 BHK • 950 sqft",
    description: "Semi-furnished, 2nd floor, immediate possession.",
    images: ["assets/images/123.jpeg"],
    videoUrl: ""
  },
];

/* ====== helper: create card with thumbnail and View gallery ====== */
function createCard(listing){
  const div = document.createElement('div');
  div.className = 'card';
  const thumb = listing.images && listing.images.length ? listing.images[0] : 'assets/images/placeholder.jpg';
  const videoBadge = listing.videoUrl ? '<span class="video-badge">▶</span>' : '';
  div.innerHTML = `
    <div class="card-media" style="height:150px;background:url('${thumb}') center/cover no-repeat;border-radius:10px;position:relative;">
      ${videoBadge}
    </div>
    <div class="title">${listing.title}</div>
    <div class="meta">${listing.meta}</div>
    <div class="price">${listing.price}</div>
    <p class="desc">${listing.description || ''}</p>
    <div style="margin-top:8px">
      <a class="btn" href="contact.html?listing=${listing.id}">Enquire</a>
      <a class="btn ghost view-gallery" href="#" data-id="${listing.id}">View</a>
    </div>
  `;
  // attach view handler
  const viewBtn = div.querySelector('.view-gallery');
  if(viewBtn){
    viewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openGallery(listing);
    });
  }
  return div;
}

/* ====== render listings to all target cards containers ====== */
function renderListings(filter='all'){
  const targets = document.querySelectorAll('[id^="cards"]');
  targets.forEach(t => t.innerHTML = '');
  const list = sampleListings.filter(l => filter==='all' ? true : l.type===filter);
  list.forEach(item => {
    const card = createCard(item);
    targets.forEach(t => t.appendChild(card.cloneNode(true)));
  });
}

/* ====== search handler & page interactions ====== */
document.addEventListener('DOMContentLoaded', ()=> {
  renderListings('all');

  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const modeSelect = document.getElementById('mode-select');

  if(searchBtn){
    searchBtn.addEventListener('click', ()=> {
      const q = (searchInput.value || '').toLowerCase();
      const mode = modeSelect.value;
      const filtered = sampleListings.filter(l => {
        const matchQ = !q || l.title.toLowerCase().includes(q) || l.meta.toLowerCase().includes(q) || (l.description && l.description.toLowerCase().includes(q));
        const matchMode = mode==='all' ? true : l.type===mode;
        return matchQ && matchMode;
      });
      const cards = document.getElementById('cards');
      if(cards){
        cards.innerHTML='';
        filtered.forEach(f=> cards.appendChild(createCard(f)));
      }
    });
  }

  // burger menu for mobile
  document.querySelectorAll('.burger').forEach(b=>{
    b.addEventListener('click', ()=> {
      const nav = document.querySelector('.nav');
      nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
    });
  });

  // Enquire links: they go to Contact page (Google Form) with query param for listing ID
  // On contact page your Google Form will collect details; you can view responses in Google Sheets.
});

/* ====== Modal gallery helper ====== */
function openGallery(listing){
  let overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal"><button class="modal-close">×</button><div class="modal-body"></div></div>`;
  document.body.appendChild(overlay);

  const body = overlay.querySelector('.modal-body');

  // add images
  if(listing.images && listing.images.length){
    listing.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = listing.title;
      img.style.maxWidth = '100%';
      img.style.display = 'block';
      img.style.margin = '12px auto';
      img.loading = 'lazy';
      body.appendChild(img);
    });
  } else {
    const p = document.createElement('p');
    p.textContent = 'No images available for this listing.';
    p.style.color = '#cbd5e1';
    body.appendChild(p);
  }

  // embed video if youtube/vimeo link
  if(listing.videoUrl){
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = 360;
    iframe.src = listing.videoUrl.includes('youtube') ? listing.videoUrl.replace('watch?v=','embed/') : listing.videoUrl;
    iframe.frameBorder = 0;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.marginTop = '12px';
    body.appendChild(iframe);
  }

  overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.remove(); });
}
