import LucideIcons from './lucide'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownHeader,
  DropdownFooter,
  DropdownDivider
} from './dropdown'

export default (app) => {
  app.component('Dropdown', Dropdown)
  app.component('DropdownToggle', DropdownToggle)
  app.component('DropdownMenu', DropdownMenu)
  app.component('DropdownContent', DropdownContent)
  app.component('DropdownItem', DropdownItem)
  app.component('DropdownHeader', DropdownHeader)
  app.component('DropdownFooter', DropdownFooter)
  app.component('DropdownDivider', DropdownDivider)

  for (const [key, icon] of Object.entries(LucideIcons)) {
    app.component(key, icon)
  }
}
