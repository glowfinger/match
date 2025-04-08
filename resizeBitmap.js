function fitBitmapToCanvas(imageBitmap, maxWidth = 500, maxHeight = 500) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	// Calculate aspect ratio
	const aspectRatio = imageBitmap.width / imageBitmap.height;
	let newWidth = maxWidth;
	let newHeight = maxHeight;

	if (aspectRatio > 1) {
		// Landscape orientation
		newHeight = maxWidth / aspectRatio;
	} else {
		// Portrait orientation
		newWidth = maxHeight * aspectRatio;
	}

	// Set canvas dimensions
	canvas.width = newWidth;
	canvas.height = newHeight;

	// Draw the resized image
	ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

	return canvas;
}

// Example usage
// const imageBitmap = await createImageBitmap(imageFile);
// const resizedCanvas = fitBitmapToCanvas(imageBitmap);
// document.body.appendChild(resizedCanvas); // Append the resized canvas to the DOM
