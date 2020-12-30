import * as CryptoJS from "crypto-js";

class Block {
  public index: number;
  public hash: string;
  public prevHash: string;
  public data: string;
  public timestamp: number;

  static calculateBlockHash(
    index: number,
    prevHash: string,
    timestamp: number,
    data: string
  ) {
    return CryptoJS.SHA256(index + prevHash + timestamp + data).toString();
  }

  static validStructure(aBlock: Block): boolean {
    return (
      typeof aBlock.data === "string" &&
      typeof aBlock.hash === "string" &&
      typeof aBlock.prevHash === "string" &&
      typeof aBlock.index === "number" &&
      typeof aBlock.timestamp === "number"
    );
  }

  constructor(
    index: number,
    hash: string,
    prevHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(
  0,
  Block.calculateBlockHash(0, "", getNewTimeStamp(), "hello"),
  "",
  "hello",
  getNewTimeStamp()
);

let blockChain: Block[] = [genesisBlock];

function getBlockChain(): Block[] {
  return blockChain;
}

function getLatestBlock(): Block {
  return blockChain[blockChain.length - 1];
}

function getNewTimeStamp(): number {
  return Math.round(new Date().getTime() / 1000);
}

function createNewBlock(data: string): Block {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimeStamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimeStamp
  );

  //   console.log(blockChain);

  addBlockToChain(newBlock);

  return newBlock;
}

function getHashOfBlock(aBlock: Block): string {
  return Block.calculateBlockHash(
    aBlock.index,
    aBlock.prevHash,
    aBlock.timestamp,
    aBlock.data
  );
}

function isBlockValid(candidateBlock: Block, prevBlock: Block): boolean {
  if (!Block.validStructure(candidateBlock)) {
    return false;
  } else if (prevBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (prevBlock.hash !== candidateBlock.prevHash) {
    return false;
  } else if (getHashOfBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else if (getHashOfBlock(prevBlock) !== prevBlock.hash) {
    console.log(
      `In the isBlockValid Func : ${
        (getHashOfBlock(prevBlock), prevBlock.hash)
      }`
    );
    return false;
  } else {
    return true;
  }
}

function addBlockToChain(candidateBlock: Block): void {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockChain.push(candidateBlock);
    console.log("It's Valid");
  } else {
    console.log(candidateBlock);
    console.log("It's not Valid");
  }
}

// addBlockToChain(genesisBlock);

createNewBlock("second Block");
createNewBlock("third Block");
createNewBlock("fourth block");

console.log(blockChain);

export {};
