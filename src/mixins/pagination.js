export const pagination = {
  data() {
    return {
      elementsOnPage: 5,
      currentPage: 1,
    };
  },
  computed: {
    getData() {
      return [];
    },
    amountElements() {
      return this.getData.length;
    },
    elements() {
      return this.getData;
    },
    getAmountPages() {
      if (this.amountElements === 0) {
        return 0;
      }

      return Math.ceil(this.amountElements / this.elementsOnPage);
    },
    getPaginationData() {
      const end = this.currentPage * this.elementsOnPage;

      const start = end - this.elementsOnPage;

      return this.elements.slice(start, end);
    },
    checkPrevPage() {
      return this.currentPage === 1;
    },
    checkNextPage() {
      return this.currentPage === this.getAmountPages;
    },
  },
  methods: {
    prevPage() {
      this.currentPage--;
    },
    nextPage() {
      this.currentPage++;
    },
  },
};
