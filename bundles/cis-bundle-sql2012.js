// Required SQL Server: 2012
module.exports = [
	{testId: "2.01",
	name: "'Ad Hoc Distributed Queries' Server Configuration Option is set to '0'",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'Ad Hoc Distributed Queries';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "2.02",
	name: "Ensure 'CLR Enabled' Server Configuration Option is set to '0'",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'clr enabled';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "2.03",
	name: "Ensure 'Cross DB Ownership Chaining' Server Configuration Option is set to '0'",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'cross db ownership chaining';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "2.04",
	name: "Ensure 'Database Mail XPs' Server Configuration Option is set to '0'",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'Database Mail XPs';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "2.05",
	name: "Ensure 'Ole Automation Procedures' Server Configuration Option is set to '0'",
	auditSql: "SELECT name, CAST(value as int) as value_configured, CAST(value_in_use as int) as value_in_use FROM sys.configurations WHERE name = 'Ole Automation Procedures';",
	check: function(rowCount, rows) {
		if (rows[0].value_configured == '0' && rows[0].value_in_use == '0') {
			return true;
			}
		else {
			return false;
		}}
	},
	{testId: "3.01",
	name: "Ensure 'Server Authentication' Property is set to 'Windows Authentication Mode'",
	auditSql: "SELECT SERVERPROPERTY('IsIntegratedSecurityOnly') as [login_mode];",
	check: function(rowCount, rows) {
		if (rows[0].login_mode == '1') {
			// login_mode of 1 = Windows Authentication enabled
			return true;
			}
		else {				
			return false;
		}}
	},
	{testId: "3.04",
	name: "Ensure SQL Authentication is not used in contained databases ",
	auditSql: "SELECT name AS DBUser FROM sys.database_principals WHERE name NOT IN ('dbo','Information_Schema','sys','guest') AND type IN ('U','S','G') AND authentication_type = 2;",
	check: function(rowCount, rows) {
		return ! rowCount
	}},
	{testId: "3.08",
	name: "Ensure only the default permissions specified by Microsoft are granted to the public server role",
	auditSql: "SELECT * FROM master.sys.server_permissions WHERE (grantee_principal_id = SUSER_SID(N'public') and state_desc LIKE 'GRANT%') AND NOT (state_desc = 'GRANT' and [permission_name] = 'VIEW ANY DATABASE' and class_desc = 'SERVER') AND NOT (state_desc = 'GRANT' and [permission_name] = 'CONNECT' and class_desc = 'ENDPOINT' and major_id = 2) AND NOT (state_desc = 'GRANT' and [permission_name] = 'CONNECT' and class_desc = 'ENDPOINT' and major_id = 3) AND NOT (state_desc = 'GRANT' and [permission_name] = 'CONNECT' and class_desc = 'ENDPOINT' and major_id = 4) AND NOT (state_desc = 'GRANT' and [permission_name] = 'CONNECT' and class_desc = 'ENDPOINT' and major_id = 5);",
	check: function(rowCount, rows) {
		return ! rowCount
	}},
	{testId: "3.09",
	name: "Ensure Windows BUILTIN groups are not SQL Logins",
	auditSql: "SELECT pr.[name], pe.[permission_name], pe.[state_desc] FROM sys.server_principals pr JOIN sys.server_permissions pe ON pr.principal_id = pe.grantee_principal_id WHERE pr.name like 'BUILTIN%';",
	check: function(rowCount, rows) {
		return ! rowCount
	}
	},
	{testId: "3.10",
	name: "Ensure Windows local groups are not SQL Logins",
	auditSql: "USE [master]; SELECT pr.[name] AS LocalGroupName, pe.[permission_name], pe.[state_desc] FROM sys.server_principals pr JOIN sys.server_permissions pe ON pr.[principal_id] = pe.[grantee_principal_id] WHERE pr.[type_desc] = 'WINDOWS_GROUP' AND pr.[name] like CAST(SERVERPROPERTY('MachineName') AS nvarchar) + '%';",
	check: function(rowCount, rows) {
		return ! rowCount
	}}
];