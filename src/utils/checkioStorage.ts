export interface ChallengeData {
  challengeId: string;
  channel?: string;
}

const CHALLENGE_KEY = 'checkio_kount_challenge';

export const storeChallengeData = (data: ChallengeData): void => {
  try {
    sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(data));
  } catch (e) {
    // swallow
  }
};

export const getChallengeData = (): ChallengeData | null => {
  try {
    const raw = sessionStorage.getItem(CHALLENGE_KEY);
    return raw ? (JSON.parse(raw) as ChallengeData) : null;
  } catch {
    return null;
  }
};

export const clearChallengeData = (): void => {
  try {
    sessionStorage.removeItem(CHALLENGE_KEY);
  } catch {
    // ignore
  }
};


