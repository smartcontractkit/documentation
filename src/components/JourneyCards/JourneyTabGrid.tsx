import styles from "./JourneyTabGrid.module.css"
import { Tabs, TabsContent, TabsList, TabsTrigger, Typography, Tag } from "@chainlink/blocks"

export interface JourneyItem {
  title: string
  description: string
  link: string
  badge?: string
}

export interface JourneyTab {
  name: string
  items: JourneyItem[]
}

interface JourneyTabGridProps {
  tabs: JourneyTab[]
  header: string
}

export const JourneyTabGrid = ({ tabs, header }: JourneyTabGridProps) => {
  return (
    <Tabs defaultValue={tabs[0].name} className={styles.tabGridWrapper}>
      <header className={styles.gridHeader}>
        <Typography
          variant="h2"
          style={{
            fontSize: "32px",
          }}
        >
          {header}
        </Typography>
        <TabsList className={styles.tabsList}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name} className={styles.tabsTrigger}>
              <h3 className={styles.tabTitle}>{tab.name}</h3>
            </TabsTrigger>
          ))}
        </TabsList>
      </header>

      {tabs.map((tab) => (
        <TabsContent key={tab.name} value={tab.name}>
          <div className={styles.gridContent}>
            <div className={styles.journeyGrid}>
              {tab.items.map((item, index) => (
                <a key={`${item.title}-${index}`} href={item.link} className={styles.journeyCard}>
                  <div className={styles.cardContent}>
                    <Typography variant="body-semi">{item.title}</Typography>
                    <Typography variant="body-s" color="muted">
                      {item.description}
                    </Typography>
                  </div>

                  <footer className={styles.journeyFooter}>
                    {item.badge && (
                      <Tag size="sm" className={styles.footerTag}>
                        <Typography variant="code-s">{item.badge}</Typography>
                      </Tag>
                    )}
                    <img src="/assets/icons/upper-right-arrow.svg" className={styles.footerIcon} alt="" />
                  </footer>
                </a>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
