/*global QUnit*/

sap.ui.define([
	"ZGBC_FLEET_CLEARK/ZGBC_FLEET_CLEARK/controller/View1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("View1 Controller");

	QUnit.test("I should test the View1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});