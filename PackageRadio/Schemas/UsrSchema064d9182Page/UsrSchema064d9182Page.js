define("UsrSchema064d9182Page", [], function() {
	return {
		entitySchemaName: "UsrIssues",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "DATETIMEfc6eefbd-ccdc-4c96-8e30-d0f8f27d3a39",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrDateIssues",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "STRINGc6f29c30-a2d4-49a8-aa38-ff2b2180ee17",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrPresenter",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "INTEGERb9db3cba-919e-497c-b913-da903e41d869",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "UsrDurationIssues",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUPbb5f7ca3-de56-4470-92df-4a28a0dd8b2f",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "UsrStatusIssue",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "UsrNamefeff90ab-eeba-40fe-a6c0-21ff8ad5333b",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrName"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "UsrUsrAdUnits1b3347b9-ddb2-4dc9-9405-572f90cca7d7",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrUsrAdUnits"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "Tab99734111TabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab99734111TabLabelTabCaption"
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
				"name": "Tab99734111TabLabelGroupa98e72ca",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab99734111TabLabelGroupa98e72caGroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "Tab99734111TabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tab99734111TabLabelGridLayout31e0f6e4",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "Tab99734111TabLabelGroupa98e72ca",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "INTEGERd0f10fb7-b1a2-4cbc-9b5a-0945022744de",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Tab99734111TabLabelGridLayout31e0f6e4"
					},
					"bindTo": "UsrCost",
					"enabled": true
				},
				"parentName": "Tab99734111TabLabelGridLayout31e0f6e4",
				"propertyName": "items",
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});
