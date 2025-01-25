export interface SubStep {
  id: string
  title: string
  completed: boolean
}

export interface StepProgress {
  setup: {
    prerequisites: SubStep[]
    chainSelection: SubStep[]
  }
  sourceChain: {
    deployment: SubStep[]
    adminSetup: SubStep[]
  }
  // ... rest of the interface
}
