import {Service} from './service';
(function () {
    'use strict';
    var s, _this,
    Search = {
        settings: {
            searchClient: algoliasearch('2RGQIXQAQ7', 'cf8ee0237b646e5eb579182451b740c8'),
            options : {indexName: 'pre_ACORDS_DEL_GOVERN'}
        },

        getTemplate: function(templateName) {
            return document.querySelector('#' + templateName + '-template').innerHTML;
        },

        stringToDate: function(date, format, delimiter) {
            var formatLowerCase= format.toLowerCase(),
                formatItems= formatLowerCase.split(delimiter),
                dateItems = date.split(delimiter),
                monthIndex= formatItems.indexOf("mm"),
                dayIndex= formatItems.indexOf("dd"),
                yearIndex= formatItems.indexOf("yyyy"),
                month= parseInt(dateItems[monthIndex]);
                month-=1;
            return new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        },

        addSearchWidgets: function() {
            s.options.searchClient = s.searchClient;
            var search = instantsearch(s.options);

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

            var customRangeDate = instantsearch.connectors.connectRange(function (renderOptions, isFirstRender) {
                if (!isFirstRender) return;
                 var refine  = renderOptions.refine,
                     inputStart = document.getElementById('startDate'),
                     inputEnd =  document.getElementById('endDate');
                inputStart.addEventListener('change', function(event) {
                    refine([event.currentTarget.value]);
                });
                inputEnd.addEventListener('change', function(event) {
                    refine([event.currentTarget.value]);
                });
                new TinyPicker({
                    firstBox: document.getElementById('startDate'),
                    lastBox: document.getElementById('endDate'),
                    allowPast: true,
                    months: 1,
                    days: ['Dg','Dl','Dm','Dc','Dj','Dv','Ds'],
                    overrideClass: 'datepicker',
                    local: 'ca-ES',
                    success: function(startDate, endDate){
                        const start = new Date(startDate)/1000;
                        const end = new Date(endDate)/1000;
                        refine([start, end]);
                    },
                    err: function(){}
                }).init();
            });

            search.addWidgets([
                instantsearch.widgets.searchBox({
                    container: '#search-input',
                    placeholder: 'Cerca acor...'
                }),
                instantsearch.widgets.stats({
                    container: '#stats',
                    templates: {
                        text: _this.getTemplate('stats'),
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
                        item: _this.getTemplate('hit'),
                        empty: _this.getTemplate('no-results'),
                    },
                    transformItems: function (items) {
                        var index = s.searchClient.initIndex(s.options.indexName);
                        if( items.length > 0 && !items[0].timeStamp){
                            for(var i=0; items.length >i; i++){
                                items[i].timeStamp = _this.stringToDate(items[i].Data,"dd/MM/yyyy","/")/1000;
                            }
                            index.clearObjects();
                            index.saveObjects(items, { autoGenerateObjectIDIfNotExist: true });
                            return items;
                        }else{
                            return items;
                        }
                    }
                }),
                customRangeDate({
                    container: document.querySelector('#date-range'),
                    attribute: 'timeStamp',
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
                refinementListWithPanelDepartament({
                    container: '#departament .search__content-filers',
                    attribute: 'Departament',
                    autoHideContainer: true,
                    limit: 100,
                    operator: 'or',
                    sortBy: ['name:asc'],
                    templates: {
                        item: _this.getTemplate('refinement'),
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
                        item: _this.getTemplate('refinement'),
                    },
                })
            ]);
            search.start();
        },

        init: function() {
            s = this.settings;
            _this = this;
            this.addSearchWidgets();
        },

    };
    Search.init();
    var service = new Service();
    service.getData().then(data=>{
        console.log(data);
    });
})();
