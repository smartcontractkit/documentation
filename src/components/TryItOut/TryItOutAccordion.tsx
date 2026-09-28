import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Typography } from "@chainlink/blocks"
import { activeAccordionIndex } from "~/stores/tryItOutStore.ts"
import styles from "./styles.module.css"

interface AccordionTab {
  title: string
  text: string
  codeSampleSrc: string
}

interface TryItOutAccordionProps {
  tabs: AccordionTab[]
}

export const TryItOutAccordion = ({ tabs }: TryItOutAccordionProps) => {
  const handleValueChange = (value: string) => {
    if (value) {
      activeAccordionIndex.set(parseInt(value, 10))
    }
  }

  return (
    <Accordion collapsible type="single" defaultValue="0" onValueChange={handleValueChange}>
      {tabs.map((tab, idx) => (
        <AccordionItem key={idx} value={String(idx)} className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            {tab.title}{" "}
            <Typography variant="code" className={styles.indicator}>
              0{idx + 1}
            </Typography>
          </AccordionTrigger>
          <AccordionContent className={styles.text}>{tab.text}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
