function initFBIG() {
    const IMAGES = ['title_img'];
    FBInstant.initializeAsync().then(function() {
        // Preload images
        IMAGES.forEach(function(imgName, index){
        var img = new Image();
        img.src = './img/' + imgName + '.png';
        preloaded[imgName] = img;
        FBInstant.setLoadingProgress(Math.ceil(index / IMAGES.length)*100);
        })

        // Finished loading. Start the game
        FBInstant.startGameAsync().then(function() {
            log(JSON.stringify(FBInstant));
            console.log(FBInstant);
            //startGame();          
        });
    });
}