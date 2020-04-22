(function () {
    'use strict';
    var s,
    SearchDetail = {
        settings: {
            searchClient: algoliasearch('2RGQIXQAQ7', 'cf8ee0237b646e5eb579182451b740c8'),
            options : {indexName: 'pre_ACORDS_DEL_GOVERN'}
        },

        getTemplate: function(templateName) {
            return document.querySelector('#' + templateName + '-template').innerHTML;
        },

        getCurrentObject: function() {
            s.options.searchFunction = function (helper) {
                var code = window.location.hash;
                if (code && code.indexOf("#") > -1) {
                    code = code.slice(code.indexOf("#") + 1);
                }
                if (!code) {
                    return;
                }
                helper.state.query = code;
                helper.state.typoTolerance = false;
                helper.state.restrictSearchableAttributes = "Codi";
                helper.search();
            };
        },

        addSearchWidgets: function() {
            this.getCurrentObject();
            s.options.searchClient = s.searchClient;
            var search = instantsearch(s.options);

            search.addWidgets([
                instantsearch.widgets.hits({
                    container: '#hit',
                    hitsPerPage: 1,
                    templates: {
                        item: this.getTemplate('hit'),
                    },
                }),
            ]);

            search.start();
        },

        init: function() {
            s = this.settings;
            this.addSearchWidgets();
        },

    };
    SearchDetail.init();
})();
