/**
 * Tools powering the ENS page
 */
function getDropdownAddress() {
  document.getElementById('address1-link').href= "";
  document.getElementById('address1').innerHTML="loading...";
  let select = document.getElementById('pairs');
	const selectedEnsString = select.options[select.selectedIndex].value; 
  console.log('selected',selectedEnsString);
  const web3 = new Web3("https://mainnet.infura.io/v3/34ed41c4cf28406885f032930d670036");
  web3.eth.ens.getAddress(selectedEnsString)
    .then((address) => {
      document.getElementById('address1').innerHTML=address;
      document.getElementById('address1-link').href= "https://etherscan.io/address/" + address;
    })
		.catch((error) => {
      document.getElementById('address1').innerHTML="not found";
      document.getElementById('address1-link').href= "";
    })
}
  
function getManualAddress() {
  document.getElementById('address2-link').href= "";
  document.getElementById('address2').innerHTML="loading...";
  document.getElementById('address2-label').innerHTML="loading...";
  document.getElementById('address2-label-link').href= "";
  const asset1 = document.getElementById('asset-1').value.toLowerCase();
  const asset2 = document.getElementById('asset-2').value.toLowerCase();
  const ensString = asset1+'-'+asset2+'.data.eth';
  const web3 = new Web3("https://mainnet.infura.io/v3/34ed41c4cf28406885f032930d670036");
    web3.eth.ens.getAddress(ensString)
    .then((address) => {
      document.getElementById('address2-label').innerHTML=ensString;
      document.getElementById('address2-label-link').href= "https://app.ens.domains/name/" + ensString;
      document.getElementById('address2').innerHTML=address;
      document.getElementById('address2-link').href= "https://etherscan.io/address/" + address;
    })
		.catch((error) => {
      document.getElementById('address2-label').innerHTML=ensString;
      document.getElementById('address2-label-link').href= "";
      document.getElementById('address2').innerHTML="not found";
      document.getElementById('address2-link').href= "";
    })
}



