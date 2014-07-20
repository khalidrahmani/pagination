exports.module = function(pagination, util) {
	"use strict";
	var translationCache = {
		CURRENT_PAGE_REPORT : {}
	};
	var ItemPaginator = pagination.ItemPaginator = function(options) {
		pagination.Paginator.call(this, options);
		this.set('pageLinks', 1);
	};
	util.inherits(ItemPaginator, pagination.Paginator);
	ItemPaginator.prototype.renderCurrentPageReport = function(fromResult, toResult, totalResult) {
		var template;
		if(!this.options.translationCache) {
			return this.options.translator('CURRENT_PAGE_REPORT').replace('{FromResult}', fromResult).replace('{ToResult}', toResult).replace('{TotalResult}', totalResult);
		}
		if(!translationCache.CURRENT_PAGE_REPORT.hasOwnProperty(this.options.translationCacheKey)) {
			template = "return '" + (this.options.translator('CURRENT_PAGE_REPORT').replace("'", "\'").replace('{FromResult}', "' + fromResult + '").replace('{ToResult}', "' + toResult + '").replace('{TotalResult}', "' + totalResult + '")) + "';";
			translationCache.CURRENT_PAGE_REPORT[this.options.translationCacheKey] = new Function('fromResult, toResult, totalResult', template);
		}
		return translationCache.CURRENT_PAGE_REPORT[this.options.translationCacheKey](fromResult, toResult, totalResult);
	};
	ItemPaginator.prototype.render = function() {
		var result = this.getPaginationData();
		var prelink = this.preparePreLink(result.prelink);
		var html = '<ul class="paginator">';
		html += '<span class="paginator-current-report">';
		html += this.renderCurrentPageReport(result.fromResult, result.toResult, result.totalResult);
		html += '</span>';

		if(result.first) {
			html += '<li><a href="' + prelink + result.first + '>' + this.options.translator('FIRST') + '</a></li>';
		} else {
			html += '<span>' + this.options.translator('FIRST') + '</span>';
		}

		if(result.previous) {
			html += '<li><a href="' + prelink + result.previous + '>' + this.options.translator('PREVIOUS') + '</a></li>';
		} else {
			html += '<span>' + this.options.translator('PREVIOUS') + '</span>';
		}

		if(result.next) {
			html += '<li><a href="' + prelink + result.next + '>' + this.options.translator('NEXT') + '</a></li>';
		} else {
			html += '<span>' + this.options.translator('NEXT') + '</span> ';
		}

		if(result.last) {
			html += '<li><a href="' + prelink + result.last + '>' + this.options.translator('LAST') + '</a></li>';
		} else {
			html += '<span>' + this.options.translator('LAST') + '</span>';
		}
		html += '</ul>';
		return html;
	};
	pagination.registerFactory('item', ItemPaginator);
};
