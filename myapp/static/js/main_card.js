const video = document.getElementById('video_card');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureVersoButton = document.getElementById('capture-verso');
const closeButton = document.getElementById('close-camera');
const captureButton = document.getElementById('capturePhoto');
const rectoText = document.querySelector('.recto-text');
const progressBarRecto = document.getElementById('progress-bar-recto');
const progressContainerRecto = document.getElementById('progress-container-recto');
const validIconRecto = document.getElementById('valid-icon-recto');
const retryCaptureButtonRecto = document.getElementById('retry-capture-recto');
const progressBarVerso = document.getElementById('progress-bar-verso');
const progressContainerVerso = document.getElementById('progress-container-verso');
const validIconVerso = document.getElementById('valid-icon-verso');
const retryCaptureButtonVerso = document.getElementById('retry-capture-verso');
const startCaptureButton = document.getElementById('start-capture');

let isRecto = true;
let imageDataRecto = null;
let imageDataVerso = null;


async function startCamera() {
    const constraints = {
        video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.play();
    } catch (error) {
        console.error("Erreur lors de l'accès à la caméra:", error);
    }
}

function resetProgressBar(progressBar) {
    progressBar.style.width = '0%';
    progressBar.classList.remove('loading');
    void progressBar.offsetWidth;
    progressBar.classList.add('loading');
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function uploadImages() {
    const csrf_token = document.getElementById('csrfToken').value;
    
    const urlParts = window.location.pathname.split('/');
    const userId = urlParts[urlParts.length - 2];

    if (imageDataRecto && imageDataVerso) {
        const formData = new FormData();
        formData.append('image_recto', dataURLtoBlob(imageDataRecto), 'image_recto.png');
        formData.append('image_verso', dataURLtoBlob(imageDataVerso), 'image_verso.png');

        fetch(`/step_one/${userId}/`, { 
            method: 'POST', 
            body: formData,
            headers: {
                'X-CSRFToken': csrf_token,
            },
        })
        .then(response => {
            if (!response.ok) throw new Error('Échec de l’upload des images');
            window.location.href = `/step_two/${userId}/`;
        })
        .catch(error => console.error('Erreur lors de l’upload des images:', error));
    } else {
        console.error('Les deux images doivent être capturées avant de pouvoir continuer.');
    }
}

document.getElementById('start-capture').addEventListener('click', function() {
    isRecto = true;
    rectoText.textContent = "Recto";
    startCamera();
    document.getElementById('camera-container').style.display = 'block';
    document.querySelector('.wrapper').style.display = 'none';
});

captureButton.addEventListener('click', function() {
    ctx.drawImage(video, 0, 0, 400, 300);
    stopCamera();
    document.getElementById('camera-container').style.display = 'none';
    document.querySelector('.wrapper').style.display = 'block';

    const imageData = canvas.toDataURL('image/png');
    
    if (isRecto) {
        imageDataRecto = imageData;
        progressContainerRecto.style.display = 'flex';
        validIconRecto.style.display = 'none';
        resetProgressBar(progressBarRecto);
        
        // setTimeout(function() {
            progressBarRecto.style.width = '80%';
            startCaptureButton.textContent = 'Loading Recto...';
            startCaptureButton.style.backgroundColor = "#d3d3d3";
            startCaptureButton.style.backgroundImage = "none";
        // }, 500);
        
        setTimeout(function() {
            validIconRecto.style.display = 'inline';
            startCaptureButton.style.display = 'none';
            captureVersoButton.style.display = 'block';
        }, 6000);
    } else {
        imageDataVerso = imageData;
        progressContainerVerso.style.display = 'flex';
        validIconVerso.style.display = 'none';
        resetProgressBar(progressBarVerso);
        
        setTimeout(function() {
            progressBarVerso.style.width = '80%';
            startCaptureButton.textContent = 'Loading Verso...';
        }, 500);
        
        setTimeout(function() {
            validIconVerso.style.display = 'inline';
        }, 6000);
    }
});
let shouldRedirect = false;

captureVersoButton.addEventListener('click', function() {
    if (shouldRedirect) {
        uploadImages();
    } else {
        isRecto = false;
        rectoText.textContent = "Verso";
        startCamera();
        document.getElementById('camera-container').style.display = 'block';
        document.querySelector('.wrapper').style.display = 'none';
        retryCaptureButtonRecto.style.display = 'none';
        
        captureVersoButton.textContent = 'Loading Verso...';
        captureVersoButton.style.backgroundColor = "#d3d3d3";
        captureVersoButton.style.backgroundImage = "none";
    
        setTimeout(function() {
            captureVersoButton.textContent = 'Next step';
            captureVersoButton.style.backgroundImage = "linear-gradient(62deg, #7efbb3 0%, #036704 100%)";
            captureVersoButton.style.backgroundColor = "#1b8426";
            shouldRedirect = true;
        }, 8000);
    }
});

captureVersoButton.addEventListener('click', function() {
    isRecto = false;
    rectoText.textContent = "Verso";
    startCamera();
    document.getElementById('camera-container').style.display = 'block';
    document.querySelector('.wrapper').style.display = 'none';
    retryCaptureButtonRecto.style.display = 'none';
    
    // setTimeout(function() {
        captureVersoButton.textContent = 'Loading Verso...';
        captureVersoButton.style.backgroundColor = "#d3d3d3";
        captureVersoButton.style.backgroundImage = "none";
    // }, 500);
    
    setTimeout(function() {
        captureVersoButton.textContent = 'Next step';
        captureVersoButton.style.backgroundImage = "linear-gradient(62deg, #7efbb3 0%, #036704 100%)";
        captureVersoButton.style.backgroundColor = "#1b8426";
        shouldRedirect = true;
    }, 8000);
});

retryCaptureButtonRecto.addEventListener('click', function() {
    progressContainerRecto.style.display = 'flex';
    validIconRecto.style.display = 'none';
    document.querySelector('.wrapper').style.display = 'none'; 
    document.getElementById('camera-container').style.display = 'block';
    startCamera();
    resetProgressBar(progressBarRecto);
    
    setTimeout(function() {
        progressBarRecto.style.width = '70%';
        captureVersoButton.textContent = 'Loading Recto...';
        captureVersoButton.style.backgroundColor = "#d3d3d3";
        captureVersoButton.style.backgroundImage = "none";
    }, 500);
    
    setTimeout(function() {
        validIconRecto.style.display = 'inline';
        startCaptureButton.style.display = 'none';
        captureVersoButton.style.display = 'block';
        captureVersoButton.textContent = 'capture verso';
        captureVersoButton.style.backgroundImage = "linear-gradient(62deg, #7efbb3 0%, #036704 100%)";
        captureVersoButton.style.backgroundColor = "#1b8426";
    }, 6000);
});

retryCaptureButtonVerso.addEventListener('click', function() {
    progressContainerVerso.style.display = 'flex';
    validIconVerso.style.display = 'none';
    document.querySelector('.wrapper').style.display = 'none'; 
    document.getElementById('camera-container').style.display = 'block';
    startCamera();
    resetProgressBar(progressBarVerso);
    
    setTimeout(function() {
        captureVersoButton.textContent = 'Loading Verso...';
        captureVersoButton.style.backgroundColor = "#d3d3d3";
        captureVersoButton.style.backgroundImage = "none";
    }, 500);
    
    setTimeout(function() {
        captureVersoButton.textContent = 'Next step';
        captureVersoButton.style.backgroundImage = "linear-gradient(62deg, #7efbb3 0%, #036704 100%)";
        captureVersoButton.style.backgroundColor = "#1b8426";
        shouldRedirect = true;
    }, 8000);
});


closeButton.addEventListener('click', function() {
    stopCamera();
    document.getElementById('camera-container').style.display = 'none';
    document.querySelector('.wrapper').style.display = 'block';
});

function stopCamera() {
    if (video.srcObject) {
        let tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}
console.log('Script started');
