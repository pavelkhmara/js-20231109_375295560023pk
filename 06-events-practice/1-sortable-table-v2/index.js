import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js'

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig = [], {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data)

    this.headersConfig = headersConfig
    this.data = data
    this.sorted = sorted.id ? sorted : { id: this.headerConfig.find(item => item.sortable).id, order: 'asc' }
    this.isSortLocally = true

    super.sort(this.sorted.id, this.sorted.order)

    this.addHeaderListener(this.element)
  }
  
  headerClickHandler = (event) => {
    let headerCell = event.target.closest('.sortable-table__cell')

    const columnId = headerCell.getAttribute('data-id')
    const columnSortable = this.headerConfig.find(item => item.id === columnId).sortable

    if (!columnSortable) return

    this.sorted.id = columnId
    this.sorted.order = this.getCellOrder(headerCell)

    this.sort()
  }

  getCellOrder(cell) {
    if (!cell.getAttribute('data-order')) return 'desc'
    if (cell.getAttribute('data-order') === 'asc') return 'desc'

    return 'asc'
  }

  addHeaderListener(element) {
    element.querySelector('.sortable-table__header').addEventListener('pointerdown', this.headerClickHandler)
  }

  sort () {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient() {
    super.sort(this.sorted.id, this.sorted.order)
  }

  destroy() {
    this.element.removeEventListener('pointerdown', this.headerClickHandler)
    super.destroy()
  }
}
