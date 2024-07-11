let values = [];
let w = 10;
let states = [];
let canvasHeight = 400;
let canvasWidth = 800;
let audioContext;

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    resetValues();
    noLoop();
}

function draw() {
    background(0);

    for (let i = 0; i < values.length; i++) {
        if (states[i] == 0) {
            fill('#E0777D');
        } else if (states[i] == 1) {
            fill('#D6FFB7');
        } else {
            fill(255);
        }
        rect(i * w, height - values[i], w, values[i]);
    }
}

function resetValues() {
    values = new Array(floor(canvasWidth / w));
    for (let i = 0; i < values.length; i++) {
        values[i] = random(canvasHeight);
        states[i] = -1;
    }
    redraw();
}

async function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            states[j] = 1;
            states[j + 1] = 1;
            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1);
            }
            states[j] = -1;
            states[j + 1] = -1;
        }
    }
}

async function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        states[minIdx] = 1;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) {
                states[minIdx] = -1;
                minIdx = j;
                states[minIdx] = 1;
            }
        }
        if (minIdx !== i) {
            await swap(arr, i, minIdx);
        }
        states[minIdx] = -1;
        states[i] = 0;
    }
}

async function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        states[i] = 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
        await sleep(50);
        states[i] = -1;
        states[j + 1] = 0;
    }
}

async function swap(arr, a, b) {
    await sleep(50);
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    
    // Calculate frequency based on the values being swapped
    const minFrequency = 200; // Minimum frequency
    const maxFrequency = 1000; // Maximum frequency
    const normalizedA = map(arr[a], 0, canvasHeight, minFrequency, maxFrequency);
    const normalizedB = map(arr[b], 0, canvasHeight, minFrequency, maxFrequency);
    const frequencyA = constrain(normalizedA, minFrequency, maxFrequency);
    const frequencyB = constrain(normalizedB, minFrequency, maxFrequency);
    
    // Play beep sound with the calculated frequencies
    playBeep(50, frequencyA);
    playBeep(50, frequencyB);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('sortButton').addEventListener('click', function() {
    const sortingAlgorithm = document.getElementById('sortingAlgorithm').value;

    // Check if audioContext is not already created
    if (!audioContext) {
        // Create AudioContext
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    switch(sortingAlgorithm) {
        case 'bubbleSort':
            bubbleSort(values).then(() => console.log('Sorting completed!'));
            break;
        case 'selectionSort':
            selectionSort(values).then(() => console.log('Sorting completed!'));
            break;
        case 'insertionSort':
            insertionSort(values).then(() => console.log('Sorting completed!'));
            break;
        // Add cases for other sorting algorithms here
        default:
            console.log("Invalid choice");
    }
    loop();
});

document.getElementById('refreshButton').addEventListener('click', function() {
    resetValues();
});

// Function to create a beep sound
function playBeep(duration, frequency) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = 0.5; // Set volume (adjust as needed)
    oscillator.frequency.value = frequency; // Set frequency

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + (duration / 1000));
}
