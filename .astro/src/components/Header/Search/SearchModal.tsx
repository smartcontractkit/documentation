import * as CONFIG from "@config"
import React from "react"
import styles from "./Search.module.css"
import algoliasearch from "algoliasearch/lite"

import {
  InstantSearch,
  useInstantSearch,
  useHits,
  UseHitsProps,
} from "react-instantsearch-hooks-web"

const searchClient = algoliasearch(
  CONFIG.ALGOLIA.appId,
  CONFIG.ALGOLIA.publicApiKey
)

import { Modal } from "../../Modal/Modal"
import { SearchInput } from "./SearchInput"
import { clsx } from "~/lib"

function EmptyQueryBoundary({ children, fallback }) {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return (
      <div className={styles.noQueryFallback}>
        Type something to begin searching...
      </div>
    )
  }

  return children
}

function NoResultsBoundary({ children }) {
  const { results } = useInstantSearch()

  // The `__isArtificial` flag makes sure to not display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        <div className={styles.noQueryFallback}>
          <div>
            <h4>No result found</h4>
            <div>
              We couldn't find anything matching your search. Try again with a
              different term.
            </div>
          </div>
        </div>
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}
function CustomHits({
  title,
  hitClassName,
  ...props
}: UseHitsProps & { title: string; hitClassName?: string }) {
  const { hits, results } = useHits(props)

  if (hits.length === 0) return null
  return (
    <div>
      <h6>{title}</h6>
      <div className={styles.hitWrapper}>
        <ul className={styles.hitList}>
          {hits.map((hit: any) => (
            <li>
              <a
                href={hit.url}
                className={clsx(styles.hit, hitClassName)}
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.title.value,
                }}
              ></a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const getIndexName = () => {
    if (typeof window === "undefined") return
    const host = window.location.hostname
    if (host === "docs.chain.link") return CONFIG.ALGOLIA.productionIndexName
    return CONFIG.ALGOLIA.testIndexName
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} modalId={styles.searchModal}>
      <InstantSearch indexName={getIndexName()} searchClient={searchClient}>
        <SearchInput onClose={onClose} />
        {/* <hr className={styles.footerSeparator} /> */}
        <div className={styles.resultsWrapper}>
          <EmptyQueryBoundary fallback={null}>
            <NoResultsBoundary>
              <div className={styles.queryResults}>
                <CustomHits
                  title="Title Matches"
                  escapeHTML={false}
                  transformItems={(items) => {
                    return items.filter(
                      (item) =>
                        // @ts-expect-error title is not an array
                        item._highlightResult.title.matchLevel !== "none"
                    )
                  }}
                  hitClassName="title-match-hit"
                />
                <CustomHits
                  title="Content Matches"
                  hitClassName="content-match-hit"
                />
              </div>
            </NoResultsBoundary>
          </EmptyQueryBoundary>
        </div>
      </InstantSearch>
    </Modal>
  )
}
