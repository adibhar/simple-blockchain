const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, prevHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.hashFunction();
    this.nonce = 0; // used to force the hash to meet the standard of having enough 0s (as many as difficulty is set to) as needed
  }

  hashFunction(){
    return crypto.createHash('sha256').update(this.index + this.timestamp + this.data + this.prevHash + this.nonce).digest('hex');
  }

  /*
    Required for Proof-of-Work. Without mining, it's easy to tamper with a block, then quickly tamper with subsequent blocks
    so the blockchain validity is not broken.
  */
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++;
        this.hash = this.hashFunction();
    }
  }

}

class Blockchain {
  constructor(difficulty) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
  }


  createGenesisBlock() {
    return new Block(0, Date.now(), 'Genesis Block', '0000');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
    
      const curBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (curBlock.hash !== curBlock.hashFunction() || curBlock.prevHash !== prevBlock.hash) {
        return false; 
      }

    }
    return true;
  }
}

let simpleBlockchain = new Blockchain(5);
simpleBlockchain.addBlock(new Block(1, Date.now(), 'First Block', simpleBlockchain.getLatestBlock().hash));
console.log("Block 1 mined");
simpleBlockchain.addBlock(new Block(2, Date.now(), 'Second Block', simpleBlockchain.getLatestBlock().hash));
console.log("Block 2 mined");

console.log(JSON.stringify(simpleBlockchain, null, 2));
console.log('Is blockchain valid? ' + simpleBlockchain.isValidChain());
