# cis-mssql
Implementation of CIS Microsoft SQL Server Benchmark

## General
These instructions will get a copy of the cis-mssql project up and running on your local machine for development and testing purposes.

## Getting started - setup
* Make sure to have node.js **version 6.10** or up.
* Clone this Repo.
```
git clone https://github.com/Dome9/cis-mssql.git
```
* Install dependencies:
```
cd cis-mssql
npm install
```
* Make sure your execution environment has network access to the MS SQL Servers

Parameter | Description | Example
--- | --- | ---
**bundlePath**|  Relative path and Bundle Name (without extension) | ```./bundles/cis-bundle-sql2012```
**testId**|  CIS Benchmark Test ID Reference Number | ```3.10 or *```
**dbConnStringUri** |  Database Connection String URI | ```mssql://sa:Test1234@11.22.33.44:1433/master?encrypt=false```

## Running the script (from local station)
Once all the dependencies are installed, run the script with the three required parameters.

Syntax:
```
node cis-mssql.js <bundlePath> <testId> <dbConnStringUri>
```
Examples:
```
node cis-mssql.js ./bundles/cis-bundle-sql2012 3.10 mssql://sa:Test1234@11.22.33.44:1433/master?encrypt=false
node cis-mssql.js ./bundles/cis-bundle-sql2012 * mssql://sa:Test1234@11.22.33.44:1433/master?encrypt=false
```
Note: Azure requires encrypt=true in the Connection String URI.

## Bundles
Test bundles are found in the *bundles* subfolder of this project and may be used as a template for creating custom bundles.

The sample CIS Microsoft SQL Server 2012 Benchmark bundle can be found in *./bundles/cis-bundle-sql2012.js* (based on the CIS Microsoft SQL Server 2012 Benchmark v1.4.0)
Tests included in sample: 
[ 2.01, 2.02, 2.03, 2.04, 2.05, 3.01, 3.04, 3.08, 3.09, 3.10 ]

## Deploying the script to AWS Lambda

When creating the lamba function use these settings:
* Runtime: Node.JS 6.10
* Handler: lambda.myHandler
* Role: create a new role for `cis-mssql`. This will be a placeholder role for future development.
* Timeout: Depending on your environemnt size, the bundle size (# of rules) and configured actions. It is recommended to set the timeout to 60 seconds, and to monitor the execution time.
* VPC : no need to be run inside VPC unless your custom actions needs to have network connections to your VPC instances/data.
* Environment Variables: *Make sure* to include the required environment variables:
    * bundlePath
    * testId 
    * dbConnStringUri
