// Required SQL Server: 2008 R2
module.exports = [
	{testId: "1.01",
	name: "Sample Databases Exist (SCOR(2K8)1.012 (2.9))",
	auditSql: "SELECT COUNT(name) as 'count' FROM sys.databases WHERE [Name] = 'Northwind';",
	check: function(rowCount, rows) {
		if (rows[0].count == 0) {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.02",
	name: "User Defined Schemas are Owned by 'dbo' (System Databases) (SCOR(2K8)1.068 (4.11))",
	auditSql: "SELECT count(*) as 'count' FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE ='BASE TABLE' AND NOT TABLE_SCHEMA ='dbo';",
	check: function(rowCount, rows) {
		if (rows[0].count == 0) {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.03",
	name: "Data Access Server Option is Enabled (SCOR(2K8)1.077 (4.21))",
	auditSql: "SELECT is_data_access_enabled FROM sys.servers;",
	check: function(rowCount, rows) {
		if (! rows[0].is_data_access_enabled) {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.04",
	name: "Remote Access is Enabled (MSSQL 2005 and Later) (SCOR(2K8)1.014 (2.11))",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'remote access';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.05",
	name: "Unauthorized Linked Servers Exist, or Unauthorized Users can Access Authorized Linked Servers (SCOR(2K8)1.079 (4.23))",
	auditSql: "SELECT name, is_linked FROM sys.servers;",
	check: function(rowCount, rows) {
		for (i=0; i < rowCount; i++) {
			if (! rows[i].is_linked) {
				var checkResult = true;
				}
			else {
				console.log("\t" + rows[i].name + " is_linked=" + rows[i].is_linked + " ...Fail");
				var checkResult = false;
				break;
			}};
			return checkResult;
		}
	},
	{testId: "1.06",
	name: "Linked Servers Which Are Using The User's Current Identity (4.22)",
	auditSql: "SELECT a.name, b.uses_self_credential FROM sys.servers a join sys.linked_logins b on a.server_id =  b.server_id;",
	check: function(rowCount, rows) {
		for (i=0; i < rowCount; i++) {
			if (! rows[i].uses_self_credential) {
				var checkResult = true;
				}
			else {
				console.log("\t" + rows[i].name + " uses_self_credential=" + rows[i].uses_self_credential + " ...Fail");
				var checkResult = false;
				break;
			}};
			return checkResult;
		}
	},
	{testId: "1.07",
	name: "Databases With 'Cross DB Ownership Chaining' Option Enabled (SCOR(2K8)1.091 (8.1))",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'cross db ownership chaining';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.08",
	name: "Ad Hoc Distributed Queries Option is Enabled (SCOR(2K8)1.093 (9.1))",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'ad hoc distributed queries';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "9",
	name: "clr_enabled Feature is not Disabled and is not Required (SCOR(2K8)1.094 (9.2))",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'clr enabled';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.10",
	name: "Media Retention Option Default Value was Changed (SCOR(2K8)1.018 (3.2.7))",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'media retention';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.11",
	name: "User Defined Schemas are Owned by 'dbo' (User Databases) (SCOR(2K8)1.069 (4.11.1))",
	auditSql: "SELECT count(*) as 'count' FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE ='BASE TABLE' AND NOT TABLE_SCHEMA ='dbo';",
	check: function(rowCount, rows) {
		if (rows[0].count == 0) {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "1.12",
	name: "OLE Automation Procedure is Enabled (SCOR(2K8)1.098 (9.6))",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'Ole Automation Procedures';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	}
]