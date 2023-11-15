import React from 'react'
import { viewports } from '../viewports'
import { ViewTitle } from '../ViewTitle/ViewTitle'
import styles from './navBarStories.module.css'
import { NavBarView } from './NavBarView'
import { getIconUrl } from './utils'

export default {
  title: 'Components/NavBarViewDesktop',
  component: NavBarView,
  parameters: {
    chromatic: { viewports: [viewports.M, viewports.XL] },
  },
}

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

const subProductsNav = [
  {
    label: 'Data Feeds',
    href: '/data-feeds',
  },
  {
    label: 'Data Streams',
    href: '/data-streams',
  },
  {
    label: 'CCIP',
    href: '/ccip',
  },
  {
    label: 'Functions',
    href: '/chainlink-functions',
  },
  {
    label: 'VRF',
    href: '/vrf',
  },
  {
    label: 'Automation',
    href: '/chainlink-automation',
  },
  {
    label: 'Nodes',
    href: '/chainlink-nodes',
  },
  {
    label: 'Overview',
    href: '/',
    hideFromDropdown: true,
  },
]

const SearchPlaceholder = () => {
  return (
    <form className={styles.searchForm}>
      <input
        type="text"
        name="search"
        placeholder="Search by Message ID"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'var(--space-4x) center',
          paddingLeft: 'var(--space-12x)',
          backgroundImage: `url("${getIconUrl('searchIcon_blue_noborder')}")`,
        }}
      />
    </form>
  )
}

export const Default = () => {
  return (
    <>
      <div style={{ zIndex: 4 }} className={styles.container}>
        <ViewTitle checks={['With action button']} />
        <NavBarView
          productsNav={productsNav}
          subProductsNav={subProductsNav}
          path="/"
          isMenuOpen={false}
          setNavMenuOpen={() => {}}
          searchTrigger={<SearchPlaceholder />}
        />
      </div>
      <div style={{ zIndex: 3 }} className={styles.container}>
        <ViewTitle
          checks={['With subProduct navigation', 'With github icon']}
        />
        <NavBarView
          path="/"
          isMenuOpen={false}
          setNavMenuOpen={() => {}}
          productsNav={productsNav}
          subProductsNav={subProductsNav}
          searchTrigger={SearchPlaceholder}
        />
      </div>
      <div style={{ zIndex: 2 }} className={styles.container}>
        <ViewTitle
          checks={[
            'With NavTabs',
            'NavTab default selected',
            'With SearchTrigger',
          ]}
        />
        <NavBarView
          path="/"
          isMenuOpen={false}
          setNavMenuOpen={() => {}}
          productsNav={productsNav}
          subProductsNav={subProductsNav}
        />
      </div>
    </>
  )
}
