var fs = require('fs');
var Main = require('../../src/main.js');

describe("An e2e sequence", function(){
  it("should handle a basic case",function(){
    var input = fs.readFileSync('./spec/integration/simple.txt','UTF-8');

    //var statements = parser(input);

    var sequence = Main(input);

    console.log("");
    console.log(sequence.stringify());
    console.log("");

    expect(true).toBe(true);
  })

  it("should handle an advanced case",function(){
    var input = fs.readFileSync('./spec/integration/advanced.txt','UTF-8');

    var sequence = Main(input);

    console.log("");
    console.log(sequence.stringify());
    console.log("");

    expect(true).toBe(true);
  })
});
