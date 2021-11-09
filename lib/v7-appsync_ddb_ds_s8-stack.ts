import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as appsync from "@aws-cdk/aws-appsync";

export class V7AppsyncDdbDsS8Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // AppSync API
    const api = new appsync.GraphqlApi(this, "step8", {
      name: "step8API",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    // dynamoDB Table
    const ddbTable = new ddb.Table(this, "ddbtable", {
      tableName: "step8table",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
      readCapacity: 1,
      writeCapacity: 1,
    });

    // Attaching DynamoDB Table as a DataSource to AppSync API
    const datasource = api.addDynamoDbDataSource("datasource", ddbTable);

    // Resolvers
    // Query => Notes
    datasource.createResolver({
      typeName: "Query",
      fieldName: "notes",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    // Mutation => createNote
    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "createNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").auto(),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    // Mutation => updateNote
    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PartitionKey.partition("id").is("id"),
        appsync.Values.projecting()
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    // Mutation => deleteNote
    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem(
        "id",
        "id"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
  }
}
