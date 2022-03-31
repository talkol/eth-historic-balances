const Web3 = require('web3');
const BigNumber = require('bignumber.js');

// TODO: create a free account with https://www.alchemy.com and paste your API key here
const web3 = new Web3(`https://polygon-mainnet.g.alchemy.com/v2/FY6BwiO9_hzVN4N2Fx8Ti-XXXXXXXXXX`);

// TODO: change the Polygon block number here if you want to check historic balances in a different date (see https://polygonscan.com/blocks)
const BlockNumber = 23201013; // this is the last block of 2021-12-31, mined on Dec-31-2021 11:59:59 PM +UTC
const BalanceSnapshotTime = 'Dec-31-2021 11:59:59 PM +UTC';

// abi
const Erc20Abi = [{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

// TODO: verify all the ERC20 tokens you want to check appear below
// https://polygonscan.com/tokens is a good source for addresses for missing tokens
const Tokens = {
  AAVE: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
  DAI:  '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  DFYN: '0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97',
  ELON: '0xe0339c80ffde91f3e20494df88d4206d86024cdf',
  LINK: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
  MANA: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4',
  QUICK:  '0x831753dd7087cac61ab5644b308642cc1c33dc13',
  ROUTE:  '0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4',
  SUSHI:  '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a',
  USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  WBTC: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
  WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  WMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  dQUICK: '0xf28164a485b0b2c90639e47b0f377b4a438a16b1',
}

async function main() {
  const address = process.argv[2];
  if (!address) {
    console.log('Usage: script <wallet-address>');
    console.log('Example: script 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2');
    process.exit(1);
  }
  // print csv header
  console.log('Wallet,Block,Balance Snapshot Time,Token Address,Token,Balance');
  // print ETH balance (special, not ERC20)
  console.log(`${address},${BlockNumber},${BalanceSnapshotTime},native,MATIC,${await getEthBalance(address, BlockNumber)}`);
  // go over all known tokens
  for (const token in Tokens) {
    const tokenAddress = Tokens[token];
    const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
    await sleep(85); // avoid Alchemy api throttling
    const balance = await getBalance(tokenContract, address, BlockNumber);
    // print token balance if non-zero
    if (balance > 0) {
      console.log(`${address},${BlockNumber},${BalanceSnapshotTime},${tokenAddress},${token},${balance}`);
    }
  }
}

async function getEthBalance(address, block) {
  const decimalsNum = new BigNumber(`1e18`);
  const res = await web3.eth.getBalance(address, block);
  const resNum = new BigNumber(res).dividedBy(decimalsNum);
  return resNum.toFormat(6).replaceAll(',','');
}

async function getBalance(contract, address, block) {
  const decimals = await contract.methods.decimals().call();
  const decimalsNum = new BigNumber(`1e${decimals}`);
  const res = await contract.methods.balanceOf(address).call({}, block);
  const resNum = new BigNumber(res).dividedBy(decimalsNum);
  return resNum.toFormat(6).replaceAll(',','');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();