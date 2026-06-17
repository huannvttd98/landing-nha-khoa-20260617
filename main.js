// Image preview lightbox for content images.
(() => {
	const previewTargets = Array.from(
		document.querySelectorAll('.image-box img, .cover img')
	);

	if (!previewTargets.length) {
		return;
	}

	const overlay = document.createElement('div');
	overlay.className = 'image-preview-overlay';
	overlay.setAttribute('aria-hidden', 'true');

	const dialog = document.createElement('div');
	dialog.className = 'image-preview-dialog';
	dialog.setAttribute('role', 'dialog');
	dialog.setAttribute('aria-modal', 'true');
	dialog.setAttribute('aria-label', 'Xem trước ảnh');

	const closeButton = document.createElement('button');
	closeButton.className = 'image-preview-close';
	closeButton.type = 'button';
	closeButton.setAttribute('aria-label', 'Đóng xem trước');
	closeButton.textContent = '×';

	const previewImage = document.createElement('img');
	previewImage.className = 'image-preview-image';
	previewImage.alt = '';

	dialog.appendChild(closeButton);
	dialog.appendChild(previewImage);
	overlay.appendChild(dialog);
	document.body.appendChild(overlay);

	const closePreview = () => {
		overlay.classList.remove('is-open');
		overlay.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('preview-open');
	};

	const openPreview = (src, altText) => {
		previewImage.src = src;
		previewImage.alt = altText || 'Ảnh xem trước';
		overlay.classList.add('is-open');
		overlay.setAttribute('aria-hidden', 'false');
		document.body.classList.add('preview-open');
	};

	previewTargets.forEach((img) => {
		img.addEventListener('click', () => {
			openPreview(img.src, img.alt);
		});
	});

	closeButton.addEventListener('click', closePreview);

	overlay.addEventListener('click', (event) => {
		if (event.target === overlay) {
			closePreview();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
			closePreview();
		}
	});
})();
