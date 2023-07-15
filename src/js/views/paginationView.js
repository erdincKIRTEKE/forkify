import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _errorMessage = 'No recipe found for yor query Please try again';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1 and other pages

    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton(currentPage + 1, 'next');
    }
    // last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton(currentPage - 1, 'prev');
    }
    // other page
    if (currentPage < numPages) {
      return `
      ${this._generateMarkupButton(currentPage - 1, 'prev')}
      ${this._generateMarkupButton(currentPage + 1, 'next')}
    `;
    }
    // page 1 and no others
    return '';
  }

  _generateMarkupButton(page, direction) {
    return `
    <button data-goto="${page}" class="btn--inline pagination__btn--${direction}">
      ${
        direction === 'prev'
          ? `<svg class="search__icon">
              <use href="${icons} #icon-arrow-left"></use>
            </svg>`
          : ''
      }
      <span>Page ${page}</span>
      ${
        direction === 'next'
          ? `<svg class="search__icon">
              <use href="${icons} #icon-arrow-right"></use>
            </svg>`
          : ''
      }
    </button>
  `;
  }
}

export default new PaginationView();
