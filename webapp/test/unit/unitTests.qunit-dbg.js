/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZGBC_FLEET_CLEARK/ZGBC_FLEET_CLEARK/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});