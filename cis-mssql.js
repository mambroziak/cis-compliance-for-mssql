const sql = require('mssql');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

var report = {}
var promisesArray = [];

function findLastChar(targetStr, targetChar) {
	if (targetStr.lastIndexOf(targetChar) == -1) { return targetObj.length	}
	else { return targetStr.lastIndexOf(targetChar) }
};

function performAssessment(bundlePathArg, testIdArg, dbConnStringUriArg) {
	var success = true;

	try {
		// Check/fix bundle path parameter
		if (bundlePathArg.indexOf('.js') > -1) {
			bundlePathArg = bundlePathArg.substring(0, bundlePathArg.indexOf('.js'));
			console.log("bundlePath has .js extension. Fixing: " + bundlePathArg);
		};
		
		// Load bundle from path
		console.log("bundlePath: " + bundlePathArg);
		var bundleObj = require(bundlePathArg);
		
		// Find CIS Bundle Info
		if (testIdArg == '*') { // * = all tests
			var testsToRun = bundleObj
			testsToRun.forEach(function(bundleTest, index) {
				console.log("\nFound Test ID: " + bundleTest.testId + " - " + bundleTest.name);
			});
		}
		else { // Find test in bundle
		var testsToRun = []
			for (i=0; i < bundleObj.length; i++) {
				var test = null
				if (bundleObj[i].testId == testIdArg) {
					var test = {testId: bundleObj[i].testId, name: bundleObj[i].name, auditSql: bundleObj[i].auditSql, check: bundleObj[i].check};
					testsToRun.push(test);
					console.log("\nFound Test ID: " + test.testId + " - " + test.name);
					success = true;
					break;
				}
				else {
					success = false;
				}
			};
			
			if (! test) { // Log error if test not found in bundle
				console.error("\tBundle did not contain test with Test ID: " + testIdArg);
			};
		};
		
		// Parse DB Connection String URI
		var dbConnStringUri = dbConnStringUriArg
		var dbServer = dbConnStringUri.substring(dbConnStringUri.lastIndexOf('@') + 1, findLastChar(dbConnStringUri, '?'));
		var report = { 'data': { 'dbServer': dbServer, 'tests': [] } };
	}
	catch(err) {
		console.error("Failed to process 1 or more parameters.");
		console.error(err);	
		success = false;
	}
	
	if (success) {
		console.log("\nTotal number of tests to be run: " + testsToRun.length);
		
		var runQuery = async (function (query, tRef) {
			try {
				var conn = new sql.ConnectionPool(dbConnStringUri);
				await (conn.connect());
				var req = new sql.Request(conn);
				var recordset = await (req.query(query));
				conn.close();
				return {tRef: tRef, response: recordset};
			} catch (err) {
				console.log("\n*** Error running query: " + query);
				conn.close();
				console.error(err);
				return {tRef: tRef, response: null};
			}
		});
		
		testsToRun.forEach(function(test, index) {
			promisesArray.push(  // start: promise wrapper
				runQuery(test.auditSql, index).then(function(auditResult) {
					var validationCheckResult = ""
					var tRef = auditResult.tRef

					console.log("\n______________________________________________________________________");
					console.log("Running benchmark test on: " + dbServer);
					console.log("testID: " + testsToRun[tRef].testId + " - " + testsToRun[tRef].name + "\n");

					if (auditResult.response) {
						console.log(auditResult.response.recordsets[0]);
						rowCount = auditResult.response.recordsets[0].length;
						rows = auditResult.response.recordsets[0]
						console.log("\n\tRows returned: " + rowCount);
						validationCheckResult = testsToRun[tRef].check(rowCount, rows)
						console.log("\tValidation Check Success = " + validationCheckResult);
					}
					// Log results
					switch(validationCheckResult) {
						case true:
							testResult = "PASS";
							break;
						case false:
							testResult = "FAIL";
							break;
						default: 
							testResult = "ERROR";
					};
					console.log("\n\t" + testsToRun[tRef].testId + " : " + testResult);
					report.data.tests.push({ 'testId': testsToRun[tRef].testId, 'testResult': testResult });
				}).catch(function(err) {
					console.error(err);			
				})
			); // end: promise wrapper 
		});
		var retPromise = Promise.all(promisesArray).then (arrResp => { // Wait for all queries to complete then build and sort report
			report.data.tests = report.data.tests.sort(function (a, b) {
				return a.testId > b.testId
			});
			console.log(report.data);
			return report;
		});
	};
	success;
	return retPromise;
};

exports.performAssessment = performAssessment;

// Are we running it directly or loaded as library
if (require.main === module) {
    // running directly as a nodejs main module.
    console.log("Running cis-mssql as a console app (non library)");
    
	// Consume Args at CLI or as Env variables
	var cliArgs = process.argv.slice(2);
	var success = true;

	if (cliArgs.length == 3) { // Consume from Command Line
		console.log("Found command line parameters.");
		var bundlePathArg = cliArgs[0]; // Relative path to bundle file (without extension)
		var testIdArg = cliArgs[1]; // Test ID or use * for all tests in bundle
		var dbConnStringUriArg = cliArgs[2]; // DB connection string URIs (delimited with a comma)
		success = true;
	}
	else if (process.env.bundlePath && process.env.testId && process.env.dbConnStringUri) { // Consume from Environment Variables (same constraints as above)
		console.log("Found environment variables as parameters.")
		var bundlePathArg = process.env.bundlePath;
		var testIdArg = process.env.testId;
		var dbConnStringUriArg = process.env.dbConnStringUri;
		
		success = true;
	}
	else {
		console.error("1 or more parameters are missing. \n Parameters required: <bundlePath> <testId> <dbConnStringUri>");
		process.argv.forEach(function (val, index, array) {
			console.log(index + ': ' + val);
		});
		success = false;
	};
	
    if (success) {
		performAssessment(bundlePathArg,testIdArg,dbConnStringUriArg)		
	};
};