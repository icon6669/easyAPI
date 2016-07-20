(function ($, MarketingCloud) {

/*
	function fillReportsSelect() {
		getAnalyticsClient().makeRequest('Company.GetReportSuites', '', function reportSuitesPopulate(data) {}).fail(function(data) {
            $(document).trigger("add-alerts", {
                message: data.responseJSON.error_description,
                priority: "error"
            });
        });
	}


	function getReportData(reportIdObj) {
		getAnalyticsClient().makeRequest("Report.Get", reportIdObj, handleResults).fail(function (reportData) {
			if (reportData.responseJSON.error == "report_not_ready") {
				setTimeout(getReportData.bind(this, reportIdObj), 1500);
			}
			else {
                $(document).trigger("add-alerts", {
                    message: data.responseJSON.error_description,
                    priority: "error"
                });
                hideSpinner();
			}
		}).done(function() {
            hideSpinner();
		});
	}
*/
	function getSegmentsList() {
requestJSON='';
		getAnalyticsClient().makeRequest("Segments.Get", requestJSON, handleResults).fail(function (reportData) {
			if (typeof data.responseJSON.error_description !== "undefined") {
				console.log("api responseJSON.error is: "+data.responseJSON.error_description);
			}
		}).done(function() {
        console.log("api response passed to handleResults function");
		});
	}

	function handleResults(data) {
		console.log("data passed to handleResults is: "+data);
	}

	function getAnalyticsClient() {
		return MarketingCloud.getAnalyticsClient(omUsername, omSharedSecret, omEndpoint);
	}


})(jQuery, window.MarketingCloud);
