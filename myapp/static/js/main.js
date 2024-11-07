async function startCamera() {
    document.querySelector('.wrapper').style.display = 'none';
    try {
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.getElementById('video');
        videoElement.srcObject = stream;

        videoElement.onloadedmetadata = function(e) {
            videoElement.play();
        };

        videoElement.onplay = function() {
            detectFace(videoElement);
        };

        document.getElementById('camera-container').style.display = 'block';        
    } catch (error) {
        console.error("Erreur lors de l'accès à la caméra:", error);
    }
}

let lastPositionX = null;
let lastPositionY = null;
let movementCounter = 0;
let faceLostCounter = 0;
let isFaceDetected = false;
let stayStillCounter = 0;
let movementTolerance = 3;
let isProcessing = false;
let processingTimeout = null;
let processingStarted = false;

const captureVersoButton = document.getElementById('start');
const retryCaptureButtonRecto = document.getElementById('retry-capture-recto');
const progressContainerRecto = document.getElementById('progress-container-recto');
const progressBarRecto = document.getElementById('progress-bar-recto');
const validIconRecto = document.getElementById('valid-icon-recto');


function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function detectFace(videoElement) {
    const ovalElement = document.getElementById('oval');
    const ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoElement);

    function positionLoop() {
        if (processingStarted) {
            return;
        }
        requestAnimationFrame(positionLoop);
        const positions = ctracker.getCurrentPosition();

        if (positions) {
            faceLostCounter = 0;

            if (!isFaceDetected) {
                isFaceDetected = true;
                ovalElement.classList.add('face-detected');
                ovalElement.classList.add('oval-loading');
                updateFeedbackText("Don't moove");
            }

            if (lastPositionX !== null && lastPositionY !== null) {
                const posX = positions[62][0];
                const posY = positions[62][1];
                const moveX = Math.abs(posX - lastPositionX);
                const moveY = Math.abs(posY - lastPositionY);

                if (moveX <= movementTolerance && moveY <= movementTolerance) {
                    stayStillCounter++;

                    if (stayStillCounter >= 0 && stayStillCounter <= 300) {
                        updateFeedbackText("15 secondes");
                    } else if (stayStillCounter > 300 && stayStillCounter <= 600) {
                        updateFeedbackText("Wait");
                    } else if (stayStillCounter > 600 && stayStillCounter <= 900) {
                        let secondsLeft = 5 - Math.floor((stayStillCounter - 600) / 60);
                        updateFeedbackText(secondsLeft.toString());
                    } else if (stayStillCounter > 900 && !processingStarted) {
                        processingStarted = true;
                        isProcessing = true;
                        
                        if (processingTimeout) {
                            clearTimeout(processingTimeout);
                        }

                        stayStillCounter = 0;
                        document.getElementById('camera-container').style.display = 'none';
                        document.querySelector('.wrapper').style.display = 'block';
                        stopCamera();
                        progressContainerRecto.style.display = 'flex';
                        
                        captureVersoButton.textContent = 'Loading...';
                        captureVersoButton.style.backgroundColor = "#d3d3d3";
                        captureVersoButton.style.backgroundImage = "none";
                        
                        setTimeout(function() {
                            progressBarRecto.style.width = '80%';
                        }, 500);

                        processingTimeout = setTimeout(function() {

                            const urlParts = window.location.pathname.split('/');
                            const userId = urlParts[urlParts.length - 2];

                            validIconRecto.style.display = 'inline';
                            retryCaptureButtonRecto.style.display = 'block';
                            captureVersoButton.textContent = 'Next step';
                            captureVersoButton.style.backgroundImage = "linear-gradient(62deg, #7efbb3 0%, #036704 100%)";
                            captureVersoButton.style.backgroundColor = "#1b8426";
                            isProcessing = false;

                            // Ajout de l'écouteur d'événements pour la redirection
                            captureVersoButton.addEventListener('click', function() {
                                if (isProcessing) {
                                } else {
                                    window.location.href = `/verification/${userId}/`;
                                }
                            });
                            console.log("Processing end");
                        }, 6000);
                    }
                } else {
                    movementCounter = 0;
                    lastPositionX = posX;
                    lastPositionY = posY;
                }
            } else {
                lastPositionX = positions[62][0];
                lastPositionY = positions[62][1];
            }
        } else {
            if (isFaceDetected) {
                faceLostCounter++;
                if (faceLostCounter > 10) {
                    isFaceDetected = false;
                    ovalElement.classList.remove('face-detected');
                    ovalElement.classList.remove('oval-loading');
                    updateFeedbackText("Montrer votre visage.");
                    stayStillCounter = 0;
                }
            }
        }
    }
    positionLoop();
}

function updateFeedbackText(message) {
    const feedbackElement = document.getElementById('feedback-text');
    if (feedbackElement.textContent !== message) {
        feedbackElement.textContent = message;
        feedbackElement.style.opacity = 1;
        clearTimeout(window.feedbackTimeout);
        window.feedbackTimeout = setTimeout(() => {
            feedbackElement.style.opacity = 0;
        }, 3000);
    }
}

document.getElementById('start').addEventListener('click', function() {
    if (!processingStarted) {
        startCamera();
    }
});

function stopCamera() {
    const video = document.getElementById('video');
    if (video.srcObject) {
        let tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}

function resetProgressBar(progressBar) {
    progressBar.style.width = '0%';
    progressBar.classList.remove('loading');
    void progressBar.offsetWidth;
    progressBar.classList.add('loading');
}


retryCaptureButtonRecto.addEventListener('click', function() {
    // Réinitialiser l'état
    processingStarted = false;
    isProcessing = false;
    isFaceDetected = false;
    stayStillCounter = 0;
    faceLostCounter = 0;
    
    // Réinitialiser l'interface utilisateur
    progressContainerRecto.style.display = 'none';
    validIconRecto.style.display = 'none';
    captureVersoButton.textContent = 'Chargement...';
    captureVersoButton.style.backgroundColor = "#d3d3d3";
    captureVersoButton.style.backgroundImage = "none";
    resetProgressBar(progressBarRecto);
    
    // Redémarrer la caméra et la détection de visage
    document.querySelector('.wrapper').style.display = 'none'; 
    document.getElementById('camera-container').style.display = 'block';
    startCamera().then(() => {
        const videoElement = document.getElementById('video');
        detectFace(videoElement);
    });
});