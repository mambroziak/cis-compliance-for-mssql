const cismssql = require('./cis-mssql');

function myHandler(event, context, callback) {
	var handlerSuccess = true;
	
	if (process.env.bundlePath && process.env.bundlePath && process.env.dbConnStringUri) { // Consume from Environment Variables
		console.log("Found environment variables as parameters.")
		// Mandatory parameters. Should be provided as environment variables.
		var bundlePathArg = process.env.bundlePath; // Relative path to bundle file (without extension)
		var testIdArg = process.env.testId; // Test ID or use * for all tests in bundle
		var dbConnStringUriArg = process.env.dbConnStringUri; // DB connection string URIs (delimited with a comma)
		
		handlerSuccess = true;
	}
	else {
		console.error("1 or more parameters are missing. \n Parameters required: <bundlePath> <testId> <dbConnStringUri>");
		process.argv.forEach(function (val, index, array) {
			console.log(index + ': ' + val);
		});
		
		handlerSuccess = false;
	};
	
	if (handlerSuccess) {
		var respPromise = cismssql.performAssessment(bundlePathArg, testIdArg, dbConnStringUriArg);
		respPromise.then (assessmentReport => { 
			callback(null, assessmentReport.data)
		});
	};

	handlerSuccess;
};

exports.myHandler = myHandler;

myHandler(null, null, console.log);