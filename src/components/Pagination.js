import { Component, tags, router, hooks, useState } from "@odoo/owl";
const { useGetters, onWillUpdateProps, onWillStart } = hooks;
const Link = router.Link;

const PAGINATION_TEMPLATE = tags.xml/*xml*/ `
<nav>
    <ul class="pagination">
        <t t-foreach="getPagination()" t-as="pageNumber">
            <li t-attf-class="page-item {{ pageNumber == state.currentPage ? 'active' : ''}}">
                <a class="page-link" href="" t-on-click.prevent="triggerPageChange(pageNumber)"><t t-esc="pageNumber"/></a>
            </li>
        </t>
    </ul>
</nav>
`;
function useLoader() {
  const component = Component.current;
  const state = useState({
    currentPage: 1,
  });
  function calculateCurrentPage(props) {
    let currentPage = props.currentOffset / props.itemsPerPage + 1;
    Object.assign(state, { currentPage: currentPage });
  }
  onWillStart(() => {
    calculateCurrentPage(component.props);
  });
  onWillUpdateProps((nextProps) => {
    calculateCurrentPage(nextProps);
  });
  return state;
}
export class Pagination extends Component {
  static template = PAGINATION_TEMPLATE;
  static components = { Link };
  getters = useGetters();
  state = useLoader();
  static props = {
    totalCount: { type: Number },
    currentOffset: { type: Number },
    itemsPerPage: { type: Number },
  };
  triggerPageChange(pageNumber) {
    if (pageNumber == "...") {
      return;
    }
    Object.assign(this.state, { currentPage: pageNumber });
    let offset = pageNumber * this.props.itemsPerPage - this.props.itemsPerPage;
    this.trigger("update-offset", {
      offset: offset,
    });
  }
  getPagination() {
    console.log("test");
    let m = parseInt(this.props.totalCount / this.props.itemsPerPage);
    let c = this.state.currentPage;
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
