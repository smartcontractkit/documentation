/**
 * Tools powering the ENS page
 */
async function getDropdownAddress() {
  document.getElementById('address1-link').href = "";
  document.getElementById('address1').innerHTML = "loading...";
  document.getElementById('address1-label').innerHTML = "loading...";
  document.getElementById('address1-label-link').href = "";
  document.getElementById('address1-hash').innerHTML = "loading...";
  document.getElementById('address1-hash-link').href = "";
  let select = document.getElementById('pairs');
  const selectedEnsString = select.options[select.selectedIndex].value;
  const data = JSON.stringify({
    query: `{
          domains(where:{name:"${selectedEnsString}"}) {
            id
            name
          }
        }`,
  });

  const response = await fetch(
    'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Node',
      },
    }
  );
  const json = await response.json();
  const hashName = json.data.domains[0] ? json.data.domains[0].id : "Not Found";
  const web3 = new Web3("https://mainnet.infura.io/v3/34ed41c4cf28406885f032930d670036");
  web3.eth.ens.getAddress(selectedEnsString)
    .then((address) => {
      document.getElementById('address1-label').innerHTML = selectedEnsString;
      document.getElementById('address1-label-link').href = "https://app.ens.domains/name/" + selectedEnsString;
      document.getElementById('address1').innerHTML = address;
      document.getElementById('address1-link').href = "https://etherscan.io/address/" + address;
      document.getElementById('address1-hash').innerHTML = hashName;
      document.getElementById('address1-hash-link').href = "https://app.ens.domains/name/" + selectedEnsString;
    })
    .catch((error) => {
      document.getElementById('address1').innerHTML = "not found";
      document.getElementById('address1-link').href = "";
      document.getElementById('address1-label').innerHTML = "not found";
      document.getElementById('address1-label-link').href = "";
      document.getElementById('address1-hash').innerHTML = "not found";
      document.getElementById('address1-hash-link').href = "";
    })
}
