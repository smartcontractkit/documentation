import React from 'react'
import { viewports } from '../viewports'
import { ViewTitle } from '../ViewTitle/ViewTitle'
import styles from './navBarStories.module.css'
import { NavBarView } from './NavBarView'
import { getIconUrl } from './utils'

export default {
  title: 'Components/NavBarViewMobile',
  parameters: {
    chromatic: {
      viewports: [viewports.XS, viewports.M],
      pauseAnimationAtEnd: true,
      delay: 2000,
    },
  },
}

const SearchTrigger = () => (
  <button style={{ display: 'flex' }}>
    <img
      className={styles.searchTrigger}
      src={getIconUrl('searchIcon_blue_noborder')}
    />
  </button>
)

const productsNav = {
  trigger: { label: 'Docs', icon: 'docs' },
  categories: [
    {
      label: 'Developer Hub',
      items: [
        {
          label: 'Home',
          icon: 'ccip',
          href: 'https://dev.chain.link/',
          subProducts: {
            label: 'Staking',
            items: [
              { label: 'Overview', href: 'https://staking.chain.link/' },
              {
                label: 'Eligibility',
                href: 'https://staking.chain.link/eligibility',
              },
            ],
          },
        },
        {
          label: 'Docs',
          icon: 'docs',
          href: 'https://docs.chain.link',
        },
        {
          label: 'All Resources',
          icon: 'resources',
          href: 'https://dev.chain.link/resources',
        },
      ],
    },
    {
      label: 'Product Resources',
      items: [
        {
          label: 'CCIP',
          icon: 'ccip',
          href: 'https://dev.chain.link/products/ccip',
        },
        {
          label: 'Data',
          icon: 'data',
          href: 'https://dev.chain.link/products/data',
        },
        {
          label: 'Functions',
          icon: 'functions',
          href: 'https://dev.chain.link/products/functions',
        },
        {
          label: 'Automation',
          icon: 'automation',
          href: 'https://dev.chain.link/products/automation',
        },
        {
          label: 'VRF',
          icon: 'vrf',
          href: 'https://dev.chain.link/products/vrf',
        },
        {
          label: 'General',
          icon: 'general',
          href: 'https://dev.chain.link/products/general',
        },
      ],
    },
  ],
}

export const Default = () => (
  <>
    <div className={styles.container}>
      <ViewTitle checks={['Default']} />
      <NavBarView
        productsNav={productsNav}
        subProductsNav={[]}
        path="/"
        isMenuOpen={false}
        setNavMenuOpen={() => {}}
        searchTrigger={<SearchTrigger />}
      />
    </div>
  </>
)
