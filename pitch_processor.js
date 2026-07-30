class PitchProcessor extends AudioWorkletProcessor {

    constructor() {
        super();

        this.bufferSize = 2048;
        this.buffer = new Float32Array(this.bufferSize);
        this.index = 0;
    }


    process(inputs) {
       const input = inputs[0];

        if (!input || input.length === 0) {
            return true;
        }

        const samples = input[0]; //questo contiene solo 128 campioni

        if (!samples) {
            return true;
        }


        for (let i = 0; i < samples.length; i++) {

            this.buffer[this.index] = samples[i];
            this.index++;


            if (this.index >= this.bufferSize) {
                const frequency = yin(this.buffer, sampleRate, 1000, 0.1);
                
              this.port.postMessage(frequency);

                this.index = 0;
            }
        }
      
        return true;
    }
}


registerProcessor(
    "pitch_processor",
    PitchProcessor
);

const yin = (buffer, sampleRate, maxLag, threshold = 0.1) => {
	const len = buffer.length;

    // 1. Difference Function
    const df = new Float32Array(maxLag + 1);

    for (let tau = 0; tau <= maxLag; tau++) {
        let sum = 0;

        for (let i = 0; i < len - tau; i++) {
            const diff = (buffer[i] - buffer[i + tau]);
            sum += diff * diff;
        }

        df[tau] = sum;
    }

    // 2. CMNDF
    const cmndf = new Float32Array(maxLag + 1);
    cmndf[0] = 1;

    let runningSum = 0;

    for (let tau = 1; tau <= maxLag; tau++) {
        runningSum += df[tau];

        cmndf[tau] = runningSum === 0
            ? 1
            : (df[tau] * tau) / runningSum;
    }

    // 3. Absolute threshold
    let tau = -1;

    for (let i = 2; i <= maxLag; i++) {
        if (cmndf[i] < threshold) {

            // cerca il minimo locale
            while (
                i + 1 <= maxLag &&
                cmndf[i + 1] < cmndf[i]
            ) {
                i++;
            }

            tau = i;
            break;
        }
    }

    if (tau === -1) {
        return {
            frequency: -1,
            probability: -1
        }
    }

    // 4. Interpolazione parabolica
    let betterTau = tau;

    if (tau > 0 && tau < maxLag) {
        const s0 = cmndf[tau - 1];
        const s1 = cmndf[tau];
        const s2 = cmndf[tau + 1];

        const denominator = 2 * (2 * s1 - s2 - s0);

        if (Math.abs(denominator) > 1e-12) {
            betterTau += (s2 - s0) / denominator;
        }
    }

    // 5. Frequenza fondamentale
    const frequency = sampleRate / betterTau;

    return {
        frequency,
        probability: 1 - cmndf[tau],
    };
}
