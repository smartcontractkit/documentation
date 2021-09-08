/** Fixes deployment URLs when on a preview URL */
document.addEventListener('DOMContentLoaded', () => {
  const host = window.location.hostname;
  if (host !== 'docs.chain.link') {
    // Rewrite Remix URLs with current hostname
    // eg https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&url=https://docs.chain.link/samples/VRF/VRFD20.sol

    for (let item of document.links) {
      if (item.href.startsWith('https://remix.ethereum.org')) {
        item.setAttribute('href', item.href.replace('docs.chain.link', host));
      }
    }
  }
});
