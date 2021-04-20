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



