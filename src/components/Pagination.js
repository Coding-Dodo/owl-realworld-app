import { Component, tags } from "@odoo/owl";

const PAGINATION_TEMPLATE = tags.xml/*xml*/ `
<nav>
    <ul class="pagination" t-if="showPagination()">
        <t t-foreach="getPagination()" t-as="pageNumber">
            <li t-attf-class="page-item {{ pageNumber == getCurrentPage() ? 'active' : ''}}">
                <a class="page-link" href="" t-on-click.prevent="triggerPageChange(pageNumber)"><t t-esc="pageNumber"/></a>
            </li>
        </t>
    </ul>
</nav>
`;
export class Pagination extends Component {
  static template = PAGINATION_TEMPLATE;
  static props = {
    totalCount: { type: Number },
    currentOffset: { type: Number },
    itemsPerPage: { type: Number },
  };
  showPagination() {
    return this.props.totalCount > this.props.itemsPerPage;
  }

  getCurrentPage() {
    return this.props.currentOffset / this.props.itemsPerPage + 1;
  }

  triggerPageChange(pageNumber) {
    if (pageNumber == "...") {
      return;
    }
    let offset = pageNumber * this.props.itemsPerPage - this.props.itemsPerPage;
    this.trigger("update-offset", {
      offset: offset,
    });
  }
  getPagination() {
    let m = parseInt(this.props.totalCount / this.props.itemsPerPage);
    let c = this.getCurrentPage();
    var delta = 2,
      range = [],
      rangeWithDots = [],
      l;
    range.push(1);
    for (let i = c - delta; i <= c + delta; i++) {
      if (i < m && i > 1) {
        range.push(i);
      }
    }
    range.push(m);
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }
}
