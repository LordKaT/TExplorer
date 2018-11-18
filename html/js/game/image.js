function game_image_load(imageFiles) {
	g_imageLoadCount = 0;
	g_imageLoadTotal = imageFiles.length;
	g_imagePreloaded = false;
	var imagesLoaded = [];

	for (var i = 0; i < imageFiles.length; i++) {
		var image = new Image();
        image.onload = function () {
            g_imageLoadCount++;
            if (g_imageLoadCount === g_imageLoadTotal) {
				g_imagePreloaded = true;
			}
		};
		image.src = imageFiles[i];
		imagesLoaded[i] = image;
	}
	return imagesLoaded;
}
