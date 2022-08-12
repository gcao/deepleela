import UserPreferences from "src/common/UserPreferences";
import { getUrlParams } from "./URL";

export async function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), duration);
    });
}

export async function aiThinking(time: number|undefined, random: boolean|undefined) {
    const urlParams = getUrlParams();

    let waitTime = time;
    if (waitTime === undefined) {
        waitTime = 3000;
        const waitParam = urlParams.get('aiWaitTime');
        if (waitParam) {
            waitTime = parseInt(waitParam) * 1000;
        } else {
            waitTime = parseInt(UserPreferences.aiWaitTime);
        }
    }

    let waitRandom = random;
    if (waitRandom === undefined) {
        const randomParam = urlParams.get('aiWaitRandom');
        if (randomParam) {
            waitRandom = randomParam != 'false';
        } else {
            waitRandom = UserPreferences.aiWaitRandom === 'true';
        }
    }

    if (waitRandom) {
        await sleep(Math.random() * waitTime);
    } else {
        await sleep(waitTime);
    }
}
