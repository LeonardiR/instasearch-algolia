import {Service} from './service';
(function () {
    'use strict';
    var s,
    Search = {
        settings: {
            searchClient: algoliasearch('2RGQIXQAQ7', 'cf8ee0237b646e5eb579182451b740c8'),
            options : {indexName: 'pre_ACORDS_DEL_GOVERN'}
        },

        getTemplate: function(templateName) {
            return document.querySelector('#' + templateName + '-template').innerHTML;
        },

        addSearchWidgets: function() {
            s.options.searchClient = s.searchClient;
            var search = instantsearch(s.options);

            var refinementListWithPanelAny = instantsearch.widgets.panel({
                templates: {
                    header: '<strong><span>Any</span></strong>',
                },
                hidden: function(options) {
                    return options.results.nbHits === 0;
                },
            })(instantsearch.widgets.refinementList);
            var refinementListWithPanelDepartament = instantsearch.widgets.panel({
                templates: {
                    header: '<strong><span>Departament</span></strong>',
                },
                hidden: function(options) {
                    return options.results.nbHits === 0;
                },
            })(instantsearch.widgets.refinementList);
            var refinementListWithPanelDocument = instantsearch.widgets.panel({
                templates: {
                    header: '<strong><span>Document</span></strong>',
                },
                hidden: function(options) {
                    return options.results.nbHits === 0;
                },
            })(instantsearch.widgets.refinementList);


            search.addWidgets([
                instantsearch.widgets.searchBox({
                    container: '#search-input',
                    placeholder: 'Cerca traspàs...'
                }),
                instantsearch.widgets.stats({
                    container: '#stats',
                    templates: {
                        text: this.getTemplate('stats'),
                    },
                    transformData: function (item) {
                        item.nbHits = new Intl.NumberFormat('ca-ES').format(item.nbHits);
                        return item;
                    }
                }),
                instantsearch.widgets.hits({
                    container: '#hits',
                    hitsPerPage: 20,
                    templates: {
                        item: this.getTemplate('hit'),
                        empty: this.getTemplate('no-results'),
                    },
                }),
                instantsearch.widgets.pagination({
                    container: '#pagination',
                    autoHideContainer: true,
                    scrollTo: '#search-input',
                    showFirstLast: true,
                    templates: {
                        previous: "anterior",
                        next: "següent",
                    },
                }),
                refinementListWithPanelAny({
                    container: '#any .search__content-filers',
                    attribute: 'Any',
                    autoHideContainer: true,
                    limit: 100,
                    operator: 'or',
                    sortBy: ['name:asc'],
                    templates: {
                        item: this.getTemplate('refinement'),
                    }
                }),
                refinementListWithPanelDepartament({
                    container: '#departament .search__content-filers',
                    attribute: 'Departament',
                    autoHideContainer: true,
                    limit: 100,
                    operator: 'or',
                    sortBy: ['name:asc'],
                    templates: {
                        item: this.getTemplate('refinement'),
                    },
                }),
                refinementListWithPanelDocument({
                    container: '#document .search__content-filers',
                    attribute: 'Tipus_document',
                    autoHideContainer: true,
                    limit: 100,
                    operator: 'or',
                    sortBy: ['name:asc'],
                    templates: {
                        item: this.getTemplate('refinement'),
                    },
                })
            ]);
            search.start();
        },

        init: function() {
            s = this.settings;
            this.addSearchWidgets();
        },

    };
    Search.init();
    var service = new Service();
    service.getData().then(data=>{
        console.log(data);
    });
})();
