const randWord = words => {
  const index = Math.floor((Math.random() * words.length) + 1) - 1;

  return words[index];
};

export default randWord;