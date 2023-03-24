import LucideIcons from './lucide'
import { Modal, ModalHeader, ModalBody, ModalFooter } from './modal'
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
  app.component('Modal', Modal)
  app.component('ModalHeader', ModalHeader)
  app.component('ModalBody', ModalBody)
  app.component('ModalFooter', ModalFooter)
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
