define("UsrAdUnits1Page", [], function() {
	return {
		entitySchemaName: "UsrAdUnits",
		attributes: {
			// Количество активных  ежечасных рекламных блоков.
			"CountActiveHourlyAdUnits": {
				"dataValueType": Terrasoft.DataValueType.INTEGER,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			// Системная настройка, ограничивающая количество активных ежечасных рекламных блоков. 
			"MaxCountActiveHourlyAdUnits": {
				"dataValueType": Terrasoft.DataValueType.INTEGER,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrAdUnitsFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrAdUnits"
				}
			},
			"UsrSchemae5cb3e04Detail59d8467a": {
				"schemaName": "UsrSchemae5cb3e04Detail",
				"entitySchemaName": "UsrIssues",
				"filter": {
					"detailColumn": "UsrUsrAdUnits",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrOwner": {
				"53039be4-d51c-48e9-a1d6-3966986f30bc": {
					"uId": "53039be4-d51c-48e9-a1d6-3966986f30bc",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "Type",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "60733efc-f36b-1410-a883-16d83cab0980",
					"dataValueType": 10
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			 onEntityInitialized: function(){
				
                this.callParent(arguments);
                this.getCountActiveHourlyAdUnits();
                this.getSysSettingCountActiveHourlyAdUnits();
            },
			
			// Получение количества активных ежечасных рекламных блоков.
			getCountActiveHourlyAdUnits: function(){
				var periodicity = "Ежечасно";
                var esqPeriodicity = this.Ext.create("Terrasoft.EntitySchemaQuery", {
                    rootSchemaName: "UsrAdUnits"
                });
				
				esqPeriodicity.addColumn("UsrName");
                var groupFilters = this.Ext.create("Terrasoft.FilterGroup");
                var filterPerodicity = this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL, "UsrPeriodicity.Name", periodicity);
                var thisId = this.get("Id");
                var filterId = this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.NOT_EQUAL, "Id", thisId);
                var filterIsActive = this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL, "UsrIsActive", true);
				
				groupFilters.addItem(filterPerodicity);
                groupFilters.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
                groupFilters.addItem(filterIsActive);
                groupFilters.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
                groupFilters.addItem(filterId);
                esqPeriodicity.filters.add(groupFilters);
                esqPeriodicity.getEntityCollection(function(result) {
                    if (!result.success) {
                        this.showInformationDialog("Request error");
                        return;
                    }
                    else {
                        var lengthCollection = result.collection.collection.length;
                        this.set("CountActiveHourlyAdUnits", lengthCollection);
                    }
                }, this);
			},
			// Добавляет валидацию к полю "Периодичность". При изменении данного поля либо сохранении записи будет вызываться метод-валидатор.
            setValidationConfig: function() {
                this.callParent(arguments);
                this.addColumnValidator("UsrPeriodicity", this.periodicityValidator);
            },
            // Метод-валидатор — если секция ежечасная, сравнивает текущее количество активных ежечасных рекламных блоков с системной настройкой "UsrSMaxNumberOfActiveHourlyIssues" и в случае превышения добавляет в поле "Периодичность" предупреждающее сообщение. Сохранение записи в таком случае невозможно.
            periodicityValidator: function() {
                var invalidMessage= "";
				
                var periodicity = this.get("UsrPeriodicity").displayValue;
                if (periodicity==="Ежечасно") {
                    var isActive = this.get("UsrIsActive");
                    var myVariable = this.get("MaxCountActiveHourlyAdUnits");
                    var lengthCollection = this.get("CountActiveHourlyAdUnits");
                    if (lengthCollection >= myVariable && isActive) {
                        invalidMessage = "Допускается не более " + myVariable + " активных ежечасных рекламных блоков.";
                    }
                }
                else {
                    invalidMessage = "";
                }
                return {
                    invalidMessage: invalidMessage
                };
            },
			
            // Получает значение системной настройки "UsrSMaxNumberOfActiveHourlyIssues".
			getSysSettingCountActiveHourlyAdUnits: function(){
				var myVariable;
                var callback = function(value) {
                    myVariable = value;
                };
                this.Terrasoft.SysSettings.querySysSettingsItem("UsrSMaxNumberOfActiveHourlyIssues", callback, this);
                if (myVariable === undefined) {
                    return;
                }
                else {
                    this.set("MaxCountActiveHourlyAdUnits", myVariable);
                }
			},
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName1794e132-1d30-43b3-b08a-acab2269ddb5",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "STRING38123284-d439-4431-a8b3-b613cc7166ed",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCode",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUPdde893ca-9406-4a96-9679-46067ebea182",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPeriodicity",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUPc9bd8034-f9cb-4f81-9ee8-6d95be6bdf81",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrOwner",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "STRING6407c824-c995-4635-b2d1-ab20dd4aecec",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrComment",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "BOOLEAN2332e0dd-dc9d-4e87-99b1-25f3681f0a4c",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 5,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrIsActive",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchemae5cb3e04Detail59d8467a",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 1
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
