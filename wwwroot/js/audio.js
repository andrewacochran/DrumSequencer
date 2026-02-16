// This will hold the main audio engine
let audioCtx;

// This is our "dictionary" to store the loaded audio files in memory
const audioBuffers = {};

// 1. Initialize the Audio Engine
export function initAudio() {
  // Create the context if it doesn't exist yet
  if (!audioCtx) {
    // We check for webkitAudioContext to support older Safari browsers
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Browsers suspend audio until a user interacts. This wakes it up.
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  console.log("Audio Engine Started!");
}

// 2. Download and Decode the Audio File
export async function loadSample(name, url) {
  if (!audioCtx) return;

  try {
    // Fetch the .wav file from the server
    const response = await fetch(url);
    // Turn it into raw binary data
    const arrayBuffer = await response.arrayBuffer();
    // Decode the binary data into actual audio waveforms
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // Save it to our dictionary (e.g., audioBuffers["kick"] = ...)
    audioBuffers[name.toLowerCase()] = audioBuffer;

    console.log(`Successfully loaded sample: ${name}`);
  } catch (error) {
    console.error(`Error loading sample ${name} from ${url}:`, error);
  }
}

// 3. Play the Sound Instantly
export function playSample(name) {
  const sampleName = name.toLowerCase();

  // Safety check: Make sure the engine is running and the sound exists
  if (!audioCtx || !audioBuffers[sampleName]) return;

  // Create a temporary "player" for this specific sound
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffers[sampleName];

  // Connect the player to the speakers
  source.connect(audioCtx.destination);

  // Press play! (0 means play immediately)
  source.start(0);
}

// 4. A placeholder for our MIDI bridge later
export async function setupMidi(dotNetHelper) {
  console.log("MIDI setup is coming soon!");
}
