# Feeds UI architecture

This folder powers the data feed address tables (`FeedList`, `Tables`) and shared filtering logic.

## Where to start

| File                               | Responsibility                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `components/FeedList.tsx`          | Page shell: chain selector, URL state, filters, renders `MainnetTable` / `TestnetTable` |
| `components/Tables.tsx`            | Row rendering (DefaultTr, SmartDataTr, StreamsTr) and table layout                      |
| `utils/feedVisibility.ts`          | **Source of truth** for whether a feed belongs on a given page                          |
| `utils/tableFilters.ts`            | Shared mainnet/testnet row pipeline (enrich → filter → search)                          |
| `utils/feedMetadata.ts`            | Schema version, category enrichment, search/category helpers                            |
| `utils/chainFilters.ts`            | Chain/network tag matching for dropdowns and section visibility                         |
| `types.ts`                         | `DataFeedType` and `getFeedTypeFlags()`                                                 |
| `hooks/useFilteredFeedMetadata.ts` | Hook used by both feed tables                                                           |

## Data flow

```
chains.ts (static config + RDD URLs)
    ↓
useGetChainMetadata → network.metadata[]
    ↓
useFilteredFeedMetadata / isFeedVisible
    ↓
MainnetTable / TestnetTable → DefaultTr / SmartDataTr / StreamsTr
```

## Common change patterns

**Add a new feed page type**

1. Add to `DataFeedType` in `types.ts`
2. Add visibility rules in `isFeedVisible()` (`feedVisibility.ts`)
3. Add chain tag mapping in `chainFilters.ts` if using tags
4. Wire filters in `FeedList.tsx` if needed

**Change which feeds appear on a page**
→ Edit `isFeedVisible()` only. Avoid duplicating logic in components.

**Hide a feed address (show contact email)**
→ `shouldHideAddress()` in `feedVisibility.ts`

**Risk category icons**
→ Supabase batch lookup via `useBatchedFeedCategories` + `enrichFeedWithCategory()` in `feedMetadata.ts`

## Known tech debt

- `chains.ts` tags duplicate what `isFeedVisible()` already knows from RDD metadata
- `FeedList.tsx` is still large (URL sync, stream-specific UI) — candidate for splitting into hooks
- `Tables.tsx` row components could move to `components/tableRows/` when touched next
