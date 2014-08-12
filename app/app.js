var app = angular.module("nxGrid", [])

    .controller("nxGridCtrl", function($scope, loadData)
    {
        $scope.nxGrid = {
            define:[
                { class:"coluna0", field:"cod_sap", title:"cod sap" },
                { class:"coluna1", field:"deptoId", title:"depto" },
                { class:"coluna2", field:"descricao_item", title:"descrição" }
            ],
            data:loadData.getItem(function(d){ $scope.nxGrid.data = d.filter(function(d){ return d.status == "A"; }); })
        };

        window.scope = $scope;
    })

    .directive('nxGrid', function ($compile)
    {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs)
            {
                var nxGrid              = document.createElement("ul"),
                    nxGridTop           = document.createElement("li"),
                    nxGridTopLine       = document.createElement("ul"),
                    nxGridTopColumn     = document.createElement("li"),
                    nxGridTopColumnCont = document.createTextNode("{{ nxH.title }}"),
                    columnTotal         = scope.nxGrid.define.length,
                    columnArr           = [],
                    nxGridIn            = document.createElement("li"),
                    nxGridInLine        = document.createElement("ul"),
                    nxGridInColumnTotal = scope.nxGrid.define.length,
                    count               = 0;

                /** HEADER attribute **/
                nxGridTopColumn.setAttribute("ng-repeat", "nxH in nxGrid.define");
                nxGridTopColumn.setAttribute("class", "{{ nxH.class }}");
                nxGridTop.setAttribute("class", "nx-GridTop");
                nxGrid.setAttribute("class", "nx-Grid");

                /** HEADER element closure **/
                nxGridTopColumn.appendChild(nxGridTopColumnCont);
                nxGridTopLine.appendChild(nxGridTopColumn);
                nxGridTop.appendChild(nxGridTopLine);
                nxGrid.appendChild(nxGridTop);

                /** CONTENT define field and width to column **/
                while(columnTotal--){ columnArr.push({ field:scope.nxGrid.define[columnTotal].field, class:scope.nxGrid.define[columnTotal].class }); }

                /** CONTENT attribute **/
                nxGridInLine.setAttribute("ng-repeat", "nxC in nxGrid.data");
                nxGridIn.setAttribute("class", "nx-GridIn");

                /** CONTENT steps to create line **/
                while(nxGridInColumnTotal--)
                {
                    var nxGridInColumn      = document.createElement("li"),
                        nxGridInColumnCont  = document.createTextNode("{{ nxC." + columnArr[nxGridInColumnTotal].field + " }}");

                    nxGridInColumn.setAttribute("class", columnArr[nxGridInColumnTotal].class);
                    nxGridInColumn.appendChild(nxGridInColumnCont);
                    nxGridInLine.appendChild(nxGridInColumn);
                }

                /** CONTENT element closure **/
                nxGridIn.appendChild(nxGridInLine);
                nxGrid.appendChild(nxGridIn);

                element.append(nxGrid);
                
                $compile(element.contents())(scope);
            }
        };
    })

    .factory("loadData", function($http)
    {
        return {
            getItem:function(callback)
            {
                $http({ method:"GET", url:"http://localhost/web/nxGrid/itens_3.json" }).success(callback);
            }
        }
    });