sap.ui.define(
	[
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/BindingMode",
    "sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState",
    "sap/m/MessageToast",
    "sap/ui/core/library"
   ], 
   
   function (Controller,JSONModel, BindingMode, Message, MessageType , ValueState , MessageToast, library) {
	"use strict";

	return Controller.extend("ZGBC_FLEET_CLEARK.ZGBC_FLEET_CLEARK.controller.View1", {
		
				            
		            				          Date :  {
		                                         	ArrivalDate : new Date()
	                      	                           },
	                      	                        
	onInit: function () {
		                    this.oInputDate =  new sap.ui.model.json.JSONModel(this.Date);
		                    this.getView().setModel(this.oInputDate,"InputDate");
		                    
		                }, //END OF ON INIT FUNCTION
		                
		                
                     onSubmit : function()
                     {
                         var oMessageManager,oView;
		                 oView = this.getView();
		                 oMessageManager = sap.ui.getCore().getMessageManager();
		                 oView.setModel(oMessageManager.getMessageModel(), "message");
		          
		            //Local model for showing the vehicle detials associated with the request
		            var oVehicleData = {
				            	         Vehicleid:"",
				            	         VehicleName:"",
				            	         VehicleNumber:"",
				            	         VehicleVendor:"",
				            	         Plant:"",
				            	         Location:"",
				            	         CostCenter:""
		                             };
		            this.oLocalVhModel =  new sap.ui.model.json.JSONModel(oVehicleData);
		            oView.setModel(this.oLocalVhModel,"localVhModel");
		            
		            
		              //Local model for showing the Plant Dropdown
		            var oPlantDD = {
				            	         Plants:[],
				            	         PlantSelected:null
		                             };
		            this.oPlantDD =  new sap.ui.model.json.JSONModel(oPlantDD);
		            oView.setModel(this.oPlantDD,"localPlantDD");
		            
		            //Local model for showing the Location Dropdown
		            var oLocDD = {				            	         
		            	                 Locations:[],
				            	         LocSelected:null
		                         };
		            this.oLocDD =  new sap.ui.model.json.JSONModel(oLocDD);
		            oView.setModel(this.oLocDD,"LocDD");
		            
		            
		            //Var Visibility..
		            var Visbility = {
				            	        SubmitVisibile : true
		                             };
		            this.oLocVisible =  new sap.ui.model.json.JSONModel(Visbility);
		            oView.setModel(this.oLocVisible,"Visibility");

		           
				     var oModel = oView.getModel();
				     var that = this;
				     var RequestId = this.getView().byId("idRequestid").getValue();
				     var sPath = "/FleetRequestHeaderSet('" +RequestId+ "')";
				               oModel.read(sPath,
							                      {
					                                urlParameters: {
					                               "$expand": "RequestHeaderToItemNav"
					                                               },
								                 	success: function(oData1, response1){
									                       	     var oModel3 = new sap.ui.model.json.JSONModel(oData1);
										                         var osf = that.getView().byId("IdEmpDetail");
										                         osf.setModel(oModel3);
						                                         //Get the selected vehicle details and show"
						                                         sPath = "/VehicleDetails2Set('" +RequestId+ "')";
						                                         oModel.read(sPath, {
						                        	                 success: function (oData2, response2){
								                        	                          that.oLocalVhModel.setProperty("/Vehicleid",oData2.VehicleId);
								                        	                          that.oLocalVhModel.setProperty("/VehicleName",oData2.VehicleText);
								                        	                          that.oLocalVhModel.setProperty("/VehicleVendor",oData2.VehicleVendor);
								                        	                          that.oLocalVhModel.setProperty("/VehicleNumber",oData2.VehicleNo);
								                        	                          that.oLocalVhModel.setProperty("/Plant",oData2.VehiclePlant);
								                        	                          that.oLocalVhModel.setProperty("/Location",oData2.VehicleLoc);
								                        	                          that.oLocalVhModel.setProperty("/CostCenter",oData2.VehicleCc);
								                        	                          
								                        	                          
								                        	                          //Once vehicle details found , fill the dropdown for plant selection
								                        	                           sPath = "/PlantDropDownSet";
								                        	                           var filter_string =  "RequestId eq '" +RequestId+ "'";
								                        	                           oModel.read(sPath,{
								                        	                           	                   urlParameters: {
																						                            "$filter" : filter_string
																													 }, 
					                     	                                           success: function(oData3 , response){
					                     	    	                                              	that.oPlantDD.setProperty("/Plants",oData3.results);
					                     	    	                                              	that.oPlantDD.setProperty("/PlantSelected",oData3.results[0].Plant);
					                     	    	                                               	var Plant_selected = oData3.results[0].Plant;
																								    sPath = "/LocationDropDownSet";
																								    filter_string =  "Plant eq '" +Plant_selected+ "'";
		                                                                                            oModel.read(sPath, {
																		                  	        urlParameters: {
																						                            "$filter" : filter_string
																													 }, 
																					                 success: function (oData4, response4){
																					                                 that.oLocDD.setProperty("/Locations",oData4.results);
																					                                 that.oLocDD.setProperty("/LocSelected",oData4.results[0].LocationId);
																					                                                    },
																					                 error: function () {
																	     			                            	sap.m.MessageToast.show("No Data retreived");
																							                        	}  });
					                     	                                                                       },  
					                     	                                            error: function(oError) {
																		                            var error_msg =  jQuery.parseJSON(oError.responseText).error.message.value;
															    	                                sap.m.MessageToast.show(error_msg);
															                                        return;
															                                        } });
								                        	          },//END OF retriving the vehicle details
		                                                     	                  
						                        	                 error: function () {
						                        	                	             that.oLocalVhModel.setProperty("/Vehicleid","");
								                        	                         that.oLocalVhModel.setProperty("/VehicleName","");
								                        	                         that.oLocalVhModel.setProperty("/VehicleVendor","");
								                        	                         that.oLocalVhModel.setProperty("/VehicleNumber","");
								                        	                         that.oLocalVhModel.setProperty("/Plant","");
								                        	                         that.oLocalVhModel.setProperty("/Location","");
							                                                          	}              });
								                 	},    
											        error: function (oError) {
											        	   var error_msg =  jQuery.parseJSON(oError.responseText).error.message.value;
										    	           sap.m.MessageToast.show(error_msg);
										                   return;
												                    } 
							                        	
							                        });
                     },
                     
                       onSelectPlant: function( oEvent){
											var Plant_selected = this.getView().getModel("localPlantDD").getProperty("/PlantSelected");
											var oModel = this.getView().getModel();
											var sPath = "/LocationDropDownSet";
											var filter_string =  "Plant eq '" +Plant_selected+ "'";
											var that = this;
											
		                  oModel.read(sPath, {
		                  	          urlParameters: {
						                            "$filter" : filter_string
													 }, 
					                 success: function (oData, response){
					                                 that.oLocDD.setProperty("/Locations",oData.results);			                 	                                       },
					                 error: function () {
	     			                            	sap.m.MessageToast.show("No Data retreived");
							                        	}  });
				 	},
                     
                     onSubmitRequest  : function () {
                         
                     	 var request_id   = this.getView().byId("idRequestid").getValue();
                         var plant_id     = this.getView().byId("IdSelectedPlant").getSelectedKey();
                         var loc_id       = this.getView().byId("IdSelectedLoc").getSelectedKey();
                         var shipper_name = this.getView().byId("idShname").getValue();
                         var ship_cost    = this.getView().byId("idCost").getValue();
                         var contact      = this.getView().byId("idContact").getValue();
                         var expected_date = this.oInputDate.getProperty("/ArrivalDate");
                         
                         var day   = expected_date.getDate();
                         var month = expected_date.getMonth();
                         var year  = expected_date.getFullYear();
                         
                         var expected_date1 = day+"-"+month+"-"+year;
                         var flc_create = {
						            RequestId               : request_id,
						            ShipToPlant             : plant_id,
                                    ShipToLoc               : loc_id,
                                    NameOfShipper           : shipper_name,
                                    Cost                    : ship_cost,
                                    ShipperContact          : contact,
                                    ExDate                  : expected_date1
				                    };
                         
                         
                     	    var oModel = this.getView().getModel();
		                	var that   = this;                      
                     	    oModel.create("/SubmitFLCSet", flc_create,{
                     	                                            success: function(oData , response){
                     	    	                                              sap.m.MessageToast.show("Shipment Details Has been successfully");
                     	    	                                              that.getView().getModel("Visibility").setProperty("/SubmitVisibile",false);
                     	                                                                               },  
                     	                                             error: function(oError) {
                     	                                             	        sap.m.MessageToast.show("Unable to Save the Data");
										                                        return;
												                                            } 
                     	    	
                     	    });                            
                     	
                     }
	});
});