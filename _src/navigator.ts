// Select-based navigation in the top bar
document.addEventListener('DOMContentLoaded', () => {
  const chainSelector = <HTMLSelectElement>document.getElementById('navigator-chain');
  const productSelector = <HTMLSelectElement>document.getElementById('navigator-product');

  // Only setup selectors on the page when they exist
  if (chainSelector && productSelector) {
    const paths: {
      [chain: string]: { [product: string]: string };
    } = {
      ethereum: {
        all: '/ethereum',
        feeds: '/docs/using-chainlink-reference-contracts/',
        vrf: '/docs/chainlink-vrf/',
        keepers: '/docs/chainlink-keepers/introduction/',
        anyapi: '/docs/request-and-receive-data/',
      },
      solana: {
        all: '/docs/solana',
        feeds: '/docs/solana/using-data-feeds-solana',
      },
      terra: {
        all: '/docs/terra/',
        feeds: '/docs/terra/using-data-feeds-terra/',
      },
      node: {
          all: '/chainlink-nodes/'
      }
    };

    // Set up
    // We need to figure out how to set these dropdowns correctly at setup
    // Option 1: Every page is tagged with metadata that we render in nodes.liquid
    // Option 2: We enforce a strict URL pathing so we can infer the section from the URL
    // Option 3: Just set it when we make a selection
    if (localStorage['chainSelection']) {
      chainSelector.value = localStorage['chainSelection'];
    }
    if (localStorage['productSelection']) {
      productSelector.value = localStorage['productSelection'];
    }

    const currentChain = chainSelector.value;
    for (let product of <HTMLOptionElement[]>Array.apply(null, <any>productSelector.options)) {
      if (!paths[currentChain][product.value]) {
        product.disabled = true;
        console.log(currentChain, product.value, "doesn't exist");
      } else {
        product.disabled = false;
        console.log(currentChain, product.value, 'exists');
      }
    }

    const update = () => {
      // window.location.href = "google.com";
      const chain = chainSelector.value;
      let product = productSelector.value;
      if (!product || !paths[chain][product]) {
        product = 'all';
      }
      window.location.href = `${paths[chain][product]}`;
      console.log('changing chainclass to', `${paths[chain][product]}`);

      localStorage['chainSelection'] = chain;
      localStorage['productSelection'] = product;
    };

    chainSelector?.addEventListener('change', update);
    productSelector?.addEventListener('change', update);
  }
});
