import {Service} from './service';
(function () {
    'use strict';

    /** Utility Functions */

    function dateFormater (date, format, delimiter) {
        var formatLowerCase= format.toLowerCase(),
            formatItems= formatLowerCase.split(delimiter),
            dateItems = date.split(delimiter),
            monthIndex= formatItems.indexOf("mm"),
            dayIndex= formatItems.indexOf("dd"),
            yearIndex= formatItems.indexOf("yyyy"),
            month= parseInt(dateItems[monthIndex]);
        month-=1;
        return new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    }

    function getMonthName (date) {
        var months = [
            'Gener',
            'Febrer',
            'Març',
            'Abril',
            'Maig',
            'Juny',
            'Juliol',
            'Agost',
            'Setembre',
            'Octubre',
            'Novembre',
            'Desembre'];
        return months[date.getMonth()];
    }

    function getTemplate (templateName) {
        return document.querySelector('#' + templateName + '-template').innerHTML;
    }

    /** Search Class */

    var s, _this,
    Search = {
        settings: {
            searchClient: algoliasearch('GAVVNU5N19', 'f612c10b31cc7d018b2f5bc35ee83413'),
            options : {indexName: 'pre_ACORDS_DEL_GOVERN'}
        },

        dateRangeCustomWidget: function (){
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
                    local: 'es-ES',
                    success: function(startDate, endDate){
                        const start = new Date(startDate)/1000;
                        const end = new Date(endDate)/1000;
                        refine([start, end]);
                    },
                    err: function(){}
                }).init();
            });
            return customRangeDate;
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

            var dateRangeCustomWidget = _this.dateRangeCustomWidget();

            search.addWidgets([
                instantsearch.widgets.searchBox({
                    container: '#search-input',
                    placeholder: 'Cerca...'
                }),
                instantsearch.widgets.stats({
                    container: '#stats',
                    templates: {
                        text: getTemplate('stats'),
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
                        item: getTemplate('hit'),
                        empty: getTemplate('no-results'),
                    },
                    transformItems: function (items) {
                        for(var i=0; items.length >i; i++){
                            items[i].monthName = getMonthName(dateFormater(items[i].data,"dd/MM/yyyy","/"));
                            items[i].dayNumber = dateFormater(items[i].data,"dd/MM/yyyy","/").getDate();
                            items[i].fullYear = dateFormater(items[i].data,"dd/MM/yyyy","/").getFullYear();
                        }
                        return items;
                    }
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
                dateRangeCustomWidget({
                    container: document.querySelector('#date-range'),
                    attribute: 'timeStamp',
                }),
                refinementListWithPanelDepartament({
                    container: '#department .search__content-filers',
                    attribute: 'departament',
                    autoHideContainer: true,
                    limit: 100,
                    operator: 'or',
                    sortBy: ['name:asc'],
                    templates: {
                        item: getTemplate('refinement'),
                    },
                    cssClasses: {
                        item: 'refinement__item',
                        selectedItem: 'refinement__item--selected',
                    },
                }),
                refinementListWithPanelDocument({
                    container: '#document .search__content-filers',
                    attribute: 'tipus_document',
                    autoHideContainer: true,
                    limit: 100,
                    operator: 'or',
                    sortBy: ['name:asc'],
                    templates: {
                        item: getTemplate('refinement'),
                    },
                    cssClasses: {
                        item: 'refinement__item',
                        selectedItem: 'refinement__item--selected',
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

