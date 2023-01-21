<template>
  <div class="paginated-items">
    <div v-if="showFilter" class="filter-row">
      <Icon icon="filter" />
      <input
        v-model="filter"
        type="text"
        placeholder="Type to filter"
        class="search-filter"
        @change="resetPageNumber()"
        @keydown="resetPageNumber()"
      >
      <span class="hide-on-small-screen">Found {{ filteredItems(items).length }} {{ itemTypePlural }} {{ filter ? `containing "${filter}"` : '' }}</span>
    </div>
    <div v-if="items && filteredItems(items).length > 0" class="paginated-content">
      <div v-if="isPaginated(items) && paginatedTop" class="pagination-top">
        <span class="buttons">
          <fixed-button @click="previousPage" :disabled="pageNumber === 0">
            <a>
              <Icon icon="angle-left" />
              <label class="right">Prev Page</label>
            </a>
          </fixed-button>
          <fixed-button :disabled="true">
            <a>{{ pageNumber + 1 }} of {{ maxPages }}</a>
          </fixed-button>
          <fixed-button @click="nextPage" :disabled="pageNumber == maxPages - 1">
            <a>
              <label class="left">Next Page</label>
              <Icon icon="angle-right" />
            </a>
          </fixed-button>
        </span>
      </div>
      <slot :paginatedItems="paginatedItems">
        <pre>Please provide a template to render <b>paginatedItems</b></pre>
        <pre>{{ paginatedItems }}</pre>
      </slot>
      <div v-if="isPaginated(items) && paginatedBottom" class="pagination-bottom">
        <span class="buttons">
          <fixed-button @click="previousPage">
            <a>
              <Icon icon="angle-left" />
              <label class="right">Prev Page</label>
            </a>
          </fixed-button>
          <span class="pagination-numbers">{{ pageNumber + 1 }} of {{ maxPages }}</span>
          <fixed-button @click="nextPage">
            <a>
              <label class="left">Next Page</label>
              <Icon icon="angle-right" />
            </a>
          </fixed-button>
        </span>
      </div>
    </div>
    <div v-else>
      <p>No {{ itemTypePlural }} found containing "{{ filter }}".</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 20
    },
    itemTypePlural: {
      type: String,
      default: 'items'
    },
    paginatedTop: {
      type: Boolean,
      default: true
    },
    paginatedBottom: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filter: '',
      pageNumber: 0
    }
  },
  computed: {
    paginatedItems () {
      return this.displayedItems(this.items)
    },
    maxPages () {
      return Math.ceil(this.filteredItems(this.items).length / this.pageSize)
    }
  },
  methods: {
    displayedItems (items) {
      const startItem = this.pageNumber * this.pageSize
      const endItem = startItem + this.pageSize
      return this.filteredItems(items)
        .slice(startItem, endItem)
    },
    filteredItems (items) {
      const filterWord = (this.filter || '').toLowerCase()
      if (filterWord) {
        return items
          .filter(item => {
            return JSON.stringify(item).toLowerCase().includes(filterWord)
          })
      }
      return items || []
    },
    isPaginated (items) {
      const pagedItems = this.filteredItems(items)
      return pagedItems.length > this.pageSize
    },
    resetPageNumber () {
      this.pageNumber = 0
    },
    nextPage () {
      this.gotoPage(this.pageNumber + 1)
    },
    previousPage () {
      this.gotoPage(this.pageNumber - 1)
    },
    gotoPage (number) {
      number = Math.max(0, number)
      number = Math.min(number, this.maxPages - 1)
      this.pageNumber = number
    }
  }
}
</script>

<style scoped>
pre {
  color: white;
}
.paginated-items {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  margin: 0.5em auto;
}

.paginated-content {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5em 0;
}
input.search-filter {
  font-size: 0.9em;
  margin: 0 0.5em;
  padding: 0.3em;
  flex: 1 20;
}

.pagination-top {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 2px solid #eee;
}
.pagination-top > .buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.pagination-bottom {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 2px solid #eee;
}
.pagination-bottom > .buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.buttons > .fixed-button {
  margin: 0 0.1em;
  white-space: nowrap;
}

label.left {
  margin-left: 0.5em;
}
label.right {
  margin-right: 0.5em;
}
.pagination-numbers {
  min-width: 50px;
  text-align: center;
}
.pagination-size, .pagination-eop {
  font-size: 1.0em;
  color: #aaa;
}
@media (max-width: 719px) {
  .hide-on-small-screen {
    display: none;
  }
  .pagination-top, .pagination-bottom {
    justify-content: space-evenly;
  }
  .pagination-top > .buttons, .pagination-bottom > .buttons {
    flex: 1 10;
  }
  .pagination-numbers {
    flex: 1 10;
  }
  input.search-filter {
    margin: 0;
  }
}
</style>
