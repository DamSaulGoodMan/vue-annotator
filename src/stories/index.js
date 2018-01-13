/* eslint-disable react/react-in-jsx-scope */

import { storiesOf } from '@storybook/vue'
import { storyOrder, scenarioOrder } from './config.js'

// import { withNotes } from '@storybook/addon-notes'
// import { withDocs } from 'storybook-readme'

import { action } from '@storybook/addon-actions'

const orderedFile = require.context('.', true, /\.vue$/).keys()
  .sort((a, b) => { // sort by storyOrder
    a = a.split('/').map(s => s.replace('.vue', ''))
    b = b.split('/').map(s => s.replace('.vue', ''))

    if (isNaN(storyOrder)) var order = storyOrder.indexOf(a[1]) - storyOrder.indexOf(b[1])
    else order = a[1].charAt(0).toUpperCase() - b[1].charAt(0).toUpperCase() // sort alphabetically

    if (order === 0) {
      if (!isNaN(scenarioOrder[a[1]]) || !scenarioOrder[a[1]]) { // sort alphabetically
        a = a[a.length - 1].charAt(0).toUpperCase()
        b = b[b.length - 1].charAt(0).toUpperCase()
        order = a < b ? -1 : a > b ? 1 : 0
      } else {
        const aOrder = scenarioOrder[a[1]].indexOf(a[a.length - 1])
        const bOrder = scenarioOrder[b[1]].indexOf(b[b.length - 1])
        order = (aOrder < 0 ? scenarioOrder[a[1]].length : aOrder) - (bOrder < 0 ? scenarioOrder[b[1]].length : bOrder)
      }
    }

    return order
  })

orderedFile.forEach((filename) => {
  const hierarchy = filename.split('/')
  const basename = hierarchy[hierarchy.length - 1]
  if (/.vue$/.test(basename)) {
    let componentName = hierarchy.length > 2 ? basename.replace('.vue', '') : 'Introduction'
    let storyName = hierarchy.length > 2 ? hierarchy[hierarchy.length - 2] : basename.replace('.vue', '')

    const Stories = storiesOf(storyName, module)
    const Component = require(`${filename}`).default

    const story = () => {
      let eventCounter = 0
      return {
        render () {
          return <story onAction={action(`action ${++eventCounter}`)} />
        },
        components: {
          'story': Component
        }
      }
    }

    /** CHAIN THE CUSTOM BLOCK WITH THE storybook-addon HERE */
    let storyWithAddons = story
    // storyWithAddons = withNotes(Component.__notes || '')(storyWithAddons)
    // storyWithAddons = withDocs(Component.__docs || '', storyWithAddons) // WIP: https://github.com/tuchk4/storybook-readme/issues/37
    Stories.add(componentName, storyWithAddons)
  }
})

/* eslint-enable react/react-in-jsx-scope */
