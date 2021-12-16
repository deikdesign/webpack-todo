const {newListFormat} = require('.src/index.js');

test('should output name', () => {
    const text = newListFormat('Hello');
    expect(text).toBe('Hello');
});


// const { generateText } = require('./util');

// test('should output name and age', () => {
//     const text = generateText('Max', 29);
//     expect(text).toBe('Max (29 years old)');
// });