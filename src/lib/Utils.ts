import { getUrlParams } from "./URL";

export async function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), duration);
    });
}

export async function aiThinking() {
    const urlParams = getUrlParams();

    let waitTime = 3000;
    const waitParam = urlParams.get('aiWaitTime');
    if (waitParam) {
        waitTime = parseInt(waitParam) * 1000;
    }

    let waitRandom = urlParams.get('aiWaitRandom') != 'false';
    if (waitRandom) {
        await sleep(Math.random() * waitTime);
    } else {
        await sleep(waitTime);
    }
}
