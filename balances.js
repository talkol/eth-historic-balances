const Web3 = require('web3');
const BigNumber = require('bignumber.js');

// TODO: create a free account with https://www.alchemy.com and paste your API key here
const web3 = new Web3(`https://eth-mainnet.alchemyapi.io/v2/FY6BwiO9_hzVN4N2Fx8Ti-XXXXXXXXXX`);

// TODO: change the Ethereum block number here if you want to check historic balances in a different date (see https://etherscan.io/blocks)
const BlockNumber = 13916165; // this is the last block of 2021-12-31, mined on Dec-31-2021 11:59:49 PM +UTC

// abi
const Erc20Abi = [{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

// TODO: verify all the ERC20 tokens you want to check appear below
// https://tokenlists.org is a good source for addresses for missing tokens
const Tokens = {
  ALI:	'0x6b0b3a982b4634ac68dd83a4dbf02311ce324181',
  AMP:	'0xff20817765cb7f73d4bde2e66e067e58d11095c2',
  ANGLE:	'0x31429d1856ad1377a8a0079410b297e1a9e214c2',
  API3: '0x0b38210ea11411557c13457d4da7dc6ea731b88a',
  AST:	'0x27054b13b1b798b345b591a4d22e6562d47ea75a',
  Auction:	'0xa9b1eb5908cfc3cdf91f9b8b3a74108598009096',
  BAT:  '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
  BICO:	'0xf17e65822b568b3903685a7c9f496cf7656cc6c2',
  BNB:  '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  BNT:  '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
  BOBA:	'0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
  BTRST:	'0x799ebfabe77a6e34311eeee9825190b9ece32824',
  BUSD: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  CPOOL:	'0x66761fa41377003622aee3c7675fc7b5c1c2fac5',
  CTX:	'0x321c2fe4446c7c963dc41dd58879af648838f98d',
  CUBE:	'0xdf801468a808a32656d2ed2d2d80b72a129739f4',
  CVP:	'0x38e4adb44ef08f22f5b5b76a8f0c2d0dcbe7dca1',
  DAI:  '0x6b175474e89094c44da98b954eedeac495271d0f',
  DATA:	'0x33d63ba1e57e54779f7ddaeaa7109349344cf5f1',
  DFYN:	'0x9695e0114e12c0d3a3636fab5a18e6b737529023',
  DOUGH:	'0xad32A8e6220741182940c5aBF610bDE99E737b2D',
  DYDX:	'0x92d6c1e31e14520e676a687f0a93788b716beff5',
  ERN:	'0xbbc2ae13b23d715c30720f079fcd9b4a74093505',
  // FLOKI:	'0xcf0c122c6b73ff809c693db761e7baebe62b6a2e', FLOKI ETH deployed in 2022
  FRONT:	'0xf8C3527CC04340b208C854E985240c02F7B7793f',
  FTM:  '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
  GALA:	'0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA',
  GODS: '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97',
  GYEN:	'0xC08512927D12348F6620a698105e1BAac6EcD911',
  INDEX:	'0x0954906da0Bf32d5479e25f46056d22f08464cab',
  JUP:	'0x4B1E80cAC91e2216EEb63e29B957eB91Ae9C2Be8',
  KEEP: '0x85eee30c52b0b379b046fb0f85f4f3dc3009afec',
  KNC:  '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
  KP3R:	'0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
  LDO:	'0x5a98fcbea516cf06857215779fd812ca3bef1b32',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  MARS4:  '0x16cda4028e9e872a38acb903176719299beaed87',
  MCO:  '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
  MCO2:	'0xfc98e825a2264d890f9a1e68ed50e1526abccacd',
  MINDS:	'0xB26631c6dda06aD89B93C71400D25692de89c068',
  MIR:	'0x09a3ecafa817268f77be1283176b946c4ff2e608',
  MKR:  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  NDX:	'0x86772b1409b61c639eaac9ba0acfbb6e238e5f83',
  NFTX:	'0x87d73E916D7057945c9BcD8cdd94e42A6F47f776',
  PENDLE:	'0x808507121b80c02388fad14726482e061b8da827',
  PERP:	'0xbC396689893D065F41bc2C6EcbeE5e0085233447',
  PLA:	'0x3a4f40631a4f906c2BaD353Ed06De7A5D3fCb430',
  POLS:	'0x83e6f1E41cdd28eAcEB20Cb649155049Fac3D5Aa',
  POND:	'0x57b946008913b82e4df85f501cbaed910e58d26c',
  POOL: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
  PROM:	'0xfc82bb4ba86045af6f327323a46e80412b91b27d',
  PSP:	'0xcafe001067cdef266afb7eb5a286dcfd277f3de5',
  PUSH:	'0xf418588522d5dd018b425e472991e52ebbeeeeee',
  QRDO:	'0x4123a133ae3c521fd134d7b13a2dec35b56c2463',
  QUARTZ:	'0xba8a621b4a54e61c442f5ec623687e2a942225ef',
  RADAR:	'0x44709a920fccf795fbc57baa433cc3dd53c44dbe',
  REP:  '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  SKL:  '0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7',
  SKRT:	'0x887168120cb89fb06f3e74dc4af20d67df0977f6',
  SNX:	'0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  SWAPP:	'0x8cb924583681cbfe487a62140a994a49f833c244',
  TRAC:	'0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f',
  TRU:	'0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
  TUSD:	'0x0000000000085d4780B73119b644AE5ecd22b376',
  SAI:  '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
  UFT:	'0x0202Be363B8a4820f3F4DE7FaF5224fF05943AB1',
  UMA:	'0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
  UNB:	'0x8dB253a1943DdDf1AF9bcF8706ac9A0Ce939d922',
  UNI:  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  USDC:	'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  USDP:	'0x8e870d67f660d95d5be530380d0ec0bd388289e1',
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  VEGA:	'0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e',
  WAMPL:	'0xEDB171C18cE90B633DB442f2A6F72874093b49Ef',
  WBTC:	'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  wCELO:	'0xe452e6ea2ddeb012e20db73bf5d3863a3ac8d77a',
  wCUSD:	'0xad3e3fc59dff318beceaab7d00eb4f68b1ecf195',
  WETH:	'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  XOR:	'0x40FD72257597aA14C7231A7B1aaa29Fce868F677',
  XYO:	'0x55296f69f40ea6d20e478533c15a6b08b654e758',
  YGG:	'0x25f8087ead173b73d6e8b84329989a8eea16cf73',
  YLD:	'0xf94b5c5651c888d928439ab6514b93944eee6f48',
  ZRX:  '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
}

async function main() {
  const address = process.argv[2];
  if (!address) {
    console.log('Usage: script <wallet-address>');
    console.log('Example: script 0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2');
    process.exit(1);
  }
  // print csv header
  console.log('Wallet,Block,Token Address,Token,Balance');
  // print ETH balance (special, not ERC20)
  console.log(`${address},${BlockNumber},native,ETH,${await getEthBalance(address, BlockNumber)}`);
  // go over all known tokens
  for (const token in Tokens) {
    const tokenAddress = Tokens[token];
    const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
    await sleep(85); // avoid Alchemy api throttling
    const balance = await getBalance(tokenContract, address, BlockNumber);
    // print token balance if non-zero
    if (balance > 0) {
      console.log(`${address},${BlockNumber},${tokenAddress},${token},${balance}`);
    }
  }
}

async function getEthBalance(address, block) {
  const decimalsNum = new BigNumber(`1e18`);
  const res = await web3.eth.getBalance(address, block);
  const resNum = new BigNumber(res).dividedBy(decimalsNum);
  return resNum.toFormat(6).replace(',','');
}

async function getBalance(contract, address, block) {
  const decimals = await contract.methods.decimals().call();
  const decimalsNum = new BigNumber(`1e${decimals}`);
  const res = await contract.methods.balanceOf(address).call({}, block);
  const resNum = new BigNumber(res).dividedBy(decimalsNum);
  return resNum.toFormat(6).replace(',','');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();