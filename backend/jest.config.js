const preset = "ts-jest";
const transform = {
  "^.+\\.(ts|tsx)?$": "ts-jest",
  "^.+\\.(js|jsx)$": "babel-jest",
};

export default {
  preset,
  transform,
};
