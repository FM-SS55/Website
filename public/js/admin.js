// public/js/admin.js
// Admin panel interactivity: live image preview on file select, and
// auto-generating a URL slug from the Title field on add forms (services/blog).
// Delete confirmations are handled inline via onsubmit="return confirm(...)"
// in the EJS templates, so they aren't duplicated here.

document.addEventListener('DOMContentLoaded', () => {
  // ---- Live image preview when a file is chosen in any admin form ----
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;

      // Remove any previous preview this input created
      const existingPreview = input.parentElement.querySelector('.js-image-preview');
      if (existingPreview) existingPreview.remove();

      const reader = new FileReader();
      reader.onload = (e) => {
        const wrap = document.createElement('div');
        wrap.className = 'current-image js-image-preview';
        wrap.style.marginTop = '10px';
        wrap.innerHTML = `
          <img src="${e.target.result}" alt="Preview">
          <span style="font-size:13px; color: var(--muted);">New image preview — not saved until you submit the form.</span>
        `;
        input.parentElement.appendChild(wrap);
      };
      reader.readAsDataURL(file);
    });
  });

  // ---- Auto-generate a URL slug from the Title field (only on "Add New" forms,
  //      and only while the user hasn't typed into the slug field themselves) ----
  const titleInput = document.getElementById('title');
  const slugInput = document.getElementById('slug');
  if (titleInput && slugInput && !slugInput.value) {
    let slugEdited = false;
    slugInput.addEventListener('input', () => { slugEdited = true; });

    titleInput.addEventListener('input', () => {
      if (slugEdited) return;
      slugInput.value = titleInput.value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    });
  }
});