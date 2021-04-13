/**
 * Tools powering the ENS page
 */
function getDropdownAddress() {
  $('#address1-link').attr("href", "");
  $('#address1').html("loading...");
	const selectedEnsString = $("#pairs option:selected").val();
  const web3 = new Web3("https://mainnet.infura.io/v3/34ed41c4cf28406885f032930d670036");
  web3.eth.ens.getAddress(selectedEnsString)
    .then((address) => {
      $('#address1').html(address);
      $('#address1-link').attr("href", "https://etherscan.io/address/" + address);
    })
		.catch((error) => {
      $('#address1').html("not found");
      $('#address1-link').attr("href", "");
    })
}
  
function getManualAddress() {
  $('#address2-link').attr("href", "");
  $('#address2').html("loading...");
  $('#address2-label').html("loading...");
  $('#address2-label-link').attr("href", "");
  const asset1 = $('#asset-1').val().toLowerCase();
  const asset2 = $('#asset-2').val().toLowerCase();
  const ensString = asset1+'-'+asset2+'.data.eth';
  const web3 = new Web3("https://mainnet.infura.io/v3/34ed41c4cf28406885f032930d670036");
    web3.eth.ens.getAddress(ensString)
    .then((address) => {
      $('#address2-label').html(ensString);
      $('#address2-label-link').attr("href", "https://app.ens.domains/name/" + ensString);
      $('#address2').html(address);
      $('#address2-link').attr("href", "https://etherscan.io/address/" + address);
    })
		.catch((error) => {
      $('#address2-label').html(ensString);
      $('#address2-label-link').attr("href", "");
      $('#address2').html("not found");
      $('#address2-link').attr("href", "");
    })
}

function getLatestPrice() {
    jQuery('#get-price-field').val("loading...")
    const web3 = new Web3("https://kovan.infura.io/v3/34ed41c4cf28406885f032930d670036");
		const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
		const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331";
		const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

    priceFeed.methods.latestRoundData().call()
      .then((roundData) => {
      	jQuery('#get-price-field').val(roundData.answer)
      });
}

function getHistoricalPrice() {
    jQuery('#get-price-field').val("loading...")
    const web3 = new Web3("https://kovan.infura.io/v3/34ed41c4cf28406885f032930d670036");
		const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
		const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331";
		const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

    let validId = BigInt("18446744073709562301");
    priceFeed.methods.getRoundData(validId).call()
      .then((historicalRoundData) => {
      	jQuery('#get-price-field').val(historicalRoundData.answer)
     	})
  }