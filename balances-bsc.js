const Web3 = require('web3');
const BigNumber = require('bignumber.js');

// TODO: create a free account with https://www.moralis.io (speedy nodes, Mainnet Archive) and paste your API key here
const web3 = new Web3(`https://speedy-nodes-nyc.moralis.io/4545009d0XXXXXXXXXXXXXXX/bsc/mainnet/archive`);

// TODO: change the BSC block number here if you want to check historic balances in a different date (see https://bscscan.com/blocks)
const BlockNumber = 13969660; // this is the last block of 2021-12-31, mined on Dec-31-2021 11:59:58 PM +UTC
const BalanceSnapshotTime = 'Dec-31-2021 11:59:58 PM +UTC';

// abi
const Erc20Abi = [{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

// TODO: verify all the BEP20 tokens you want to check appear below
// https://bscscan.com/tokens is a good source for addresses for missing tokens
const Tokens = {
  ADA: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
  ALPACA: '0x8f0528ce5ef7b51152a59745befdd91d97091d2f',
  ALPHA: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
  AUTO: '0xa184088a740c695e156f91f5cc086a06bb78b827',
  AVAX: '0x1ce0c2827e2ef14d5c4f29a091d735a204794041',
  BAKE: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
  BSCDEFI: '0x40e46de174dfb776bb89e04df1c47d8a66855eb3',
  BTCB: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
  BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  CAKE: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  DAI: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
  DODO: '0x67ee3cb086f8a16f34bee3ca72fad36f7db929e2',
  DOGE: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
  DOT: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
  EPS: '0xa7f552078dcc247c2684336020c03648500c6d9f',
  // ETH:	'0x000000A0c521DD28025B937B1f15141D61969959',
  HOTCROSS: '0x4fa7163e153419e0e1064e418dd7a99314ed27b6',
  LINA: '0x762539b45a1dcce3d36d080f74d1aed37844b878',
  LINK: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
  MDX: '0x9c65ab58d8d978db963e63f2bfb7121627e3a739',
  UNI: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
  USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  USDT: '0x55d398326f99059ff775485246999027b3197955',
  UST: '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  XRP: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
  XVS: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
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
  console.log(`${address},${BlockNumber},${BalanceSnapshotTime},native,BNB,${await getBnbBalance(address, BlockNumber)}`);
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

async function getBnbBalance(address, block) {
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