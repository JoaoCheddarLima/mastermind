export function randomId() {
    const getRandomPrime = () => {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        return primes[Math.floor(Math.random() * primes.length)];
    };

    const randomPrime = getRandomPrime();
    const currentDateInMs = Date.now();
    const id = (randomPrime * currentDateInMs).toString();

    return id
}