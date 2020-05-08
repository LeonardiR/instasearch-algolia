(function( $ ) {
    'use strict';

    /** Utility Functions */

    function getTemplate (templateName) {
        return document.querySelector('#' + templateName + '-template').innerHTML;
    }

    /** Search Class */

    var s, _this,
    Search = {
        settings: {
            searchClient: algoliasearch('WI4G3IOEA5', '1db3a3bcbfde7f48c3d5f5bc632776c9'),
            options : {indexName: 'pre_SIGOV_ACORDS'}
        },

        dateRangeCustomWidget: function (){
            var startDate,
                endDate;
            var customRangeDate = instantsearch.connectors.connectRange(function (renderOptions, isFirstRender) {
                if (!isFirstRender) return;
                var refine  = renderOptions.refine,
                    $from = $( "#from" ),
                    $to = $( "#to" ),
                    $refresh = $( "#refresh" ),
                    dateFormat = "dd/mm/yy",
                    from = $from.datepicker({
                            changeMonth: true,
                            changeYear: true,
                            numberOfMonths: 1,
                            prevText: '< Ant',
                            nextText: 'Sig >',
                            monthNames: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
                            monthNamesShort: ['gen','febr','març','abr', 'maig','juny','jul','ag','set', 'oct','nov','des'],
                            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                            dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
                            dayNamesMin: ['Dg','Dl','Dm','Dc','Dj','Dv','Ds'],
                            weekHeader: 'Sm',
                            dateFormat: 'dd/mm/yy',
                            firstDay: 1,
                            isRTL: false,
                            showMonthAfterYear: false,
                            yearSuffix: ''
                        }).on( "change", function() {
                            $from.css("border", "1px solid #ddd");
                            $to.css("border", "1px solid #ddd");
                            to.datepicker( "option", "minDate", getDate( this ));
                            startDate = getDate( this )/1000;
                            if(startDate && endDate){
                                refine([startDate, endDate]);
                            } else {
                                refine([]);
                            }
                            if(!startDate && $from.val()){
                                $from.css("border", "2px solid #C00000");
                            }
                            if(!($refresh.hasClass( "active" )) && $from.val()){
                                $refresh.addClass( "active" );
                            }
                            if(!$to.val() && !$from.val()){
                                $refresh.removeClass( "active" );
                            }
                        }),
                    to = $to.datepicker({
                        changeMonth: true,
                        changeYear: true,
                        numberOfMonths: 1,
                        closeText: 'Cerrar',
                        prevText: '< Ant',
                        nextText: 'Sig >',
                        currentText: 'Hoy',
                        monthNames: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
                        monthNamesShort: ['gen','febr','març','abr', 'maig','juny','jul','ag','set', 'oct','nov','des'],
                        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
                        dayNamesMin: ['Dg','Dl','Dm','Dc','Dj','Dv','Ds'],
                        weekHeader: 'Sm',
                        dateFormat: 'dd/mm/yy',
                        firstDay: 1,
                        isRTL: false,
                        showMonthAfterYear: false,
                        yearSuffix: ''
                    }).on( "change", function() {
                        $to.css("border", "1px solid #ddd");
                        $from.css("border", "1px solid #ddd");
                        from.datepicker( "option", "maxDate", getDate( this ));
                        endDate = getDate( this )/1000;
                        if(startDate && endDate){
                            refine([startDate, endDate]);
                        } else {
                            refine([]);
                        }
                        if(!endDate && $to.val()){
                            $to.css("border", "2px solid #C00000");
                        }
                        if(!($refresh.hasClass( "active" )) && $to.val()){
                            $refresh.addClass( "active" );
                        }
                        if(!$to.val() && !$from.val()){
                            $refresh.removeClass( "active" );
                        }
                    });

                    $refresh.click(function () {
                        refreshCalendar();
                    });

                    function getDate( element ) {
                        var date;
                        try {
                            date = $.datepicker.parseDate( dateFormat, element.value );
                        } catch( error ) {
                            date = null;
                        }
                        return date;
                    }

                    function refreshCalendar () {
                        $to.css("border", "2px solid #ddd");
                        $from.css("border", "2px solid #ddd");
                        to.datepicker( "option", "minDate", null);
                        to.datepicker('setDate', null);
                        from.datepicker( "option", "maxDate", null);
                        from.datepicker('setDate', null);
                        $refresh.removeClass( "active" );
                        startDate = null;
                        endDate = null;
                        refine([]);
                    }
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

            /*var refinementListWithPanelDocument = instantsearch.widgets.panel({
                templates: {
                    header: '<strong><span>Document</span></strong>',
                },
                hidden: function(options) {
                    return options.results.nbHits === 0;
                },
            })(instantsearch.widgets.refinementList);*/

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
                            if(items[i].document2 || items[i].document3 ||
                               items[i].document4 || items[i].document5) {
                                items[i].otherDocuments = 'Altres Documents';
                            }
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
                /*refinementListWithPanelDocument({
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
                })*/
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
})(jQuery);










