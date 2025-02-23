// src/utils/random.js
export function humanDelay(actionType) {
  const delays = {
    'fold': [0.7, 1.1],
    'raise': [1.2, 1.8],
    'timebank': [4.5, 8.0],
    'click': [0.2, 0.5] // Added delay for clicking
  };

  const [min, max] = delays[actionType];
  const delay = Math.random() * (max - min) + min;
  console.log(`Delaying action ${actionType} for ${delay} seconds`);
  return new Promise(resolve => setTimeout(resolve, delay * 1000));
}
